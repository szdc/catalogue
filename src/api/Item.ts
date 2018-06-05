export default class Item {
  public readonly name: string;
  public readonly salePrice: number;
  public readonly regularPrice: number;
  public readonly catalogueId: number;
  public readonly priceText: string;

  constructor(name: string, regularPrice: number, salePrice: number, catalogueId: number, priceText: string) {
    this.name = name;
    this.regularPrice = regularPrice;
    this.salePrice = salePrice;
    this.catalogueId = catalogueId;
    this.priceText = priceText;
  }

  getDiscount = () => this.regularPrice - this.salePrice;

  getDiscountPercent = () => this.getDiscount() / this.regularPrice;

  getDiscountPercentFormatted = () => `${Math.round(this.getDiscountPercent() * 100)}%`;
}
