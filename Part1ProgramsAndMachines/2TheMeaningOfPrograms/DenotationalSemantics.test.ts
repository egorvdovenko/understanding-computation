import { 
  SNumber, 
  SBoolean, 
  SVariable, 
  SAdd, 
  SMultiply, 
  SLessThan,
  SAssign,
  SDoNothing,
  SIf,
  SSequence,
  SWhile,
} from "./DenotationalSemantics";

describe("DenotationalSemantics", () => {
  describe("SNumber", () => {
    it("should evaluate to the correct number", () => {
      const num = new SNumber(5);
      expect(eval(num.toJS())({})).toBe(5);
    });

    it("should return the correct string representation", () => {
      const num = new SNumber(5);
      expect(num.toString()).toBe("5");
    });
  });
  describe("SBoolean", () => {
    it("should evaluate to the correct boolean", () => {
      const bool = new SBoolean(true);
      expect(eval(bool.toJS())({})).toBe(true);
    });

    it("should return the correct string representation", () => {
      const bool = new SBoolean(true);
      expect(bool.toString()).toBe("true");
    });
  });
  describe("SVariable", () => {
    it("should evaluate to the correct value from the environment", () => {
      const varName = "x";
      const variable = new SVariable(varName);
      const env = { x: 5 };
      expect(eval(variable.toJS())(env).valueOf()).toBe(5);
    });
    
    it("should return the correct string representation", () => {
      const varName = "x";
      const variable = new SVariable(varName);
      expect(variable.toString()).toBe("x");
    });
  });
  describe("SAdd", () => {
    it("should evaluate to the correct sum", () => {
      const add = new SAdd(new SNumber(5), new SNumber(3));
      expect(eval(add.toJS())({}).valueOf()).toBe(8);
    });

    it("should return the correct string representation", () => {
      const add = new SAdd(new SNumber(5), new SNumber(3));
      expect(add.toString()).toBe("5 + 3");
    });
  });
  describe("SMultiply", () => {
    it("should evaluate to the correct product", () => {
      const multiply = new SMultiply(new SNumber(5), new SNumber(3));
      expect(eval(multiply.toJS())({}).valueOf()).toBe(15);
    });

    it("should return the correct string representation", () => {
      const multiply = new SMultiply(new SNumber(5), new SNumber(3));
      expect(multiply.toString()).toBe("5 * 3");
    });
  });
  describe("SLessThan", () => {
    it("should evaluate to the correct boolean", () => {
      const lessThan = new SLessThan(new SNumber(5), new SNumber(3));
      expect(eval(lessThan.toJS())({}).valueOf()).toBe(false);
    });

    it("should return the correct string representation", () => {
      const lessThan = new SLessThan(new SNumber(5), new SNumber(3));
      expect(lessThan.toString()).toBe("5 < 3");
    });
  });
  describe("SAssign", () => {
    it("should evaluate to the correct environment with the variable assigned the value", () => {
      const assign = new SAssign("x", new SNumber(5));
      const env = {};
      expect(eval(assign.toJS())(env)).toEqual({ x: 5 });
    });

    it("should return the correct string representation", () => {
      const assign = new SAssign("x", new SNumber(5));
      expect(assign.toString()).toBe("x = 5");
    });
  });
  describe("SDoNothing", () => {
    it("should evaluate to the same environment", () => {
      const doNothing = new SDoNothing();
      const env = {};
      expect(eval(doNothing.toJS())(env)).toBe(env);
    });

    it("should return the correct string representation", () => {
      const doNothing = new SDoNothing();
      expect(doNothing.toString()).toBe("do-nothing");
    });
  });
  describe("SIf", () => {
    it("should evaluate to the correct environment based on the condition", () => {
      const condition = new SBoolean(true);
      const consequence = new SAssign("x", new SNumber(10));
      const alternative = new SDoNothing();
      const ifStatement = new SIf(condition, consequence, alternative);
      const env = {};
      expect(eval(ifStatement.toJS())(env)).toEqual({ x: 10 });
    });

    it("should return the correct string representation", () => {
      const condition = new SBoolean(true);
      const consequence = new SAssign("x", new SNumber(10));
      const alternative = new SDoNothing();
      const ifStatement = new SIf(condition, consequence, alternative);
      expect(ifStatement.toString()).toBe("if (true) { x = 10 } else { do-nothing }");
    });
  });
  describe("SSequence", () => {
    it("should evaluate to the correct environment after executing both statements", () => {
      const first = new SAssign("x", new SNumber(5));
      const second = new SAssign("y", new SNumber(10));
      const sequence = new SSequence(first, second);
      const env = {};
      expect(eval(sequence.toJS())(env)).toEqual({ x: 5, y: 10 });
    });

    it("should return the correct string representation", () => {
      const first = new SAssign("x", new SNumber(5));
      const second = new SAssign("y", new SNumber(10));
      const sequence = new SSequence(first, second);
      expect(sequence.toString()).toBe("x = 5; y = 10");
    });
  });
  describe("SWhile", () => {
    it("should evaluate to the correct environment after executing the loop", () => {
      const condition = new SLessThan(new SVariable("x"), new SNumber(10));
      const body = new SAssign("x", new SAdd(new SVariable("x"), new SNumber(1)));
      const whileLoop = new SWhile(condition, body);
      const env = { x: 0 };
      expect(eval(whileLoop.toJS())(env)).toEqual({ x: 10 });
    });

    it("should return the correct string representation", () => {
      const condition = new SLessThan(new SVariable("x"), new SNumber(10));
      const body = new SAssign("x", new SAdd(new SVariable("x"), new SNumber(1)));
      const whileLoop = new SWhile(condition, body);
      expect(whileLoop.toString()).toBe("while (x < 10) { x = x + 1 }");
    });
  });
});
