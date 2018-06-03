# Catalogue

Convert supermarket catalogue specials to Markdown to post on OzBargain.

## Example

```javascript
const OzBargainCataloguePost = require('./ozbCataloguePost');

const app = async () => {
  const supermarkets = [
    {
      name: 'coles',
      catalogueId: 22322,
      locationId: 8245,
      retailerId: 148,
    },
    {
      name: 'woolworths',
      catalogueId: 22435,
      comparator: item => item.priceText.indexOf('1/2 Price') !== -1 && item.saleDatesText.startsWith('Offer valid Wed 30 May'),
      locationId: 4778,
      retailerId: 126,
      selectors: {
        item: {
          name: '.shelfProductTile-descriptionLink',
        },
      },
    },
  ];

  const supermarket = supermarkets[1];

  const ozb = new OzBargainCataloguePost(
    supermarket.retailerId,
    supermarket.catalogueId,
    supermarket.locationId,
    supermarket.selectors,
    0.5,
    supermarket.comparator,
  );
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
