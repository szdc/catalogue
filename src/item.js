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
Item.fromHTML = ($item) => {
  const name = $item.find('.sf-item-heading').text();
  const saveAmount = parseFloat($item.find('.sf-regprice').text().replace('$', ''));
  const salePrice = parseFloat($item.find('.sf-pricedisplay').text().replace('$', ''));
  const regularPrice = salePrice + saveAmount;

  return new Item(name, regularPrice, salePrice);
};

module.exports = Item;
