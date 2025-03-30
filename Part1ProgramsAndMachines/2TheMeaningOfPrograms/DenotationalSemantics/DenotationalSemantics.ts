export type SExpression = SNumber | SBoolean | SVariable | SAdd | SMultiply | SLessThan;
export type SStatement = SAssign | SDoNothing | SIf;

export type SEnvironment = Record<string, number | boolean>;

/**
 * Represents a simple number in the denotational semantics.
 * 
 * @class SNumber
 * @property {number} value - The numeric value of this instance.
 * @method toJS - Returns the JavaScript representation of the number.
 * @method toString - Returns the string representation of the number.
 * 
 * @example
 * const num = new SNumber(5);
 * console.log(num.toJS()); // "(environment) => new Number(5)"
 * console.log(num.toString()); // "5"
 */
export class SNumber {
  constructor(public value: number) {}

  toJS() {
    return `(environment) => Number(${this.value})`;
  }

  toString() {
    return this.value.toString();
  }
}

/**
 * Represents a simple boolean in the denotational semantics.
 * 
 * @class SBoolean
 * @property {boolean} value - The boolean value of this instance.
 * @method toJS - Returns the JavaScript representation of the boolean.
 * @method toString - Returns the string representation of the boolean.
 * 
 * @example
 * const bool = new SBoolean(true);
 * console.log(bool.toJS()); // "(environment) => new Boolean(true)"
 * console.log(bool.toString()); // "true"
 */
export class SBoolean {
  constructor(value: boolean) {
    this.value = value;
  }

  value: boolean;

  toJS(): string {
    return `(environment) => Boolean(${this.value})`;
  }

  toString() {
    return this.value.toString();
  }
}

/**
 * Represents a variable in the denotational semantics.
 * 
 * @class SVariable
 * @property {string} name - The name of the variable.
 * @method toJS - Returns the JavaScript representation of the variable.
 * @method toString - Returns the string representation of the variable.
 * 
 * @example
 * const variable = new SVariable("x");
 * console.log(variable.toJS()); // "(environment) => environment["x"]"
 * console.log(variable.toString()); // "x"
 */
export class SVariable {
  constructor(name: string) {
    this.name = name;
  }

  name: string;

  toJS(): string {
    return `(environment) => environment["${this.name}"]`;
  }

  toString() {
    return this.name;
  }
}

/**
 * Represents an addition expression in the denotational semantics.
 * 
 * @class SAdd
 * @property {SExpression} left - The left side of the addition expression.
 * @property {SExpression} right - The right side of the addition expression.
 * @method toJS - Returns the JavaScript representation of the addition expression.
 * @method toString - Returns the string representation of the addition expression.
 * 
 * @example
 * const add = new SAdd(new SNumber(5), new SNumber(3));
 * console.log(add.toJS()); // "(environment) => new Number(5)(environment) + new Number(3)(environment)"
 * console.log(add.toString()); // "(5 + 3)"
 */
export class SAdd {
  constructor(left: SExpression, right: SExpression) {
    this.left = left;
    this.right = right;
  }

  left: SExpression;
  right: SExpression;

  toJS(): string {
    return `(environment) => (${this.left.toJS()})(environment) + (${this.right.toJS()})(environment)`;
  }

  toString() {
    return `${this.left} + ${this.right}`;
  }
}

/**
 * Represents a multiplication expression in the denotational semantics.
 * 
 * @class SMultiply
 * @property {SExpression} left - The left side of the multiplication expression.
 * @property {SExpression} right - The right side of the multiplication expression.
 * @method toJS - Returns the JavaScript representation of the multiplication expression.
 * @method toString - Returns the string representation of the multiplication expression.
 * 
 * @example
 * const multiply = new SMultiply(new SNumber(5), new SNumber(3));
 * console.log(multiply.toJS()); // "(environment) => new Number(5)(environment) * new Number(3)(environment)"
 * console.log(multiply.toString()); // "(5 * 3)"
 */
export class SMultiply {
  constructor(left: SExpression, right: SExpression) {
    this.left = left;
    this.right = right;
  }

  left: SExpression;
  right: SExpression;

  toJS(): string {
    return `(environment) => (${this.left.toJS()})(environment) * (${this.right.toJS()})(environment)`;
  }

  toString() {
    return `${this.left} * ${this.right}`;
  }
}

