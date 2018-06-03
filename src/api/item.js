class Item {
  constructor(name, regularPrice, salePrice, priceText = '', saleDatesText = '') {
    this.name = name;
    this.priceText = priceText;
    this.regularPrice = regularPrice;
    this.salePrice = salePrice;
    this.saleDatesText = saleDatesText;
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
    priceText: '.sf-regoption:last-of-type',
    salePrice: '.sf-pricedisplay',
    saleDatesText: '.sale-dates',
    saveAmount: '.sf-regprice',
    ...selectorOverrides,
  };

  const name = $item.find(selectors.name).text();
  const saveAmount = parseFloat($item.find(selectors.saveAmount).text().replace('$', ''));
  const salePrice = parseFloat($item.find(selectors.salePrice).text().replace('$', ''));
  const regularPrice = salePrice + saveAmount;
  const priceText = $item.find(selectors.priceText).text();
  const saleDatesText = $item.find(selectors.saleDatesText).text();

  return new Item(name, regularPrice, salePrice, priceText, saleDatesText);
};

module.exports = Item;
