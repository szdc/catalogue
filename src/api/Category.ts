import Item from './Item';

export default class Category {
  readonly name: string;
  readonly ids: number[];
  items: Item[];

  constructor(name: string, ids: number[], items = []) {
    this.name = name;
    this.ids = ids;
    this.items = items;
  }
}
