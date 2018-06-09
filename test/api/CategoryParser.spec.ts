import * as fs from 'fs';
import * as cheerio from 'cheerio';
import { assert } from 'chai';

import { DefaultCatalogueParser } from '../../src/api/CatalogueParser';
import Category from '../../src/api/Category';

describe('DefaultCategoryParser', () => {
  describe('#parseCategoryList()', () => {
    it('should parse correctly', () => {
      const content = fs.readFileSync('test/api/testdata/category-list.html').toString();
      const $ = cheerio.load(content);

      const parser = new DefaultCatalogueParser();
      const categories = parser.parseCategoryList($);

      assert.deepEqual(categories, [
        new Category('Bread & Bakery', [563], []),
        new Category('Pantry', [533, 534, 535, 537, 538, 548], []),
      ]);
    });
  });

  describe('#parseCategory()', () => {
    it('should parse correctly', () => {
      const content = fs.readFileSync('test/api/testdata/category.html').toString();
      const $ = cheerio.load(content);

      const parser = new DefaultCatalogueParser();
      const items = parser.parseCategory($);
      assert.lengthOf(items, 2);
      assert.equal(items[0].name, 'Doritos Corn Chips 150g-170g');
      assert.equal(items[1].name, 'Coles Ultimate Mini Pies Apple or Cherry 6 Pack');
    });
  });

  describe('#parseItem()', () => {
    it('should parse correctly', () => {
      const content = fs.readFileSync('test/api/testdata/item.html').toString();
      const $ = cheerio.load(content);

      const parser = new DefaultCatalogueParser();
      const item = parser.parseItem($.root());

      assert.equal(item.name, 'Doritos Corn Chips 150g-170g');
      assert.equal(item.regularPrice, 3.30);
      assert.equal(item.salePrice, 1.65);
      assert.equal(item.priceText, 'Was $3.30, Save $1.65');
    });
  });
});