/**
 * Represents a less than comparison expression in the denotational semantics.
 * 
 * @class SLessThan
 * @property {SExpression} left - The left side of the less than comparison expression.
 * @property {SExpression} right - The right side of the less than comparison expression.
 * @method toJS - Returns the JavaScript representation of the less than comparison expression.
 * @method toString - Returns the string representation of the less than comparison expression.
 * 
 * @example
 * const lessThan = new SLessThan(new SNumber(5), new SNumber(3));
 * console.log(lessThan.toJS()); // "(environment) => new Number(5)(environment) < new Number(3)(environment)"
 * console.log(lessThan.toString()); // "(5 < 3)"
 */
export class SLessThan {
  constructor(left: SExpression, right: SExpression) {
    this.left = left;
    this.right = right;
  }

  left: SExpression;
  right: SExpression;

  toJS(): string {
    return `(environment) => (${this.left.toJS()})(environment) < (${this.right.toJS()})(environment)`;
  }

  toString() {
    return `${this.left} < ${this.right}`;
  }
}

/**
 * Represents an assignment statement in the denotational semantics.
 * 
 * @class SAssign
 * @property {string} name - The name of the variable to assign.
 * @property {SExpression} expression - The expression to assign to the variable.
 * @method toJS - Returns the JavaScript representation of the assignment statement.
 * @method toString - Returns the string representation of the assignment statement.
 * 
 * @example
 * const assign = new SAssign("x", new SNumber(5));
 * console.log(assign.toJS()); // "(environment) => ({ ...environment, x: new Number(5)(environment) })"
 * console.log(assign.toString()); // "x = 5"
 */
export class SAssign {
  constructor(name: string, expression: SExpression) {
    this.name = name;
    this.expression = expression;
  }

  name: string;
  expression: SExpression;

  toJS(): string {
    return `(environment) => ({ ...environment, ${this.name}: (${this.expression.toJS()})(environment) })`;
  }

  toString() {
    return `${this.name} = ${this.expression}`;
  }
}

/**
 * Represents a do-nothing statement in the denotational semantics.
 * 
 * @class SDoNothing
 * @method toJS - Returns the JavaScript representation of the do-nothing statement.
 * @method toString - Returns the string representation of the do-nothing statement.
 * 
 * @example
 * const doNothing = new SDoNothing();
 * console.log(doNothing.toJS()); // "(environment) => environment"
 * console.log(doNothing.toString()); // "do-nothing"
 */
export class SDoNothing {
  toJS(): string {
    return "(environment) => environment";
  }

  toString() {
    return "do-nothing";
  }
}

/**
 * Represents an if statement in the denotational semantics.
 * 
 * @class SIf
 * @property {SExpression} condition - The condition to evaluate.
 * @property {SStatement} consequence - The statement to execute if the condition is true.
 * @property {SStatement} alternative - The statement to execute if the condition is false.
 * @method toJS - Returns the JavaScript representation of the if statement.
 * @method toString - Returns the string representation of the if statement.
 * 
 * @example
 * const condition = new SBoolean(true);
 * const consequence = new SAssign("x", new SNumber(10));
 * const alternative = new SDoNothing();
 * const ifStatement = new SIf(condition, consequence, alternative);
 * console.log(ifStatement.toJS()); // "(environment) => new Boolean(true)(environment) === new Boolean(true) ? ({ ...environment, x: new Number(10)(environment) }) : environment"
 * console.log(ifStatement.toString()); // "if (true) { x = 10 } else { do-nothing }"
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

  toJS(): string {
    return `(environment) => ((${this.condition.toJS()})(environment)) ? (${this.consequence.toJS()})(environment) : (${this.alternative.toJS()})(environment)`;
  }

  toString() {
    return `if (${this.condition}) { ${this.consequence} } else { ${this.alternative} }`;
  }
}

/**
 * Represents a sequence of statements in the denotational semantics.
 * 
 * @class SSequence
 * @property {SStatement} first - The first statement in the sequence.
 * @property {SStatement} second - The second statement in the sequence.
 * @method toJS - Returns the JavaScript representation of the sequence of statements.
 * @method toString - Returns the string representation of the sequence of statements.
 * 
 * @example
 * const first = new SAssign("x", new SNumber(5));
 * const second = new SAssign("y", new SNumber(10));
 * const sequence = new SSequence(first, second);
 * console.log(sequence.toJS()); // "(environment) => new Number(10)({ ...environment, x: new Number(5)(environment) })"
 * console.log(sequence.toString()); // "x = 5; y = 10"
 */
export class SSequence {
  constructor(first: SStatement, second: SStatement) {
    this.first = first;
    this.second = second;
  }

