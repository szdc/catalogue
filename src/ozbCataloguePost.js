const Category = require('./category');
const SaleFinderAPI = require('./api');

class OzBargainCataloguePost {
  constructor(catalogueId, locationId, categoryDefinitions, threshold = 0.5) {
    this.api = new SaleFinderAPI(catalogueId, locationId);
    this.categoryDefinitions = categoryDefinitions;
    this.categories = [];
    this.threshold = threshold;
  }

  async load() {
    const results = this.categoryDefinitions.map(async definition => this.loadCategory(definition));
    return Promise.all(results)
      .then((categories) => {
        this.categories = categories;
        return categories;
      });
  }

  async loadCategory(definition) {
    const html = await this.api.getCategories(definition.ids);
    return Category.fromHTML(definition.name, html.content.replace('/[\r\n\t]/g', ''));
  }

  render() {
    return this.categories
      .map((category) => {
        const tableHeader = `|${category.name}|Was|Now|Discount|\n|-|-|-|-|`;

        const halfPriceItems = category.items.filter(i => i.getDiscountPercent() >= this.threshold);
        if (halfPriceItems.length === 0) {
          return null;
        }

        halfPriceItems.sort((a, b) => a.name.localeCompare(b.name));
        const tableBody = halfPriceItems
          .map(item => `|${item.name}|$${item.regularPrice.toFixed(2)}|$${item.salePrice.toFixed(2)}|${item.getDiscountPercentFormatted()}|`)
          .join('\n');

        return `${tableHeader}\n${tableBody}`;
      })
      .filter(output => output !== null)
      .join('\n\n');
  }
}

module.exports = OzBargainCataloguePost;
