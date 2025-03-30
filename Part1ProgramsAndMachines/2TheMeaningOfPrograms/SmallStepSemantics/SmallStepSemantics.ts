export type SExpression = SNumber | SBoolean | SAdd | SMultiply | SLessThan | SVariable;
export type SStatement = SDoNothing | SAssign | SIf | SSequence | SWhile;

export type SEnvironment = Record<string, SExpression>;

export abstract class SReducibleExpression {
  abstract reduce(environment: SEnvironment): SExpression;
}

export abstract class SReducibleStatement {
  abstract reduce(environment: SEnvironment): [SStatement, SEnvironment];
}

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
export class SNumber {
  constructor(value: number) {
    this.value = value;
  }

  value: number;

  toString(): string {
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
export class SBoolean {
  constructor(value: boolean) {
    this.value = value;
  }

  value: boolean;

  toString(): string {
    return `${this.value}`;
  }

  get reducible(): boolean {
    return false;
  }
}

/**
 * Represents an addition expression in the small-step semantics.
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
 * console.log(add.reduce({})); // SNumber { value: 10 }
 */
export class SAdd implements SReducibleExpression {
  constructor(left: SExpression, right: SExpression) {
    this.left = left;
    this.right = right;
  }

  left: SExpression;
  right: SExpression;

  toString(): string {
    return `${this.left} + ${this.right}`;
  }

  get reducible(): boolean {
    return true;
  }

  reduce(environment: SEnvironment): SExpression {
    if (this.left.reducible) {
      return new SAdd((this.left as SReducibleExpression).reduce(environment), this.right);
    } else if (this.right.reducible) {
      return new SAdd(this.left, (this.right as SReducibleExpression).reduce(environment));
    } else {
      return new SNumber((this.left as SNumber).value + (this.right as SNumber).value);
    }
  }
}

/**
 * Represents a multiplication expression in the small-step semantics.
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
 * console.log(multiply.reduce({})); // SNumber { value: 25 }
 */
export class SMultiply implements SReducibleExpression {
  constructor(left: SExpression, right: SExpression) {
    this.left = left;
    this.right = right;
  }

  left: SExpression;
  right: SExpression;

  toString(): string {
    return `${this.left} * ${this.right}`;
  }

  get reducible(): boolean {
    return true;
  }

  reduce(environment: SEnvironment): SExpression {
    if (this.left.reducible) {
      return new SMultiply((this.left as SReducibleExpression).reduce(environment), this.right);
    } else if (this.right.reducible) {
      return new SMultiply(this.left, (this.right as SReducibleExpression).reduce(environment));
    } else {
      return new SNumber((this.left as SNumber).value * (this.right as SNumber).value);
    }
  }
}

/**
 * Represents a less than expression in the small-step semantics.
 *
 * @class SLessThan
 * @property {SExpression} left - The left operand of the less than expression.
 * @property {SExpression} right - The right operand of the less than expression.
 * @method toString - Returns the string representation of the less than expression.
 * @getter reducible - Indicates whether the less than expression is reducible.
 * @method reduce - Reduces the less than expression by reducing its operands.
 *
 * @example
 * const lessThan = new SLessThan(new SNumber(4), new SNumber(5));
 * console.log(lessThan.toString()); // "4 < 5"
 * console.log(lessThan.reducible); // true
 * console.log(lessThan.reduce({})); // SBoolean { value: true }
 */
export class SLessThan implements SReducibleExpression {
  constructor(left: SExpression, right: SExpression) {
    this.left = left;
    this.right = right;
  }

  left: SExpression;
  right: SExpression;

  toString(): string {
    return `${this.left} < ${this.right}`;
  }

  get reducible(): boolean {
    return true;
  }

  reduce(environment: SEnvironment): SExpression {
    if (this.left.reducible) {
      return new SLessThan((this.left as SReducibleExpression).reduce(environment), this.right);
    } else if (this.right.reducible) {
      return new SLessThan(this.left, (this.right as SReducibleExpression).reduce(environment));
    } else {
      return new SBoolean((this.left as SNumber).value < (this.right as SNumber).value);
    }
  }
}

/**
 * Represents a variable expression in the small-step semantics.
 *
 * @class SVariable
 * @property {string} name - The name of the variable.
 * @method toString - Returns the string representation of the variable.
 * @getter reducible - Indicates whether the variable is reducible.
 * @method reduce - Reduces the variable by returning its value from the environment.
 *
 * @example
 * const variable = new SVariable('x');
 * console.log(variable.toString()); // "x"
 * console.log(variable.reducible); // true
 * console.log(variable.reduce({ x: new SNumber(5) })); // SNumber { value: 5 }
 */
export class SVariable implements SReducibleExpression {
  constructor(name: string) {
    this.name = name;
  }

  name: string;

  toString(): string {
    return this.name;
  }

  get reducible(): boolean {
    return true;
  }

  reduce(environment: SEnvironment): SExpression {
    return environment[this.name];
  }
}

/**
 * Represents a do-nothing statemet in the small-step semantics.
 * 
 * @class SDoNothing
 * @method toString - Returns the string representation of the do-nothing statemet.
 * @getter reducible - Indicates whether the do-nothing statemet is reducible (always false for DoNothing).
 * 
 * @example
 * const doNothing = new SDoNothing();
 * console.log(doNothing.toString()); // "do-nothing"
 * console.log(doNothing.reducible); // false
 */
export class SDoNothing {
  toString() {
    return "do-nothing";
  }

  get reducible() {
    return false;
  }
}

/**
 * Represents an assignment statement in the small-step semantics.
 *
 * @class SAssign
 * @property {string} name - The name of the variable to assign.
 * @property {SExpression} expression - The expression to assign to the variable.
 * @method toString - Returns the string representation of the assignment statement.
 * @getter reducible - Indicates whether the assignment statement is reducible.
 * @method reduce - Reduces the assignment statement by reducing its expression.
 *
 * @example
 * const assign = new SAssign('x', new SNumber(5));
 * console.log(assign.toString()); // "x = 5"
 * console.log(assign.reducible); // true
 * console.log(assign.reduce({})); // SDoNothing {}
 */
export class SAssign implements SReducibleStatement {
  constructor(name: string, expression: SExpression) {
    this.name = name;
    this.expression = expression;
  }

  name: string;
  expression: SExpression;

  toString() {
    return `${this.name} = ${this.expression}`;
  }

  get reducible() {
    return true;
  }

  reduce(environment: SEnvironment): [SStatement, SEnvironment] {
    if (this.expression.reducible) {
      return [new SAssign(this.name, (this.expression as SReducibleExpression).reduce(environment)), environment];
    } else {
      const newEnvironment = { ...environment };
      newEnvironment[this.name] = this.expression;
      return [new SDoNothing(), newEnvironment];
    }
  }
}

/**
 * Represents an if statement in the small-step semantics.
 *
 * @class SIf
 * @property {SExpression} condition - The condition to evaluate.
 * @property {SStatement} consequence - The statement to execute if the condition is true.
 * @property {SStatement} alternative - The statement to execute if the condition is false.
 * @method toString - Returns the string representation of the if statement.
 * @getter reducible - Indicates whether the if statement is reducible.
 * @method reduce - Reduces the if statement by reducing its condition.
 *
 * @example
 * const ifStatement = new SIf(new SBoolean(true), new SAssign('x', new SNumber(5)), new SAssign('x', new SNumber(10)));
 * console.log(ifStatement.toString()); // "if (true) { x = 5 } else { x = 10 }"
 * console.log(ifStatement.reducible); // true
 * console.log(ifStatement.reduce({})); // SAssign { name: 'x', expression: SNumber { value: 5 } }
 */
export class SIf implements SReducibleStatement {
  constructor(condition: SExpression, consequence: SStatement, alternative: SStatement) {
    this.condition = condition;
    this.consequence = consequence;
    this.alternative = alternative;
  }

  condition: SExpression;
  consequence: SStatement;
  alternative: SStatement;

  toString() {
    return `if (${this.condition}) { ${this.consequence} } else { ${this.alternative} }`;
  }

  get reducible() {
    return true;
  }

  reduce(environment: SEnvironment): [SStatement, SEnvironment] {
    if (this.condition.reducible) {
      return [new SIf((this.condition as SReducibleExpression).reduce(environment), this.consequence, this.alternative), environment];
    } else {
      return (this.condition as SBoolean).value === new SBoolean(true).value
        ? [this.consequence, environment]
        : [this.alternative, environment];
    }
  }
}

/**
 * Represents a sequence statement in the small-step semantics.
 *
 * @class SSequence
 * @property {SStatement} first - The first statement to execute.
 * @property {SStatement} second - The second statement to execute.
 * @method toString - Returns the string representation of the sequence statement.
 * @getter reducible - Indicates whether the sequence statement is reducible.
 * @method reduce - Reduces the sequence statement by reducing its first statement.
 *
 * @example
 * const sequence = new SSequence(new SDoNothing(), new SAssign('x', new SNumber(5)));
 * console.log(sequence.toString()); // "do-nothing; x = 5"
 * console.log(sequence.reducible); // true
 * console.log(sequence.reduce({})); // [SAssign { name: 'x', expression: SNumber { value: 5 } }, {}]
 */
export class SSequence implements SReducibleStatement {
  constructor(first: SStatement, second: SStatement) {
    this.first = first;
    this.second = second;
  }

  first: SStatement;
  second: SStatement;

  toString() {
    return `${this.first}; ${this.second}`;
  }

  get reducible() {
    return true;
  }

  reduce(environment: SEnvironment): [SStatement, SEnvironment] {
    if (this.first instanceof SDoNothing) {
      return [this.second, environment];
    } else {
      const [first, newEnvironment] = (this.first as SReducibleStatement).reduce(environment);
      return [new SSequence(first, this.second), newEnvironment];
    }
  }
}

/**
 * Represents a while statement in the small-step semantics.
 *
 * @class SWhile
 * @property {SExpression} condition - The condition to evaluate.
 * @property {SStatement} body - The statement to execute while the condition is true.
 * @method toString - Returns the string representation of the while statement.
 * @getter reducible - Indicates whether the while statement is reducible.
 * @method reduce - Reduces the while statement by converting it to an if statement.
 *
 * @example
 * const whileStatement = new SWhile(new SLessThan(new SVariable('x'), new SNumber(5)), new SAssign('x', new SAdd(new SVariable('x'), new SNumber(1)));
 * console.log(whileStatement.toString()); // "while (x < 5) { x = x + 1 }"
 * console.log(whileStatement.reducible); // true
 * console.log(whileStatement.reduce({})); // SIf { condition: SLessThan { left: SVariable { name: 'x' }, right: SNumber { value: 5 } }, consequence: SAssign { name: 'x', expression: SAdd { left: SVariable { name: 'x' }, right: SNumber { value: 1 } } }, alternative: SDoNothing {} }
 */
export class SWhile implements SReducibleStatement {
  constructor(condition: SExpression, body: SStatement) {
    this.condition = condition;
    this.body = body;
  }

  condition: SExpression;
  body: SStatement;

  toString() {
    return `while (${this.condition}) { ${this.body} }`;
  }

  get reducible() {
    return true;
  }

  reduce(environment: SEnvironment): [SStatement, SEnvironment] {
    return [new SIf(this.condition, new SSequence(this.body, this), new SDoNothing()), environment];
  }
}

/**
 * Represents a simple machine that can run a small-step semantics expression.
 *
 * @class SExpressionMachine
 * @property {SExpression} expression - The expression to run.
 * @property {SEnvironment} environment - The environment in which the expression is evaluated.
 * @method step - Runs a single step of the expression.
 * @method run - Runs the expression until it is no longer reducible.
 *
 * @example
 * const expression: SExpression = new SAdd(
 *  new SMultiply(new SNumber(2), new SNumber(2)),
 *  new SMultiply(new SNumber(8), new SNumber(8))
 * );
 * const environment = {};
 * const machine = new SExpressionMachine(expression, environment);
 * machine.run();
 * // ----------------------------------------
 * // Expression: 2 * 2 + 8 * 8
 * // Environment: {}
 * // 2 * 2 + 8 * 8
 * // 4 + 8 * 8
 * // 4 + 64
 * // 68
 * // Result: 68
 * // ----------------------------------------
 */
export class SExpressionMachine {
  constructor(expression: SExpression, environment: SEnvironment) {
    this.expression = expression;
    this.environment = environment;
  }

  expression: SExpression;
  environment: SEnvironment;

  step() {
    this.expression = (this.expression as SReducibleExpression).reduce(this.environment);
  }

  run() {
    console.log("----------------------------------------");

    console.log("Expression: ", this.expression);
    console.log("Environment: ", this.environment);

    while (this.expression.reducible) {
      console.log(this.expression.toString());
      this.step();
    }

    console.log("Result: ", this.expression.toString());
    console.log("----------------------------------------");
  }
}

/**
 * Represents a simple machine that can run a small-step semantics statement.
 *
 * @class SStatementMachine
 * @property {SStatement} statement - The statement to run.
 * @property {SEnvironment} environment - The environment in which the statement is evaluated.
 * @method step - Runs a single step of the statement.
 * @method run - Runs the statement until it is no longer reducible.
 *
 * @example
 * const statement: SStatement = new SAssign("x", new SNumber(5));
 * const environment = {};
 * const machine = new SStatementMachine(statement, environment);
 * machine.run();
 * // ----------------------------------------
 * // Statement: x = 5
 * // Environment: {}
 * // x = 5
 * // do-nothing
 * // Result: do-nothing
 * // New Environment: { x: 5 }
 * // ----------------------------------------
 */
export class SStatementMachine {
  constructor(statement: SStatement, environment: SEnvironment) {
    this.statement = statement;
    this.environment = environment;
  }

  statement: SStatement;
  environment: SEnvironment;

  step() {
    const [statement, environment] = (this.statement as SReducibleStatement).reduce(this.environment);
    this.statement = statement;
    this.environment = environment;
  }

  run() {
    console.log("----------------------------------------");

    console.log("Statement: ", this.statement);
    console.log("Environment: ", this.environment);

    while (this.statement.reducible) {
      console.log(this.statement.toString());
      this.step();
    }

    console.log("Result: ", this.statement.toString());
    console.log("New Environment: ", this.environment);
    console.log("----------------------------------------");
  }
}

const environment: SEnvironment = {
  x: new SNumber(5),
  y: new SNumber(10),
};

console.group("* Part 1: Programs and Machines => 2. The Meaning of Programs => Small-Step Semantics");

console.log("Environment: ", environment);

console.group("Expressions");

const numericExpression: SExpression = new SAdd(
  new SMultiply(new SNumber(2), new SNumber(2)),
  new SMultiply(new SNumber(8), new SNumber(8))
);

const booleanExpression: SExpression = new SLessThan(
  new SMultiply(new SNumber(2), new SNumber(2)),
  new SMultiply(new SNumber(8), new SNumber(8))
);

const variableExpression: SExpression = new SAdd(
  new SVariable("x"),
  new SVariable("y"),
);

function runExpressionMachine(expression: SExpression, environment: SEnvironment) {
  const machine = new SExpressionMachine(expression, environment);
  machine.run();
}

runExpressionMachine(numericExpression, environment);
runExpressionMachine(booleanExpression, environment);
runExpressionMachine(variableExpression, environment);

console.groupEnd();
console.group("Statements");

const assignStatement: SStatement = new SAssign("z", new SAdd(new SVariable("x"), new SVariable("y")));

const ifStatement: SStatement = new SIf(
  new SLessThan(new SVariable("x"), new SVariable("y")),
  new SAssign("z", new SAdd(new SVariable("x"), new SVariable("y"))),
  new SAssign("z", new SAdd(new SVariable("y"), new SVariable("x"))),
);

const sequenceStatement: SStatement = new SSequence(
  new SAssign("z", new SAdd(new SVariable("x"), new SVariable("y"))),
  new SAssign("z", new SAdd(new SVariable("z"), new SVariable("z"))),
);

const whileStatement: SStatement = new SWhile(
  new SLessThan(new SVariable("x"), new SVariable("y")),
  new SAssign("x", new SAdd(new SVariable("x"), new SNumber(1))),
);

function runStatementMachine(statement: SStatement, environment: SEnvironment) {
  const machine = new SStatementMachine(statement, environment);
  machine.run();
}

runStatementMachine(assignStatement, environment);
runStatementMachine(ifStatement, environment);
runStatementMachine(sequenceStatement, environment);
runStatementMachine(whileStatement, environment);

console.groupEnd();
console.groupEnd();

console.group("Example: Factorial");

const factorialStatement: SStatement = new SSequence(
  new SAssign("result", new SNumber(1)),
  new SWhile(
    new SLessThan(new SNumber(1), new SVariable("x")),
    new SSequence(
      new SAssign("result", new SMultiply(new SVariable("result"), new SVariable("x"))),
      new SAssign("x", new SAdd(new SVariable("x"), new SNumber(-1))),
    ),
  ),
);

const factorialEnvironment: SEnvironment = {
  x: new SNumber(5),
};

runStatementMachine(factorialStatement, factorialEnvironment);

console.groupEnd();
