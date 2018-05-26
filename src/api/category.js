const cheerio = require('cheerio');
const Item = require('./item');

class Category {
  constructor(name, ids, items = []) {
    this.name = name;
    this.ids = ids;
    this.items = items;
  }
}
Category.withItemsFromHTML = (name, ids, html, selectorOverrides = {}) => {
  const selectors = {
    items: '.sf-item',
    item: {},
    ...selectorOverrides,
  };

  const $ = cheerio.load(html);
  const items = [];
  const $items = $('.sf-item');
  $items.each((i, item) => {
    items.push(Item.fromHTML($(item), selectors.item));
  });

  return new Category(name, ids, items);
};

module.exports = Category;
