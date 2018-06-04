import { CatalogueParser, DefaultCatalogueParser, ItemSelectors } from '../api/CatalogueParser';
import Category from '../api/Category';
import { ISaleFinderAPI, SaleFinderAPIConfig } from '../api/API';

export default class WoolworthsCatalogue {
  readonly api: ISaleFinderAPI;
  readonly parser: CatalogueParser;
  readonly retailerId: number;
  readonly catalogueId: number;
  readonly locationId: number;

  specialsByCategory: Category[];

  constructor(api: ISaleFinderAPI, catalogueId: number, retailerId = 126, locationId = 4778) {
    this.api = api;
    this.catalogueId = catalogueId;
    this.retailerId = retailerId;
    this.locationId = locationId;
    this.specialsByCategory = [];
    this.parser = new DefaultCatalogueParser({
      name: '.shelfProductTile-descriptionLink',
      catalogueId: '.shelfProductTile-descriptionLink',
    } as ItemSelectors);
    this.api.updateConfig({ catalogueParser: this.parser } as SaleFinderAPIConfig);
  }

  load = async () => {
    this.specialsByCategory = await this.api.getCategoriesWithItems(this.catalogueId, this.retailerId, this.locationId);
  }
}
