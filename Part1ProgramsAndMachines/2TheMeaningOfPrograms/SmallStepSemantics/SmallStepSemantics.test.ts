import { 
  SNumber, 
  SBoolean, 
  SAdd, 
  SMultiply, 
  SLessThan, 
  SVariable, 
  SDoNothing,
  SAssign,
  SIf,
  SSequence,
  SWhile,
  SExpressionMachine,
  SStatementMachine,
} from "./SmallStepSemantics";

describe("SmallStepSemantics", () => {
  describe("SNumber", () => {
    it("should create an instance with the given value", () => {
      const num = new SNumber(5);
      expect(num.value).toBe(5);
    });

    it("should return the correct string representation", () => {
      const num = new SNumber(5);
      expect(num.toString()).toBe("5");
    });

    it("should indicate that it is not reducible", () => {
      const num = new SNumber(5);
      expect(num.reducible).toBe(false);
    });
  });

  describe("SBoolean", () => {
    it("should create an instance with the given value", () => {
      const bool = new SBoolean(true);
      expect(bool.value).toBe(true);
    });

    it("should return the correct string representation", () => {
      const bool = new SBoolean(true);
      expect(bool.toString()).toBe("true");
    });

    it("should indicate that it is not reducible", () => {
      const bool = new SBoolean(true);
      expect(bool.reducible).toBe(false);
    });
  });

  describe("SAdd", () => {
    it("should create an instance with the given left and right expressions", () => {
      const add = new SAdd(new SNumber(5), new SNumber(3));
      expect(add.toString()).toBe("5 + 3");
    });

    it("should indicate that it is reducible", () => {
      const add = new SAdd(new SNumber(5), new SNumber(3));
      expect(add.reducible).toBe(true);
    });

    it("should reduce to a new SAdd instance if the left expression is reducible", () => {
      const add = new SAdd(new SAdd(new SNumber(2), new SNumber(3)), new SNumber(3));
      const reduced = add.reduce({});
      expect(reduced.toString()).toBe("5 + 3");
    });

    it("should reduce to a new SAdd instance if the right expression is reducible", () => {
      const add = new SAdd(new SNumber(5), new SAdd(new SNumber(1), new SNumber(2)));
      const reduced = add.reduce({});
      expect(reduced.toString()).toBe("5 + 3");
    });

    it("should reduce to an SNumber instance if both expressions are not reducible", () => {
      const add = new SAdd(new SNumber(5), new SNumber(3));
      const reduced = add.reduce({});
      expect(reduced.toString()).toBe("8");
    });
  });

  describe("SMultiply", () => {
    it("should create an instance with the given left and right expressions", () => {
      const multiply = new SMultiply(new SNumber(5), new SNumber(3));
      expect(multiply.toString()).toBe("5 * 3");
    });

    it("should indicate that it is reducible", () => {
      const multiply = new SMultiply(new SNumber(5), new SNumber(3));
      expect(multiply.reducible).toBe(true);
    });

    it("should reduce to a new SMultiply instance if the left expression is reducible", () => {
      const multiply = new SMultiply(new SMultiply(new SNumber(2), new SNumber(3)), new SNumber(3));
      const reduced = multiply.reduce({});
      expect(reduced.toString()).toBe("6 * 3");
    });

    it("should reduce to a new SMultiply instance if the right expression is reducible", () => {
      const multiply = new SMultiply(new SNumber(5), new SMultiply(new SNumber(1), new SNumber(2)));
      const reduced = multiply.reduce({});
      expect(reduced.toString()).toBe("5 * 2");
    });

    it("should reduce to an SNumber instance if both expressions are not reducible", () => {
      const multiply = new SMultiply(new SNumber(5), new SNumber(3));
      const reduced = multiply.reduce({});
      expect(reduced.toString()).toBe("15");
    });
  });

  describe("SLessThan", () => {
    it("should create an instance with the given left and right expressions", () => {
      const lessThan = new SLessThan(new SNumber(5), new SNumber(3));
      expect(lessThan.toString()).toBe("5 < 3");
    });

    it("should indicate that it is reducible", () => {
      const lessThan = new SLessThan(new SNumber(5), new SNumber(3));
      expect(lessThan.reducible).toBe(true);
    });

    it("should reduce to a new SLessThan instance if the left expression is reducible", () => {
      const lessThan = new SLessThan(new SAdd(new SNumber(2), new SNumber(3)), new SNumber(3));
      const reduced = lessThan.reduce({});
      expect(reduced.toString()).toBe("5 < 3");
    });

    it("should reduce to a new SLessThan instance if the right expression is reducible", () => {
      const lessThan = new SLessThan(new SNumber(5), new SAdd(new SNumber(1), new SNumber(2)));
      const reduced = lessThan.reduce({});
      expect(reduced.toString()).toBe("5 < 3");
    });

    it("should reduce to an SBoolean instance if both expressions are not reducible", () => {
      const lessThan = new SLessThan(new SNumber(5), new SNumber(3));
      const reduced = lessThan.reduce({});
      expect(reduced.toString()).toBe("false");
    });
  });

  describe("SVariable", () => {
    it("should create an instance with the given name", () => {
      const variable = new SVariable("x");
      expect(variable.name).toBe("x");
    });

    it("should return the correct string representation", () => {
      const variable = new SVariable("x");
      expect(variable.toString()).toBe("x");
    });

    it("should indicate that it is reducible", () => {
      const variable = new SVariable("x");
      expect(variable.reducible).toBe(true);
    });

    it("should reduce to the value of the variable in the given environment", () => {
      const variable = new SVariable("x");
      const reduced = variable.reduce({ x: new SNumber(5) });
      expect(reduced.toString()).toBe("5");
    });
  });

  describe("SDoNothing", () => {
    it("should return the correct string representation", () => {
      const doNothing = new SDoNothing();
      expect(doNothing.toString()).toBe("do-nothing");
    });

    it("should indicate that it is not reducible", () => {
      const doNothing = new SDoNothing();
      expect(doNothing.reducible).toBe(false);
    });
  });

  describe("SAssign", () => {
    it("should create an instance with the given name and expression", () => {
      const assign = new SAssign("x", new SNumber(5));
      expect(assign.toString()).toBe("x = 5");
    });

    it("should indicate that it is reducible", () => {
      const assign = new SAssign("x", new SNumber(5));
      expect(assign.reducible).toBe(true);
    });

    it("should reduce to a new SAssign instance if the expression is reducible", () => {
      const assign = new SAssign("x", new SAdd(new SNumber(2), new SNumber(3)));
      const [reduced] = assign.reduce({});
      expect(reduced.toString()).toBe("x = 5");
    });

    it("should reduce to an SDoNothing instance and update the environment if the expression is not reducible", () => {
      const assign = new SAssign("x", new SNumber(5));
      const [reduced, environment] = assign.reduce({});
      expect(reduced.toString()).toBe("do-nothing");
      expect(environment.x.toString()).toBe("5");
    });
  });

  describe("SIf", () => {
    it("should create an instance with the given condition, consequence, and alternative", () => {
      const ifStatement = new SIf(new SBoolean(true), new SAssign("x", new SNumber(5)), new SAssign("x", new SNumber(10)));
      expect(ifStatement.toString()).toBe("if (true) { x = 5 } else { x = 10 }");
    });

    it("should indicate that it is reducible", () => {
      const ifStatement = new SIf(new SBoolean(true), new SAssign("x", new SNumber(5)), new SAssign("x", new SNumber(10)));
      expect(ifStatement.reducible).toBe(true);
    });

    it("should reduce to the consequence if the condition is true", () => {
      const ifStatement = new SIf(new SBoolean(true), new SAssign("x", new SNumber(5)), new SAssign("x", new SNumber(10)));
      const [reduced] = ifStatement.reduce({});
      expect(reduced.toString()).toBe("x = 5");
    });

    it("should reduce to the alternative if the condition is false", () => {
      const ifStatement = new SIf(new SBoolean(false), new SAssign("x", new SNumber(5)), new SAssign("x", new SNumber(10)));
      const [reduced] = ifStatement.reduce({});
      expect(reduced.toString()).toBe("x = 10");
    });

    it("should reduce the condition if it is reducible", () => {
      const ifStatement = new SIf(new SLessThan(new SNumber(2), new SNumber(3)), new SAssign("x", new SNumber(5)), new SAssign("x", new SNumber(10)));
      const [reduced] = ifStatement.reduce({});
      expect(reduced.toString()).toBe("if (true) { x = 5 } else { x = 10 }");
    });

    it("should reduce to the consequence if the condition reduces to true", () => {
      const ifStatement = new SIf(new SBoolean(true), new SDoNothing(), new SAssign("x", new SNumber(10)));
      const [reduced] = ifStatement.reduce({});
      expect(reduced.toString()).toBe("do-nothing");
    });

    it("should reduce to the alternative if the condition reduces to false", () => {
      const ifStatement = new SIf(new SBoolean(false), new SAssign("x", new SNumber(5)), new SDoNothing());
      const [reduced] = ifStatement.reduce({});
      expect(reduced.toString()).toBe("do-nothing");
    });
  });

  describe("SSequence", () => {
    it("should create an instance with the given first and second statements", () => {
      const sequence = new SSequence(new SDoNothing(), new SAssign("x", new SNumber(5)));
      expect(sequence.toString()).toBe("do-nothing; x = 5");
    });

    it("should indicate that it is reducible", () => {
      const sequence = new SSequence(new SDoNothing(), new SAssign("x", new SNumber(5)));
      expect(sequence.reducible).toBe(true);
    });

    it("should reduce to the second statement if the first statement is SDoNothing", () => {
      const sequence = new SSequence(new SDoNothing(), new SAssign("x", new SNumber(5)));
      const [reduced] = sequence.reduce({});
      expect(reduced.toString()).toBe("x = 5");
    });

    it("should reduce the first statement if it is reducible", () => {
      const sequence = new SSequence(new SAssign("x", new SAdd(new SNumber(2), new SNumber(3))), new SDoNothing());
      const [reduced] = sequence.reduce({});
      expect(reduced.toString()).toBe("x = 5; do-nothing");
    });

    it("should handle complex sequences", () => {
      const sequence = new SSequence(
        new SAssign("x", new SAdd(new SNumber(2), new SNumber(3))),
        new SAssign("y", new SMultiply(new SVariable("x"), new SNumber(2)))
      );
      const machine = new SStatementMachine(sequence, {});
      machine.run();
      expect(machine.statement.toString()).toBe("do-nothing");
      expect(machine.environment.x.toString()).toBe("5");
      expect(machine.environment.y.toString()).toBe("10");
    });
  });

  describe("SWhile", () => {
    it("should create an instance with the given condition and body", () => {
      const whileStatement = new SWhile(new SLessThan(new SVariable("x"), new SNumber(5)), new SAssign("x", new SAdd(new SVariable("x"), new SNumber(1))));
      expect(whileStatement.toString()).toBe("while (x < 5) { x = x + 1 }");
    });

    it("should indicate that it is reducible", () => {
      const whileStatement = new SWhile(new SLessThan(new SVariable("x"), new SNumber(5)), new SAssign("x", new SAdd(new SVariable("x"), new SNumber(1))));
      expect(whileStatement.reducible).toBe(true);
    });

    it("should reduce to an SIf statement", () => {
      const whileStatement = new SWhile(new SLessThan(new SVariable("x"), new SNumber(5)), new SAssign("x", new SAdd(new SVariable("x"), new SNumber(1))));
      const [reduced] = whileStatement.reduce({});
      expect(reduced.toString()).toBe("if (x < 5) { x = x + 1; while (x < 5) { x = x + 1 } } else { do-nothing }");
    });

    it("should handle while loops correctly", () => {
      const whileStatement = new SWhile(new SLessThan(new SVariable("x"), new SNumber(5)), new SAssign("x", new SAdd(new SVariable("x"), new SNumber(1))));
      const machine = new SStatementMachine(whileStatement, { x: new SNumber(0) });
      machine.run();
      expect(machine.statement.toString()).toBe("do-nothing");
      expect(machine.environment.x.toString()).toBe("5");
    });

    it("should handle complex while loops", () => {
      const whileStatement = new SWhile(
        new SLessThan(new SVariable("x"), new SNumber(5)),
        new SSequence(
          new SAssign("y", new SAdd(new SVariable("y"), new SNumber(2))),
          new SAssign("x", new SAdd(new SVariable("x"), new SNumber(1)))
        )
      );
      const machine = new SStatementMachine(whileStatement, { x: new SNumber(0), y: new SNumber(0) });
      machine.run();
      expect(machine.statement.toString()).toBe("do-nothing");
      expect(machine.environment.x.toString()).toBe("5");
      expect(machine.environment.y.toString()).toBe("10");
    });
  });

  describe("SExpressionMachine", () => {
    it("should create an instance with the given expression", () => {
      const expression = new SAdd(new SNumber(2), new SNumber(3));
      const machine = new SExpressionMachine(expression, {});
      expect(machine.expression.toString()).toBe("2 + 3");
    });

    it("should step through a reducible expression", () => {
      const expression = new SAdd(new SNumber(2), new SNumber(3));
      const machine = new SExpressionMachine(expression, {});
      machine.step();
      expect(machine.expression.toString()).toBe("5");
    });

    it("should run through a reducible expression to completion", () => {
      const expression = new SAdd(new SNumber(2), new SNumber(3));
      const machine = new SExpressionMachine(expression, {});
      machine.run();
      expect(machine.expression.toString()).toBe("5");
    });

    it("should handle complex expressions", () => {
      const expression = new SAdd(
        new SMultiply(new SNumber(2), new SNumber(3)),
        new SMultiply(new SNumber(4), new SNumber(5))
      );
      const machine = new SExpressionMachine(expression, {});
      machine.run();
      expect(machine.expression.toString()).toBe("26");
    });

    it("should handle variables in the environment", () => {
      const expression = new SAdd(new SVariable("x"), new SNumber(3));
      const machine = new SExpressionMachine(expression, { x: new SNumber(2) });
      machine.run();
      expect(machine.expression.toString()).toBe("5");
    });
  });

  describe("SStatementMachine", () => {
    it("should create an instance with the given statement", () => {
      const statement = new SAssign("x", new SNumber(5));
      const machine = new SStatementMachine(statement, {});
      expect(machine.statement.toString()).toBe("x = 5");
    });

    it("should step through a reducible statement", () => {
      const statement = new SAssign("x", new SAdd(new SNumber(2), new SNumber(3)));
      const machine = new SStatementMachine(statement, {});
      machine.step();
      expect(machine.statement.toString()).toBe("x = 5");
    });

    it("should run through a reducible statement to completion", () => {
      const statement = new SAssign("x", new SAdd(new SNumber(2), new SNumber(3)));
      const machine = new SStatementMachine(statement, {});
      machine.run();
      expect(machine.statement.toString()).toBe("do-nothing");
      expect(machine.environment.x.toString()).toBe("5");
    });

    it("should handle variables in the environment", () => {
      const statement = new SAssign("x", new SAdd(new SVariable("y"), new SNumber(3)));
      const machine = new SStatementMachine(statement, { y: new SNumber(2) });
      machine.run();
      expect(machine.statement.toString()).toBe("do-nothing");
      expect(machine.environment.x.toString()).toBe("5");
    });

    it("should handle complex statements", () => {
      const statement = new SAssign("z", new SMultiply(new SAdd(new SVariable("x"), new SNumber(3)), new SAdd(new SVariable("y"), new SNumber(10))));
      const machine = new SStatementMachine(statement, { x: new SNumber(2), y: new SNumber(5) });
      machine.run();
      expect(machine.statement.toString()).toBe("do-nothing");
      expect(machine.environment.z.toString()).toBe("75");
    });
  });
});
