import { assert } from 'chai';

import Item from '../../src/api/Item';
import SaleFinderAPI from '../../src/api';
import WoolworthsCatalogue from '../../src/catalogue/WoolworthsCatalogue';

describe('WoolworthsCatalogue', () => {
  describe('#itemIsHalfPrice()', () => {
    it('should return true for an item from the current catalogue with the text `1/2 Price`', () => {
      const item = new Item('Item 1', 10, 5, 1, '1/2 Price');
      const catalogue = new WoolworthsCatalogue(new SaleFinderAPI(), 1);
      assert.isTrue(catalogue.itemIsHalfPrice(item));
    });

    it('should return false if the item does not have the text `1/2 Price`', () => {
      const item = new Item('Item 1', 10, 5, 1, '');
      const catalogue = new WoolworthsCatalogue(new SaleFinderAPI(), 1);
      assert.isFalse(catalogue.itemIsHalfPrice(item));
    });

    it('should return false for an item from a different catalogue', () => {
      const item = new Item('Item 1', 10, 5, 1, '1/2 Price');
      const catalogue = new WoolworthsCatalogue(new SaleFinderAPI(), 2);
      assert.isFalse(catalogue.itemIsHalfPrice(item));
    });
  });
});
