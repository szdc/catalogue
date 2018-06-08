import * as fs from 'fs';
import { assert } from 'chai';

import Category from '../src/api/Category';
import Item from '../src/api/Item';
import { renderMarkdown } from '../src/Renderer';

describe('#renderMarkdown()', () => {
  it('should return a valid Markdown table', () => {
    const category = new Category('Category 1', [1], [
      new Item('Item 1', 100, 50, 1, ''),
    ]);

    const markdown = renderMarkdown([category]);
    assert.equal(markdown, fs.readFileSync('test/testdata/table.md').toString());
  });

  it('should skip a category if it has no items', () => {
    const categories = [
      new Category('Category 1', [1], [
        new Item('Item 1', 100, 50, 1, ''),
      ]),
      new Category('Category 2', [1], []),
    ];

    const markdown = renderMarkdown(categories);
    assert.equal(markdown, fs.readFileSync('test/testdata/table.md').toString());
  });

  it('should skip an item if it was part of a previous category', () => {
    const categories = [
      new Category('Category 1', [1], [
        new Item('Item 1', 100, 50, 1, ''),
      ]),
      new Category('Category 2', [1], [
        new Item('Item 1', 100, 50, 1, ''),
        new Item('Item 2', 100, 50, 1, ''),
      ]),
    ];

    const markdown = renderMarkdown(categories);
    assert.equal(markdown, fs.readFileSync('test/testdata/table-skipped-item.md').toString());
  });

  it('should separate tables with a new line', () => {
    const categories = [
      new Category('Category 1', [1], [
        new Item('Item 1', 100, 50, 1, ''),
      ]),
      new Category('Category 2', [1], [
        new Item('Item 2', 100, 50, 1, ''),
      ]),
    ];

    const markdown = renderMarkdown(categories);
    assert.equal(markdown, fs.readFileSync('test/testdata/table-multiple-categories.md').toString());
  });
});
