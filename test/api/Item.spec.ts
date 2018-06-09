import { assert } from 'chai';
import Item from '../../src/api/Item';

describe('Item', () => {
  describe('#getDiscount()', () => {
    it('calculates the discount correctly', () => {
      const item = new Item('Item 1', 10, 5, 1, '');
      assert.equal(item.getDiscount(), 5);
    });
  });

  describe('#getDiscountPercent()', () => {
    it('calculates the discount perecentage correctly', () => {
      const item = new Item('Item 1', 10, 5, 1, '');
      assert.equal(item.getDiscountPercent(), 0.5);
    });
  });

  describe('#getDiscountPercentFormatted()', () => {
    it('formats the discount percentage correctly', () => {
      const item = new Item('Item 1', 15, 10, 1, '');
      assert.equal(item.getDiscountPercentFormatted(), '33%');
    });
  });
});
