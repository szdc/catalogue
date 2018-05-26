const axios = require('axios');
const cheerio = require('cheerio');
const Category = require('./category');

class SaleFinderAPI {
  constructor() {
    this.request = axios.create({
      baseURL: 'https://embed.salefinder.com.au/',
      timeout: 2000,
    });
  }

  getCategories(catalogueId, retailerId) {
    return this.request.get(`catalogue/getNavbar/${catalogueId}`, {
      params: {
        format: 'json',
        retailerId,
      },
    })
      .then(SaleFinderAPI.parseResponseAsJSON)
      .then(({ content }) => {
        const $ = cheerio.load(content);
        const $categories = $('.sf-navcategory-link');

        const categories = [];
        $categories.each((i, category) => {
          categories.push(new Category(
            $(category).attr('title'),
            $(category).attr('href')
              .match(/(?:categoryId=)([\d,]+)/)[1]
              .split(',')
              .map(Number),
          ));
        });

        return categories;
      });
  }

  getCategorySpecials(category, catalogueId, locationId) {
    return this.request.get(`productlist/category/${catalogueId}`, {
      params: {
        categoryId: Array.isArray(category.ids) ? category.ids.join(',') : category.ids,
        locationId,
        rows_per_page: 200,
        saleGroup: 0,
      },
    })
      .then(SaleFinderAPI.parseResponseAsJSON)
      .then(({ content }) => Category.withItemsFromHTML(
        category.name,
        category.ids,
        content.replace(/[\r\n\t]/g, ''),
      ));
  }

  static parseResponseAsJSON(res) {
    return JSON.parse(res.data.substring(1, res.data.length - 1));
  }
}

module.exports = SaleFinderAPI;
