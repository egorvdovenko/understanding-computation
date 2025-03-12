export type SExpression = SNumber | SBoolean | SVariable | SAdd | SMultiply | SLessThan;
export type SStatement = SAssign | SDoNothing | SIf;

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

/**
 * Represents an assignment statement in the big-step semantics.
 * 
 * @class SAssign
 * @property {string} name - The name of the variable.
 * @property {SExpression} expression - The expression to assign to the variable.
 * @method eval - Returns the environment with the variable assigned to the expression.
 * @method toString - Returns the string representation of the assignment expression.
 * 
 * @example
 * const assign = new SAssign("x", new SNumber(5));
 * console.log(assign.eval({})); // { x: 5 }
 * console.log(assign.toString()); // "x = 5"
 */
export class SAssign {
  constructor(name: string, expression: SExpression) {
    this.name = name;
    this.expression = expression;
  }

  name: string;
  expression: SExpression;

  eval(environment: SEnvironment): SEnvironment {
    return { ...environment, [this.name]: this.expression.eval(environment) };
  }

  toString(): string {
    return `${this.name} = ${this.expression.toString()}`;
  }
}

/**
 * Represents a do-nothing statemet in the big-step semantics.
 * 
 * @class SDoNothing
 * @method eval - Returns the environment without any changes.
 * @method toString - Returns the string representation of the do-nothing statement.
 * 
 * @example
 * const doNothing = new SDoNothing();
 * console.log(doNothing.eval({ x: 5 })); // { x: 5 }
 */
export class SDoNothing {
  eval(environment: SEnvironment): SEnvironment {
    return environment;
  }

  toString(): string {
    return "do-nothing";
  }
}

/**
 * Represents an if statement in the big-step semantics.
 * 
 * @class SIf
 * @property {SExpression} condition - The condition to evaluate.
 * @property {SStatement} consequence - The statement to execute if the condition is true.
 * @property {SStatement} alternative - The statement to execute if the condition is false.
 * @method eval - Returns the environment after executing the consequence or alternative statement.
 * @method toString - Returns the string representation of the if statement.
 * 
 * @example
 * const ifStatement = new SIf(new SLessThan(new SVariable("x"), new SNumber(10)), new SAssign("y", new SNumber(10)), new SDoNothing());
 * console.log(ifStatement.eval({ x: 5 })); // { x: 5, y: 10 }
 * console.log(ifStatement.toString()); // "if (x < 10) { y = 10 } else { do-nothing }"
 */
export class SIf {
  constructor(condition: SExpression, consequence: SStatement, alternative: SStatement) {
    this.condition = condition;
    this.consequence = consequence;
    this.alternative = alternative;
  }

  condition: SExpression;
  consequence: SStatement;
  alternative: SStatement;

  eval(environment: SEnvironment): SEnvironment {
    return this.condition.eval(environment)  === new SBoolean(true).value 
      ? this.consequence.eval(environment) 
      : this.alternative.eval(environment);
  }

  toString(): string {
    return `if (${this.condition.toString()}) { ${this.consequence.toString()} } else { ${this.alternative.toString()} }`;
  }
}

/**
 * Represents a sequence of statements in the big-step semantics.
 * 
 * @class SSequence
 * @property {SStatement} first - The first statement to execute.
 * @property {SStatement} second - The second statement to execute.
 * @method eval - Returns the environment after executing the second statement.
 * @method toString - Returns the string representation of the sequence of statements.
 * 
 * @example
 * const sequence = new SSequence(new SAssign("x", new SNumber(5)), new SAssign("y", new SNumber(10)));
 * console.log(sequence.eval({})); // { x: 5, y: 10 }
 * console.log(sequence.toString()); // "x = 5; y = 10"
 */
export class SSequence {
  constructor(first: SStatement, second: SStatement) {
    this.first = first;
    this.second = second;
  }

  first: SStatement;
  second: SStatement;

  eval(environment: SEnvironment): SEnvironment {
    return this.second.eval(this.first.eval(environment));
  }

  toString(): string {
    return `${this.first.toString()}; ${this.second.toString()}`;
  }
}

export class SWhile {
  constructor(condition: SExpression, body: SStatement) {
    this.condition = condition;
    this.body = body;
  }

  condition: SExpression;
  body: SStatement;

  eval(environment: SEnvironment): SEnvironment {
    return this.condition.eval(environment) === new SBoolean(true).value 
      ? this.eval(this.body.eval(environment)) 
      : environment;
  }

  toString(): string {
    return `while (${this.condition.toString()}) { ${this.body.toString()} }`;
  }
}

const environment: SEnvironment = {
  x: new SNumber(5).value,
  y: new SNumber(10).value,
};

console.group("Part 1: Programs and Machines => 2. The Meaning of Programs => Big-Step Semantics");

console.log("Environment: ", environment);

console.group("Expressions");

console.log("----------------------------------------");
console.log("SNumber(5): ", new SNumber(5).value);
console.log("----------------------------------------");
console.log("SBoolean(true): ", new SBoolean(true).value);
console.log("----------------------------------------");
console.log("SVariable('x'): ", new SVariable("x").eval(environment));
console.log("----------------------------------------");
console.log("SAdd(new SVariable('x'), new SNumber(5)): ", new SAdd(new SVariable("x"), new SNumber(5)).eval(environment));
console.log("----------------------------------------");
console.log("SMultiply(new SVariable('x'), new SNumber(5)): ", new SMultiply(new SVariable("x"), new SNumber(5)).eval(environment));
console.log("----------------------------------------");
console.log("SLessThan(new SVariable('x'), new SNumber(5)): ", new SLessThan(new SVariable("x"), new SNumber(5)).eval(environment));
console.log("----------------------------------------");

console.groupEnd();
console.group("Statements");

console.log("----------------------------------------");
console.log("SAssign('x', new SNumber(5)): ", new SAssign("x", new SNumber(5)).eval(environment));
console.log("----------------------------------------");
console.log("SDoNothing(): ", new SDoNothing().eval(environment));
console.log("----------------------------------------");
console.log("SIf(new SLessThan(new SVariable('x'), new SNumber(10)), new SAssign('y', new SNumber(10)), new SDoNothing()).eval(environment))", new SIf(new SLessThan(new SVariable("x"), new SNumber(10)), new SAssign("y", new SNumber(10)), new SDoNothing()).eval(environment));
console.log("----------------------------------------");
console.log("SSequence(new SAssign('x', new SNumber(10)), new SAssign('z', new SAdd(new SVariable('x'), new SVariable('y'))))", new SSequence(new SAssign("x", new SNumber(10)), new SAssign("z", new SAdd(new SVariable("x"), new SVariable("y")))).eval(environment));
console.log("----------------------------------------");
console.log("SWhile(new SLessThan(new SVariable('x'), new SNumber(10)), new SAssign('x', new SAdd(new SVariable('x'), new SNumber(1))))", new SWhile(new SLessThan(new SVariable("x"), new SNumber(10)), new SAssign("x", new SAdd(new SVariable("x"), new SNumber(1)))).eval(environment));
console.log("----------------------------------------");

console.groupEnd();
console.groupEnd();

console.group("Example: Factorial");

const factorial = new SSequence(
  new SAssign("result", new SNumber(1)),
  new SWhile(
    new SLessThan(new SNumber(0), new SVariable("n")),
    new SSequence(
      new SAssign("result", new SMultiply(new SVariable("result"), new SVariable("n"))),
      new SAssign("n", new SAdd(new SVariable("n"), new SNumber(-1)))
    )
  )
);

console.log("Factorial(5): ", factorial.eval({ n: 5 }));

console.groupEnd();