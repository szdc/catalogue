import axios from 'axios';

import { ISaleFinderAPI, SaleFinderAPIConfig } from '../api';
import { CatalogueParser, DefaultCatalogueParser } from '../api/CatalogueParser';
import Category from '../api/Category';
import Item from '../api/Item';

export default class ColesCatalogue {
  readonly api: ISaleFinderAPI;
  readonly parser: CatalogueParser;
  readonly retailerId: number;
  readonly catalogueId: number;
  readonly locationId: number;

  specialsByCategory: Category[];

  static getCatalogues = (apiKey: string, postcode = 2000, format = 'njson') =>
    axios.get<ColesCatalogueResponse|string>(
      'https://webservice.salefinder.com.au/index.php/api/sales/colescatalogues/',
      {
        params: {
          postcode,
          format,
          apikey: apiKey,
        },
      },
    ).then((res) => {
      if (!(<ColesCatalogueResponse>res.data).items) {
        throw new Error(<string>res.data);
      }
      return (<ColesCatalogueResponse>res.data).items;
    })

  constructor(api: ISaleFinderAPI, catalogueId: number, retailerId = 148, locationId = 8245) {
    this.api = api;
    this.catalogueId = catalogueId;
    this.retailerId = retailerId;
    this.locationId = locationId;
    this.specialsByCategory = [];
    this.parser = new DefaultCatalogueParser();
    this.api.updateConfig({ catalogueParser: this.parser } as SaleFinderAPIConfig);
  }

  /**
   * Loads the catalogue.
   *
   * @returns {Promise<void>}
   */
  load = async () => {
    this.specialsByCategory = await this.api.getCategoriesWithItems(this.catalogueId, this.retailerId, this.locationId);
  }

  /**
   * Determines if an item is half price.
   *
   * @param {Item} item
   * @returns {boolean}
   */
  itemIsHalfPrice = (item: Item) =>
    item.getDiscountPercent() >= 0.5
    // Some items show the regular price instead of how much you save, so explicitly look for the phrase 1/2 Price
    && item.priceText.indexOf('Save') !== -1

  /**
   * Renders the categories and items in the catalogue.
   *
   * @param {(categories: Category[]) => string} renderer
   * @param {(item: Item) => boolean} itemFilter
   * @returns {string}
   */
  render = (renderer: (categories: Category[]) => string, itemFilter?: (item: Item) => boolean) => {
    let categories = this.specialsByCategory;

    if (typeof itemFilter === 'function') {
      categories = categories.map(category => ({
        ...category,
        items: category.items.filter(itemFilter),
      }));
    }

    return renderer(categories);
  }
}

export interface ColesCatalogueResponse {
  items: ColesCatalogueDetail[];
}

export interface ColesCatalogueDetail {
  catalogueLink?: string;
  dateDisplay: string;
  description?: string;
  displayName: string;
  endDate?: string;
  featureImage?: string;
  publishDate?: string;
  saleId?: string;
  saleName: string;
  startDate: string;
  updateTimeStamp?: string;
}