  first: SStatement;
  second: SStatement;

  toJS(): string {
    return `(environment) => (${this.second.toJS()})((${this.first.toJS()})(environment))`;
  }

  toString() {
    return `${this.first}; ${this.second}`;
  }
}

/**
 * Represents a while loop in the denotational semantics.
 * 
 * @class SWhile
 * @property {SExpression} condition - The condition to evaluate.
 * @property {SStatement} body - The body of the while loop.
 * @method toJS - Returns the JavaScript representation of the while loop.
 * @method toString - Returns the string representation of the while loop.
 * 
 * @example
 * const condition = new SLessThan(new SVariable("x"), new SNumber(10));
 * const body = new SAssign("x", new SAdd(new SVariable("x"), new SNumber(1)));
 * const whileLoop = new SWhile(condition, body);
 * console.log(whileLoop.toJS()); // "(environment) => { while (environment["x"] < new Number(10)(environment)) { environment = ({ ...environment, x: environment["x"] + new Number(1)(environment) }) } return environment }"
 * console.log(whileLoop.toString()); // "while (x < 10) { x = x + 1 }"
 */
export class SWhile {
  constructor(condition: SExpression, body: SStatement) {
    this.condition = condition;
    this.body = body;
  }

  condition: SExpression;
  body: SStatement;

  toJS(): string {
    return `(environment) => { while ((${this.condition.toJS()})(environment)) { environment = (${this.body.toJS()})(environment) } return environment }`;
  }

  toString() {
    return `while (${this.condition}) { ${this.body} }`;
  }
}

console.group("* Part 1: Programs and Machines => 2. The Meaning of Programs => Denotational Semantics");

const environment: SEnvironment = {
  x: new SNumber(5).value,
  y: new SNumber(10).value,
};

console.log("Environment: ", environment);

console.group("Expressions");

console.log("----------------------------------------");
console.log("SNumber(5)", eval(new SNumber(5).toJS())({}));
console.log("SBoolean(true)", eval(new SBoolean(true).toJS())({}));
console.log("SVariable(\"x\"): ", eval(new SVariable("x").toJS())({ x: 5 }));
console.log("SAdd(new SNumber(5), new SNumber(3)): ", eval(new SAdd(new SNumber(5), new SNumber(3)).toJS())({}));
console.log("SMultiply(new SNumber(5), new SNumber(3)): ", eval(new SMultiply(new SVariable("x"), new SNumber(3)).toJS())({ x: 5 }));
console.log("SLessThan(new SNumber(5), new SNumber(3)): ", eval(new SLessThan(new SVariable("x"), new SNumber(3)).toJS())({ x: 5 }));
console.log("----------------------------------------");

console.groupEnd();
console.group("Statements");

console.log("----------------------------------------");
console.log("SAssign(\"x\", new SNumber(5)): ", eval(new SAssign("x", new SNumber(5)).toJS())({}));
console.log("SDoNothing(): ", eval(new SDoNothing().toJS())({}));
console.log("SIf(new SBoolean(true), new SAssign(\"x\", new SNumber(10)), new SDoNothing()): ", eval(new SIf(new SBoolean(true), new SAssign("x", new SNumber(10)), new SDoNothing()).toJS())({}));
console.log("SSequence(new SAssign(\"x\", new SNumber(5)), new SAssign(\"y\", new SNumber(10))): ", eval(new SSequence(new SAssign("x", new SNumber(5)), new SAssign("y", new SNumber(10))).toJS())({}));
console.log("SWhile(new SLessThan(new SVariable(\"x\"), new SNumber(10)), new SAssign(\"x\", new SAdd(new SVariable(\"x\"), new SNumber(1))): ", eval(new SWhile(new SLessThan(new SVariable("x"), new SNumber(10)), new SAssign("x", new SAdd(new SVariable("x"), new SNumber(1)))).toJS())({ x: 0 }));
console.log("----------------------------------------");

console.groupEnd();
console.groupEnd();

console.group("Example: Factorial");

const factorial = new SSequence(
  new SAssign("result", new SNumber(1)),
  new SWhile(
    new SLessThan(new SNumber(0), new SVariable("x")),
    new SSequence(
      new SAssign("result", new SMultiply(new SVariable("result"), new SVariable("x"))),
      new SAssign("x", new SAdd(new SVariable("x"), new SNumber(-1)))
    )
  )
);

console.log("Factorial(5): ", eval(factorial.toJS())({ x: 5 }));

console.groupEnd();
