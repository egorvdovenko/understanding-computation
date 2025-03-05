export type SExpression = SNumber | SBoolean | SAdd | SMultiply | SLessThan | SVariable;
export type SStatement = SDoNothing | SAssign | SIf | SSequence | SWhile;

export type SEnvironment = Record<string, SExpression>;

export abstract class SReducible {
  abstract reduce(environment: SEnvironment): SExpression | [SStatement, SEnvironment];
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
export class SBoolean {
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
export class SAdd extends SReducible {
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

  public reduce(environment: SEnvironment) {
    if (this.left.reducible) {
      return new SAdd((this.left as SReducible).reduce(environment) as SExpression, this.right);
    } else if (this.right.reducible) {
      return new SAdd(this.left, (this.right as SReducible).reduce(environment) as SExpression);
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
export class SMultiply extends SReducible {
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

  public reduce(environment: SEnvironment) {
    if (this.left.reducible) {
      return new SMultiply((this.left as SReducible).reduce(environment)  as SExpression, this.right);
    } else if (this.right.reducible) {
      return new SMultiply(this.left, (this.right as SReducible).reduce(environment)  as SExpression);
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
export class SLessThan extends SReducible {
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

  public reduce(environment: SEnvironment) {
    if (this.left.reducible) {
      return new SLessThan((this.left as SReducible).reduce(environment) as SExpression, this.right);
    } else if (this.right.reducible) {
      return new SLessThan(this.left, (this.right as SReducible).reduce(environment) as SExpression);
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
export class SVariable extends SReducible {
  constructor(name: string) {
    super();

    this.name = name;
  }

  name: string;

  public toString(): string {
    return this.name;
  }

  get reducible(): boolean {
    return true;
  }

  public reduce(environment: SEnvironment) {
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
  public toString() {
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
export class SAssign extends SReducible {
  constructor(name: string, expression: SExpression) {
    super();

    this.name = name;
    this.expression = expression;
  }

  name: string;
  expression: SExpression;

  public toString() {
    return `${this.name} = ${this.expression}`;
  }

  get reducible() {
    return true;
  }

  public reduce(environment: SEnvironment) {
    if (this.expression.reducible) {
      return [new SAssign(this.name, (this.expression as SReducible).reduce(environment) as SExpression), environment] as [SStatement, SEnvironment];
    } else {
      const newEnvironment = { ...environment };
      newEnvironment[this.name] = this.expression;
      return [new SDoNothing(), newEnvironment] as [SStatement, SEnvironment];
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
export class SIf extends SReducible {
  constructor(condition: SExpression, consequence: SStatement, alternative: SStatement) {
    super();

    this.condition = condition;
    this.consequence = consequence;
    this.alternative = alternative;
  }

  condition: SExpression;
  consequence: SStatement;
  alternative: SStatement;

  public toString() {
    return `if (${this.condition}) { ${this.consequence} } else { ${this.alternative} }`;
  }

  get reducible() {
    return true;
  }

  public reduce(environment: SEnvironment) {
    if (this.condition.reducible) {
      return [new SIf((this.condition as SReducible).reduce(environment) as SExpression, this.consequence, this.alternative), environment] as [SStatement, SEnvironment];
    } else {
      return (this.condition as SBoolean).value === new SBoolean(true).value
        ? [this.consequence, environment] as [SStatement, SEnvironment]
        : [this.alternative, environment] as [SStatement, SEnvironment];
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
export class SSequence extends SReducible {
  constructor(first: SStatement, second: SStatement) {
    super();

    this.first = first;
    this.second = second;
  }

  first: SStatement;
  second: SStatement;

  public toString() {
    return `${this.first}; ${this.second}`;
  }

  get reducible() {
    return true;
  }

  public reduce(environment: SEnvironment) {
    if (this.first instanceof SDoNothing) {
      return [this.second, environment] as [SStatement, SEnvironment];
    } else {
      const [first, newEnvironment] = (this.first as SReducible).reduce(environment) as [SStatement, SEnvironment];
      return [new SSequence(first, this.second), newEnvironment] as [SStatement, SEnvironment];
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
export class SWhile extends SReducible {
  constructor(condition: SExpression, body: SStatement) {
    super();

    this.condition = condition;
    this.body = body;
  }

  condition: SExpression;
  body: SStatement;

  public toString() {
    return `while (${this.condition}) { ${this.body} }`;
  }

  get reducible() {
    return true;
  }

  public reduce(environment: SEnvironment) {
    return [new SIf(this.condition, new SSequence(this.body, this), new SDoNothing()), environment] as [SStatement, SEnvironment];
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

  public step() {
    this.expression = (this.expression as SReducible).reduce(this.environment) as SExpression;
  }

  public run() {
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

  public step() {
    const [statement, environment] = (this.statement as SReducible).reduce(this.environment) as [SStatement, SEnvironment];
    this.statement = statement;
    this.environment = environment;
  }

  public run() {
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
