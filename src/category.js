const cheerio = require('cheerio');
const Item = require('./item');

class Category {
  constructor(name, items) {
    this.name = name;
    this.items = items;
  }
}
Category.fromHTML = (name, html) => {
  const $ = cheerio.load(html);
  const items = [];
  const $items = $('.sf-item');
  $items.each((i, item) => {
    items.push(Item.fromHTML($(item)));
  });

  return new Category(name, items);
};

module.exports = Category;
