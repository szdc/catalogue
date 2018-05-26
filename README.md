# Catalogue

Convert supermarket catalogue specials to Markdown to post on OzBargain.

## Example

```javascript
const app = async () => {
  const catalogueId = 22322;
  const locationId = 8245;
  const categoryDefinitions = [
    { name: 'Bread & Bakery', ids: [563] },
    { name: 'Fruit & Vegetables', ids: [526] },
    { name: 'Meat, Seafood & Deli', ids: [525, 527, 528] },
    { name: 'Pantry', ids: [533, 534, 535, 537, 538, 548] },
    { name: 'Frozen', ids: [542] },
    { name: 'Drinks', ids: [540] },
    { name: 'Healthy Living', ids: [544] },
    { name: 'Household', ids: [545, 546, 550] },
    { name: 'Health & Beauty', ids: [552, 531] },
    { name: 'Baby', ids: [529] },
    { name: 'Pet', ids: [551] },
    { name: 'Stationery & Media', ids: [672] },
    { name: 'Clothing', ids: [673] },
    { name: 'Liquor', ids: [532] },
  ];

  const ozb = new OzBargainCataloguePost(catalogueId, locationId, categoryDefinitions);
  await ozb.load();
  console.log(ozb.render());
};

app();
```

Outputs:
```markdown
|Bread & Bakery|Was|Now|Discount|
|-|-|-|-|
|Coles Bakery Block Loaf 600g-680g|$3.70|$1.80|51%|
|Coles Bakery Croissants 3 Pack or 4 Pack|$5.25|$2.50|52%|
|Golden Crumpet Breaks 6 Pack|$4.20|$2.10|50%|
|Old El Paso Premium Mexican Kit 275g-418g|$7.00|$3.50|50%|
|Tip Top English Muffins 6 Pack|$5.00|$2.50|50%|

|Meat, Seafood & Deli|Was|Now|Discount|
|-|-|-|-|
|Coles Australian No Added Hormones 3 Star Beef Mince 1kg|$15.00|$7.00|53%|
|Coles Australian No Added Hormones Beef Corned Silverside|$17.00|$8.00|53%|
|Fresh ASC Salmon Skin On Portions|$56.40|$26.50|53%|
|Lilydale Free Range Chicken Breast Fillets Bulk Pack|$30.00|$14.00|53%|
|Luv-A-Duck Frozen Duck Size 21 2.1kg|$23.00|$11.50|50%|
|Oliving Twiggy Sticks|$30.00|$15.00|50%|

...
```
