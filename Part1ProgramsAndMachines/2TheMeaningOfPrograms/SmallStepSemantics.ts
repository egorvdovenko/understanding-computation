abstract class SReducible {
  abstract reduce(): SNumber | SAdd | SMultiply;
}

class SNumber {
  constructor(value: number) {
    this.value = value;
  }

  value: number;

  public toString(): string {
    return `${this.value}`;
  }

  get reducible(): boolean {
    return false;
  }
}

class SAdd extends SReducible {
  constructor(left: SNumber | SAdd | SMultiply, right: SNumber | SAdd | SMultiply) {
    super()

    this.left = left;
    this.right = right;
  }

  private left: SNumber | SAdd | SMultiply;
  private right: SNumber | SAdd | SMultiply;

  public toString(): string {
    return `${this.left} + ${this.right}`;
  }

  get reducible(): boolean {
    return true;
  }

  public reduce() {
    if (this.left.reducible) {
      return new SAdd((this.left as SReducible).reduce(), this.right)
    } else if (this.right.reducible) {
      return new SAdd(this.left, (this.right as SReducible).reduce())
    } else {
      return new SNumber((this.left as SNumber).value + (this.right as SNumber).value)
    }
  }
}

class SMultiply extends SReducible {
  constructor(left: SNumber | SAdd | SMultiply, right: SNumber | SAdd | SMultiply) {
    super()

    this.left = left;
    this.right = right;
  }

  private left: SNumber | SAdd | SMultiply;
  private right: SNumber | SAdd | SMultiply;

  public toString(): string {
    return `${this.left} * ${this.right}`;
  }

  get reducible(): boolean {
    return true;
  }

  public reduce() {
    if (this.left.reducible) {
      return new SMultiply((this.left as SReducible).reduce(), this.right)
    } else if (this.right.reducible) {
      return new SMultiply(this.left, (this.right as SReducible).reduce())
    } else {
      return new SNumber((this.left as SNumber).value * (this.right as SNumber).value)
    }
  }
}

var expression: SAdd | SNumber = new SAdd(
  new SMultiply(new SNumber(5), new SNumber(5)), 
  new SMultiply(new SNumber(6), new SNumber(6))
);

console.log(`new SAdd(
  new SMultiply(new SNumber(5), new SNumber(5)), 
  new SMultiply(new SNumber(6), new SNumber(6))
) = `, expression.toString());

console.log('expression.reducible: ', expression.reducible);
expression = expression.reduce() as SAdd;
console.log('expression.reduce(): ', expression.toString());

console.log('expression.reducible: ', expression.reducible);
expression = expression.reduce() as SAdd;
console.log('expression.reduce(): ', expression.toString());

console.log('expression.reducible: ', expression.reducible);
expression = expression.reduce() as SNumber;
console.log('expression.reduce(): ', expression.value);
