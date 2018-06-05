import Category from './Category';
import Item from './Item';

export interface CatalogueParser {
  parseCategoryList: ($: CheerioStatic) => Category[];
  parseCategory: ($: CheerioStatic) => Item[];
  parseItem: ($: Cheerio) => Item;
}

export interface ItemSelectors {
  name: string;
  priceText: string;
  salePrice: string;
  saveAmount: string;
  catalogueId: string;
}

export class DefaultCatalogueParser implements CatalogueParser {
  private itemSelectors: ItemSelectors;

  constructor(itemSelectors: ItemSelectors = {} as ItemSelectors) {
    this.itemSelectors = {
      name: '.sf-item-heading',
      priceText: '.sf-regoption:last-of-type',
      salePrice: '.sf-pricedisplay',
      saveAmount: '.sf-regprice',
      catalogueId: '.sf-item-heading',
      ...itemSelectors,
    };
  }

  /**
   * Parses an HTML list of categories into Category objects.
   *
   * @param {CheerioStatic} $
   * @returns {Category[]}
   */
  parseCategoryList = ($: CheerioStatic) => {
    const categories: Category[] = [];
    const $categories = $('.sf-navcategory-link');

    $categories.each((_, category) => {
      const idsString = $(category).attr('href')
        .match(/(?:categoryId=)([\d,]+)/);
      if (idsString === null || idsString.length < 2) {
        return;
      }

      categories.push(new Category(
        $(category).text(),
        idsString[1].split(',').map(Number),
      ));
    });

    return categories;
  }

  /**
   * Parses the HTML response from a category request into a list of Item objects.
   *
   * @param {CheerioStatic} $
   * @returns {Item[]}
   */
  parseCategory = ($: CheerioStatic) => {
    const items: Item[] = [];
    const $items = $('.sf-item');

    $items.each((_, item) => items.push(this.parseItem($(item))));

    return items.filter(item => item.catalogueId);
  }

  /**
   * Parses a single item element into an Item object.
   *
   * @param {Cheerio} $item
   * @returns {Item}
   */
  parseItem = ($item: Cheerio) => {
    const name = $item.find(this.itemSelectors.name).text();
    const saveAmount = parseFloat($item.find(this.itemSelectors.saveAmount).text().replace('$', ''));
    const salePrice = parseFloat($item.find(this.itemSelectors.salePrice).text().replace('$', ''));
    const regularPrice = salePrice + saveAmount;

    const cIdMatchRes = $item.find(this.itemSelectors.catalogueId).attr('href').match(/saleId=(\d+)/);
    const catalogueId = cIdMatchRes !== null && cIdMatchRes.length > 1 ? Number(cIdMatchRes[1]) : -1;
    const priceText = $item.find(this.itemSelectors.priceText).text();

    return new Item(name, regularPrice, salePrice, catalogueId, priceText);
  }
}
