import Category from './api/Category';

/**
 * Renders a list of categories and their items into Markdown.
 *
 * @param {Category[]} categories
 * @returns {string}
 */
export const renderMarkdown = (categories: Category[]) => {
  const seen = new Map();

  return categories
    .map((category) => {
      const tableHeader = `|${category.name}|Was|Now|Discount|\n|-|-|-|-|`;
      const items = category.items.filter((item) => {
        if (seen.has(item.name)) {
          return false;
        }
        seen.set(item.name, true);
        return true;
      });

      if (items.length === 0) {
        return null;
      }

      items.sort((a, b) => a.name.localeCompare(b.name));
      const tableBody = items
        .map(item =>
          `|${item.name}|$${item.regularPrice.toFixed(2)}|$${item.salePrice.toFixed(2)}|` +
          `${item.getDiscountPercentFormatted()}`,
        )
        .join('\n');

      return `${tableHeader}\n${tableBody}`;
    })
    .filter(output => output !== null)
    .join('\n\n');
};
