import * as cheerio from 'cheerio';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { CatalogueParser, DefaultCatalogueParser } from './CatalogueParser';
import Category from './Category';
import Item from './Item';

export interface SaleFinderAPIConfig {
  catalogueParser: CatalogueParser;
  requestInstance: AxiosInstance;
  rowsPerPage: number;
}

export interface ISaleFinderAPI {
  getCategories: (catalogueId: number, retailerId: number) => Promise<Category[]>;
  getCategoryItems: (categoryIds: number[], catalogueId: number, locationId: number) => Promise<Item[]>;
  getCategoriesWithItems: (catalogueId: number, retailerId: number, locationId: number) => Promise<Category[]>;
  updateConfig: (config: SaleFinderAPIConfig) => SaleFinderAPIConfig;
}

interface SaleFinderResponse {
  content: string;
}

export default class SaleFinderAPI implements ISaleFinderAPI {
  private config: SaleFinderAPIConfig;
  private request: AxiosInstance;

  constructor(config: SaleFinderAPIConfig = {} as SaleFinderAPIConfig) {
    this.config = {
      catalogueParser: new DefaultCatalogueParser(),
      rowsPerPage: 200,
      ...config,
    };

    this.request = this.config.requestInstance || axios.create();
    this.request.defaults.baseURL = this.request.defaults.baseURL || 'https://embed.salefinder.com.au/';
    this.request.defaults.timeout = this.request.defaults.timeout || 5000;
  }

  getCategories = (catalogueId: number, retailerId: number) =>
    this.request.get(`catalogue/getNavbar/${catalogueId}`, {
      params: {
        retailerId,
        format: 'json',
      },
    })
      .then(SaleFinderAPI.parseResponseAsJSON)
      .then(({ content }: SaleFinderResponse) => {
        const $ = cheerio.load(content);
        return this.config.catalogueParser.parseCategoryList($);
      })

  getCategoryItems = (categoryIds: number[], catalogueId: number, locationId: number) =>
    this.request.get(`productlist/category/${catalogueId}`, {
      params: {
        locationId,
        categoryId: categoryIds.join(','),
        rows_per_page: 200,
        saleGroup: 0,
      },
    })
      .then(SaleFinderAPI.parseResponseAsJSON)
      .then(({ content }: SaleFinderResponse) => {
        const $ = cheerio.load(content);
        return this.config.catalogueParser.parseCategory($);
      })

  getCategoriesWithItems = async (catalogueId: number, retailerId: number, locationId: number) => {
    const categories = await this.getCategories(catalogueId, retailerId);
    const results = categories.map(async category => this.getCategoryItems(
      category.ids,
      catalogueId,
      locationId,
    ));

    return Promise.all(results).then(items => categories.map((category, i) => {
      category.items = items[i];
      return category;
    }));
  }

  updateConfig = (config: SaleFinderAPIConfig) => {
    this.config = {
      ...this.config,
      ...config,
    };
    return this.config;
  }

  /**
   * Responses are in JSONP format, so the leading and trailing parentheses need to be stripped.
   * @param {AxiosResponse} res
   * @returns {SaleFinderResponse}
   */
  static parseResponseAsJSON = (res: AxiosResponse) =>
    JSON.parse(res.data
      .substring(1, res.data.length - 1)
      .replace(/[\r\n\t]/g, ''),
    ) as SaleFinderResponse
}
