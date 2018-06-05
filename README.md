# Catalogue

Convert supermarket catalogue specials to Markdown to post on OzBargain.

## Example

```javascript
const app = async () => {
  const catalogueId = 22558;
  const api = new SaleFinderAPI();
  const woolworths = new WoolworthsCatalogue(api, catalogueId);
  await woolworths.load();

  const markdown = woolworths.render(renderMarkdown, woolworths.itemIsHalfPrice);
  console.log(markdown);
};

app();

```

Outputs:
```markdown
|Baking|Was|Now|Discount|
|-|-|-|-|
|Betty Crocker Baking Mixes 400-540g – Excludes Gluten Free|$5.20|$2.60|50%
|Cadbury Baking Chips 200g|$4.25|$2.10|51%

|Beauty|Was|Now|Discount|
|-|-|-|-|
|Dove Shower Foam 400ml|$9.00|$4.50|50%
|Herbal Essences Bio Renew Shampoo or Conditioner 400ml|$12.00|$6.00|50%
|Olay Regenerist Micro Sculpting Cream 50g|$49.00|$24.50|50%
|Olay Regenerist Micro Sculpting Face Serum 50ml|$53.00|$26.50|50%
|Olay Regenerist Miracle Boost Youth Pre-Essence 40ml|$39.99|$19.99|50%
|Oral B 3D White Luxe Diamond Strong Toothpaste 95g|$9.50|$4.75|50%
|Oral B Gum Care Power Toothbrush Pk 1|$47.00|$23.50|50%

...
```
