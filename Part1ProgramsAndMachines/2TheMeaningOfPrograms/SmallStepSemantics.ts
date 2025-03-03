abstract class SReducible {
  abstract reduce(): SExpression;
}

type SExpression = SNumber | SBoolean | SAdd | SMultiply | SLessThan;

/**
 * Represents a simple number in the small-step semantics.
 * 
 * @class SNumber
 * @property {number} value - The numeric value of this instance.
 * @method toString - Returns the string representation of the number.
 * @getter reducible - Indicates whether the number is reducible (always false for SNumber).
 * 
 * @example
 * const num = new SNumber(5);
 * console.log(num.toString()); // "5"
 * console.log(num.reducible); // false
 */
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

/**
 * Represents a simple boolean in the small-step semantics.
 * 
 * @class SBoolean
 * @property {boolean} value - The boolean value of this instance.
 * @method toString - Returns the string representation of the boolean.
 * @getter reducible - Indicates whether the boolean is reducible (always false for SBoolean).
 * 
 * @example
 * const bool = new SBoolean(true);
 * console.log(bool.toString()); // "true"
 * console.log(bool.reducible); // false
 */
class SBoolean {
  constructor(value: boolean) {
    this.value = value;
  }

  value: boolean;

  public toString(): string {
    return `${this.value}`;
  }

  get reducible(): boolean {
    return false;
  }
}

/**
 * Represents an addition operation in the small-step semantics.
 * 
 * @class SAdd
 * @property {SExpression} left - The left operand of the addition.
 * @property {SExpression} right - The right operand of the addition.
 * @method toString - Returns the string representation of the addition.
 * @getter reducible - Indicates whether the addition is reducible.
 * @method reduce - Reduces the addition by reducing its operands.
 * 
 * @example
 * const add = new SAdd(new SNumber(5), new SNumber(5));
 * console.log(add.toString()); // "5 + 5"
 * console.log(add.reducible); // true
 * console.log(add.reduce()); // SNumber { value: 10 }
 */
class SAdd extends SReducible {
  constructor(left: SExpression, right: SExpression) {
    super();

    this.left = left;
    this.right = right;
  }

  private left: SExpression;
  private right: SExpression;

  public toString(): string {
    return `${this.left} + ${this.right}`;
  }

  get reducible(): boolean {
    return true;
  }

  public reduce() {
    if (this.left.reducible) {
      return new SAdd((this.left as SReducible).reduce(), this.right);
    } else if (this.right.reducible) {
      return new SAdd(this.left, (this.right as SReducible).reduce());
    } else {
      return new SNumber((this.left as SNumber).value + (this.right as SNumber).value);
    }
  }
}

/**
 * Represents a multiplication operation in the small-step semantics.
 * 
 * @class SMultiply
 * @property {SExpression} left - The left operand of the multiplication.
 * @property {SExpression} right - The right operand of the multiplication.
 * @method toString - Returns the string representation of the multiplication.
 * @getter reducible - Indicates whether the multiplication is reducible.
 * @method reduce - Reduces the multiplication by reducing its operands.
 * 
 * @example
 * const multiply = new SMultiply(new SNumber(5), new SNumber(5));
 * console.log(multiply.toString()); // "5 * 5"
 * console.log(multiply.reducible); // true
 * console.log(multiply.reduce()); // SNumber { value: 25 }
 */
class SMultiply extends SReducible {
  constructor(left: SExpression, right: SExpression) {
    super();

    this.left = left;
    this.right = right;
  }

  private left: SExpression;
  private right: SExpression;

  public toString(): string {
    return `${this.left} * ${this.right}`;
  }

  get reducible(): boolean {
    return true;
  }

  public reduce() {
    if (this.left.reducible) {
      return new SMultiply((this.left as SReducible).reduce(), this.right);
    } else if (this.right.reducible) {
      return new SMultiply(this.left, (this.right as SReducible).reduce());
    } else {
      return new SNumber((this.left as SNumber).value * (this.right as SNumber).value);
    }
  }
}

/**
 * Represents a less than operation in the small-step semantics.
 * 
 * @class SLessThan
 * @property {SExpression} left - The left operand of the less than operation.
 * @property {SExpression} right - The right operand of the less than operation.
 * @method toString - Returns the string representation of the less than operation.
 * @getter reducible - Indicates whether the less than operation is reducible.
 * @method reduce - Reduces the less than operation by reducing its operands.
 * 
 * @example
 * const lessThan = new SLessThan(new SNumber(4), new SNumber(5));
 * console.log(lessThan.toString()); // "4 < 5"
 * console.log(lessThan.reducible); // true
 * console.log(lessThan.reduce()); // SBoolean { value: false }
 */
class SLessThan extends SReducible {
  constructor(left: SExpression, right: SExpression) {
    super();

    this.left = left;
    this.right = right;
  }

  private left: SExpression;
  private right: SExpression;

  public toString(): string {
    return `${this.left} < ${this.right}`;
  }

  get reducible(): boolean {
    return true;
  }

  public reduce() {
    if (this.left.reducible) {
      return new SLessThan((this.left as SReducible).reduce(), this.right);
    } else if (this.right.reducible) {
      return new SLessThan(this.left, (this.right as SReducible).reduce());
    } else {
      return new SBoolean((this.left as SNumber).value < (this.right as SNumber).value);
    }
  }
}

/**
 * Represents a simple machine that can run a small-step semantics expression.
 * 
 * @class SMachine
 * @property {SExpression} expression - The expression to run.
 * @method step - Runs a single step of the expression.
 * @method run - Runs the expression until it is no longer reducible.
 * 
 * @example
 * const expression: SExpression = new SAdd(
 *  new SMultiply(new SNumber(2), new SNumber(2)),
 *  new SMultiply(new SNumber(8), new SNumber(8))
 * );
 * const machine = new SMachine(expression);
 * machine.run(); 
 * // Expression: 2 * 2 + 8 * 8
 * // Running machine...
 * // 2 * 2 + 8 * 8
 * // 4 + 8 * 8
 * // 4 + 64
 * // Result: 68
 */
class SMachine {
  constructor(expression: SExpression) {
    this.expression = expression;
  }

  private expression: SExpression;

  public step() {
    this.expression = (this.expression as SReducible).reduce();
  }

  public run() {
    console.clear();

    console.log('Expression: ', this.expression);
    console.log('Running machine...');

    while (this.expression.reducible) {
      console.log(this.expression.toString());
      this.step();
    }

    console.log('Result: ', this.expression.toString());
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const numericExpression: SExpression = new SAdd(
  new SMultiply(new SNumber(2), new SNumber(2)),
  new SMultiply(new SNumber(8), new SNumber(8))
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const booleanExpression: SExpression = new SLessThan(
  new SMultiply(new SNumber(2), new SNumber(2)),
  new SMultiply(new SNumber(8), new SNumber(8))
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runMachine(expression: SExpression) {
  const machine = new SMachine(expression);
  machine.run();
}
