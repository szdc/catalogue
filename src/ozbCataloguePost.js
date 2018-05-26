const SaleFinderAPI = require('./api');

class OzBargainCataloguePost {
  constructor(retailerId, catalogueId, locationId, selectors = {}, threshold = 0.5) {
    this.api = new SaleFinderAPI(selectors);
    this.catalogueId = catalogueId;
    this.locationId = locationId;
    this.retailerId = retailerId;
    this.specialsByCategory = [];
    this.threshold = threshold;
  }

  async load() {
    const categories = await this.api.getCategories(this.catalogueId, this.retailerId);
    const results = categories.map(async category => this.api.getCategorySpecials(
      category,
      this.catalogueId,
      this.locationId,
    ));

    return Promise.all(results).then((specialsByCategory) => {
      this.specialsByCategory = specialsByCategory;
      return specialsByCategory;
    });
  }

  render() {
    return this.specialsByCategory
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
