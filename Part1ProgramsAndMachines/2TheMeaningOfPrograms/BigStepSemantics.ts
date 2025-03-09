export type SExpression = SNumber | SBoolean | SVariable | SAdd | SMultiply | SLessThan;

export type SEnvironment = Record<string, number | boolean>;

/**
 * Represents a simple number in the big-step semantics.
 * 
 * @class SNumber
 * @property {number} value - The numeric value of this instance.
 * @method eval - Returns the numeric value of this instance.
 * @method toString - Returns the string representation of the number.
 * 
 * @example
 * const num = new SNumber(5);
 * console.log(num.eval()); // 5
 * console.log(num.toString()); // "5"
 */
export class SNumber {
  constructor(value: number) {
    this.value = value;
  }

  value: number;

  eval(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }
}

/**
 * Represents a simple boolean in the big-step semantics.
 * 
 * @class SBoolean
 * @property {boolean} value - The boolean value of this instance.
 * @method eval - Returns the boolean value of this instance.
 * @method toString - Returns the string representation of the boolean.
 * 
 * @example
 * const bool = new SBoolean(true);
 * console.log(bool.eval()); // true
 * console.log(bool.toString()); // "true"
 */
export class SBoolean {
  constructor(value: boolean) {
    this.value = value;
  }

  value: boolean;

  eval(): boolean {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }
}

/**
 * Represents a variable expression in the big-step semantics.
 * 
 * @class SVariable
 * @property {string} name - The name of the variable.
 * @method eval - Returns the value of the variable from the environment.
 * @method toString - Returns the string representation of the variable.
 * 
 * @example
 * const variable = new SVariable("x");
 * console.log(variable.eval({ x: 5 })); // 5
 * console.log(variable.toString()); // "x"
 */
export class SVariable {
  constructor(name: string) {
    this.name = name;
  }

  name: string;

  eval(environment: SEnvironment): number | boolean {
    return environment[this.name];
  }

  toString(): string {
    return this.name;
  }
}

/**
 * Represents an addition expression in the big-step semantics.
 * 
 * @class SAdd
 * @property {SExpression} left - The left expression.
 * @property {SExpression} right - The right expression.
 * @method eval - Returns the sum of the left and right expressions.
 * @method toString - Returns the string representation of the addition expression.
 * 
 * @example
 * const add = new SAdd(new SNumber(5), new SNumber(10));
 * console.log(add.eval()); // 15
 * console.log(add.toString()); // "5 + 10"
 */
export class SAdd {
  constructor(left: SExpression, right: SExpression) {
    this.left = left;
    this.right = right;
  }

  left: SExpression;
  right: SExpression;

  eval(environment: SEnvironment): number {
    try {
      return new SNumber((this.left.eval(environment) as number) + (this.right.eval(environment) as number)).value;
    } catch {
      return 0;
    }
  }

  toString(): string {
    return `${this.left.toString()} + ${this.right.toString()}`;
  }
}

/**
 * Represents a multiplication expression in the big-step semantics.
 * 
 * @class SMultiply
 * @property {SExpression} left - The left expression.
 * @property {SExpression} right - The right expression.
 * @method eval - Returns the product of the left and right expressions.
 * @method toString - Returns the string representation of the multiplication expression.
 * 
 * @example
 * const multiply = new SMultiply(new SNumber(5), new SNumber(10));
 * console.log(multiply.eval()); // 50
 * console.log(multiply.toString()); // "5 * 10"
 */
export class SMultiply {
  constructor(left: SExpression, right: SExpression) {
    this.left = left;
    this.right = right;
  }

  left: SExpression;
  right: SExpression;

  eval(environment: SEnvironment): number {
    try {
      return new SNumber((this.left.eval(environment) as number) * (this.right.eval(environment) as number)).value;
    } catch {
      return 0;
    }
  }

  toString(): string {
    return `${this.left.toString()} * ${this.right.toString()}`;
  }
}

/**
 * Represents a less than expression in the big-step semantics.
 * 
 * @class SLessThan
 * @property {SExpression} left - The left expression.
 * @property {SExpression} right - The right expression.
 * @method eval - Returns the boolean value of the comparison.
 * @method toString - Returns the string representation of the less than expression.
 * 
 * @example
 * const lessThan = new SLessThan(new SNumber(5), new SNumber(10));
 * console.log(lessThan.eval()); // true
 * console.log(lessThan.toString()); // "5 < 10"
 */
export class SLessThan {
  constructor(left: SExpression, right: SExpression) {
    this.left = left;
    this.right = right;
  }

  left: SExpression;
  right: SExpression;

  eval(environment: SEnvironment): boolean {
    return new SBoolean(this.left.eval(environment) < this.right.eval(environment)).value;
  }

  toString(): string {
    return `${this.left.toString()} < ${this.right.toString()}`;
  }
}

const environment: SEnvironment = {
  x: new SNumber(5).value,
  y: new SNumber(10).value,
};

console.group("Part 1: Programs and Machines => 2. The Meaning of Programs => Big-Step Semantics");
console.group("Expressions");

console.log("environment =>", environment);
console.log("new SNumber(5).value =>", new SNumber(5).value);
console.log("new SBoolean(true).value =>", new SBoolean(true).value);
console.log("new SVariable('x').eval(environment) =>", new SVariable("x").eval(environment));
console.log("new SAdd(new SVariable('x'), new SNumber(5)).eval(environment) =>", new SAdd(new SVariable("x"), new SNumber(5)).eval(environment));
console.log("new SMultiply(new SVariable('x'), new SNumber(5)).eval(environment) =>", new SMultiply(new SVariable("x"), new SNumber(5)).eval(environment));
console.log("new SLessThan(new SVariable('x'), new SNumber(5)).eval(environment) =>", new SLessThan(new SVariable("x"), new SNumber(5)).eval(environment));

console.groupEnd();
console.groupEnd();