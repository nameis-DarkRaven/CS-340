/* Part a: Generic Drawer Class  */

export class Drawer<T> {
  private items: T[] = [];

  get isEmpty(): boolean {
    return this.items.length == 0;
  }

  addItem(item: T): void {
    this.items.push(item);
  }

  removeItem(): T | undefined {
    return this.items.pop();
  }

  removeAll(): T[] {
    const allItems = this.items;
    this.items = [];
    return allItems;
  }
}

/* Part b: Generic Dresser Class  */

export class Dresser<Top, Middle, Bottom> {
  public top: Drawer<Top>;
  public middle: Drawer<Middle>;
  public bottom: Drawer<Bottom>;

  constructor() {
    this.top = new Drawer<Top>();
    this.middle = new Drawer<Middle>();
    this.bottom = new Drawer<Bottom>();
  }
}

/* Part c: Demo */

type Socks = { style: string; color: string };
type Shirt = { style: string; size: string };
type Pants = { style: string; size: number };

function demoDresser() {
  const dresser = new Dresser<Socks, Shirt, Pants>();

  dresser.top.addItem({ style: "ankle", color: "white" });
  dresser.middle.addItem({ style: "t-shirt", size: "M" });
  dresser.bottom.addItem({ style: "jeans", size: 10 });

  console.log("Top empty?", dresser.top.isEmpty);
  console.log("Removed sock:", dresser.top.removeItem());
  console.log("Top empty now?", dresser.top.isEmpty);
}

demoDresser();
