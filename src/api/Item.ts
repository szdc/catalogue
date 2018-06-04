export default class Item {
  public readonly name: string;
  public readonly salePrice: number;
  public readonly regularPrice: number;
  public readonly catalogueId: number;

  constructor(name: string, regularPrice: number, salePrice: number, catalogueId: number) {
    this.name = name;
    this.regularPrice = regularPrice;
    this.salePrice = salePrice;
    this.catalogueId = catalogueId;
  }

  getDiscount = () => this.regularPrice - this.salePrice;

  getDiscountPercent = () => this.getDiscount() / this.regularPrice;

  getDiscountPercentFormatted = () => `${Math.round(this.getDiscountPercent() * 100)}%`;
}
