class Item {
  constructor(name, regularPrice, salePrice) {
    this.name = name;
    this.regularPrice = regularPrice;
    this.salePrice = salePrice;
  }

  getDiscount() {
    return this.regularPrice - this.salePrice;
  }

  getDiscountPercent() {
    return this.getDiscount() / this.regularPrice;
  }

  getDiscountPercentFormatted() {
    return `${Math.round(this.getDiscountPercent() * 100)}%`;
  }
}
Item.fromHTML = ($item, selectorOverrides) => {
  const selectors = {
    name: '.sf-item-heading',
    saveAmount: '.sf-regprice',
    salePrice: '.sf-pricedisplay',
    ...selectorOverrides,
  };

  const name = $item.find(selectors.name).text();
  const saveAmount = parseFloat($item.find(selectors.saveAmount).text().replace('$', ''));
  const salePrice = parseFloat($item.find(selectors.salePrice).text().replace('$', ''));
  const regularPrice = salePrice + saveAmount;

  return new Item(name, regularPrice, salePrice);
};

module.exports = Item;
