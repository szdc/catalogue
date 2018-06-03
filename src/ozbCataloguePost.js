const SaleFinderAPI = require('./api');

class OzBargainCataloguePost {
  constructor(retailerId, catalogueId, locationId, selectors = {}, threshold = 0.5, comparator) {
    this.api = new SaleFinderAPI(selectors);
    this.catalogueId = catalogueId;
    this.comparator = comparator;
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
    const seen = new Map();

    return this.specialsByCategory
      .map((category) => {
        const tableHeader = `|${category.name}|Was|Now|Discount|\n|-|-|-|-|`;

        let halfPriceItems = category.items
          .filter(i => i.getDiscountPercent() >= this.threshold)
          .filter((item) => {
            if (seen.has(item.name)) {
              return false;
            }
            seen.set(item.name, true);
            return true;
          });

        if (typeof this.comparator === 'function') {
          halfPriceItems = halfPriceItems.filter(this.comparator);
        }
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
