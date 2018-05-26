const axios = require('axios');

class SaleFinderAPI {
  constructor(catalogueId, locationId) {
    this.catalogueId = catalogueId;
    this.locationId = locationId;

    this.request = axios.create({
      baseURL: 'https://embed.salefinder.com.au/',
      timeout: 2000,
    });
  }

  getCategories(categories) {
    return this.request.get(`productlist/category/${this.catalogueId}`, {
      params: {
        categoryId: Array.isArray(categories) ? categories.join(',') : categories,
        locationId: this.locationId,
        rows_per_page: 200,
        saleGroup: 0,
      },
    }).then(res => JSON.parse(res.data.substring(1, res.data.length - 1)));
  }
}

module.exports = SaleFinderAPI;
