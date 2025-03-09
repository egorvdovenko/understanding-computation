import { 
  SNumber, 
  SBoolean, 
  SVariable, 
  SAdd, 
  SMultiply, 
  SLessThan, 
} from "./BigStepSemantics";

describe("BigStepSemantics", () => {
  describe("SNumber", () => {
    it("should create an instance with the given value", () => {
      const num = new SNumber(5);
      expect(num.value).toBe(5);
    });

    it("should evaluate to the correct number", () => {
      const num = new SNumber(5);
      expect(num.eval()).toBe(5);
    });

    it("should return the correct string representation", () => {
      const num = new SNumber(5);
      expect(num.toString()).toBe("5");
    });
  });

  describe("SBoolean", () => {
    it("should create an instance with the given value", () => {
      const bool = new SBoolean(true);
      expect(bool.value).toBe(true);
    });

    it("should evaluate to the correct boolean", () => {
      const bool = new SBoolean(true);
      expect(bool.eval()).toBe(true);
    });

    it("should return the correct string representation", () => {
      const bool = new SBoolean(true);
      expect(bool.toString()).toBe("true");
    });
  });

  describe("SVariable", () => {
    it("should create an instance with the given name", () => {
      const varName = "x";
      const variable = new SVariable(varName);
      expect(variable.name).toBe(varName);
    });

    it("should evaluate to the correct value from the environment", () => {
      const varName = "x";
      const variable = new SVariable(varName);
      const env = { x: 5 };
      expect(variable.eval(env)).toBe(5);
    });

    it("should return the correct string representation", () => {
      const varName = "x";
      const variable = new SVariable(varName);
      expect(variable.toString()).toBe(varName);
    });
  });

  describe("SAdd", () => {
    it("should create an instance with the given left and right expressions", () => {
      const left = new SNumber(5);
      const right = new SNumber(3);
      const add = new SAdd(left, right);
      expect(add.left).toBe(left);
      expect(add.right).toBe(right);
    });

    it("should evaluate to the correct sum of the left and right expressions", () => {
      const left = new SNumber(5);
      const right = new SNumber(3);
      const add = new SAdd(left, right);
      const env = {};
      expect(add.eval(env)).toBe(8);
    });

    it("should evaluate to the correct sum of the complex left and right expressions", () => {
      const left = new SAdd(new SNumber(2), new SNumber(3));
      const right = new SAdd(new SNumber(3), new SNumber(2));
      const add = new SAdd(left, right);
      const env = {};
      expect(add.eval(env)).toBe(10);
    });

    it("should return the correct string representation", () => {
      const left = new SNumber(5);
      const right = new SNumber(3);
      const add = new SAdd(left, right);
      expect(add.toString()).toBe("5 + 3");
    });
  });

  describe("SMultiply", () => {
    it("should create an instance with the given left and right expressions", () => {
      const left = new SNumber(5);
      const right = new SNumber(3);
      const multiply = new SMultiply(left, right);
      expect(multiply.left).toBe(left);
      expect(multiply.right).toBe(right);
    });

    it("should evaluate to the correct product of the left and right expressions", () => {
      const left = new SNumber(5);
      const right = new SNumber(3);
      const multiply = new SMultiply(left, right);
      const env = {};
      expect(multiply.eval(env)).toBe(15);
    });

    it("should evaluate to the correct product of the complex left and right expressions", () => {
      const left = new SMultiply(new SNumber(2), new SNumber(3));
      const right = new SMultiply(new SNumber(3), new SNumber(2));
      const multiply = new SMultiply(left, right);
      const env = {};
      expect(multiply.eval(env)).toBe(36);
    });

    it("should return the correct string representation", () => {
      const left = new SNumber(5);
      const right = new SNumber(3);
      const multiply = new SMultiply(left, right);
      expect(multiply.toString()).toBe("5 * 3");
    });
  });

  describe("SLessThan", () => {
    it("should create an instance with the given left and right expressions", () => {
      const left = new SNumber(5);
      const right = new SNumber(3);
      const lessThan = new SLessThan(left, right);
      expect(lessThan.left).toBe(left);
      expect(lessThan.right).toBe(right);
    });

    it("should evaluate to the correct boolean based on the comparison of the left and right expressions", () => {
      const left = new SNumber(5);
      const right = new SNumber(3);
      const lessThan = new SLessThan(left, right);
      const env = {};
      expect(lessThan.eval(env)).toBe(false);
    });

    it("should return the correct string representation", () => {
      const left = new SNumber(5);
      const right = new SNumber(3);
      const lessThan = new SLessThan(left, right);
      expect(lessThan.toString()).toBe("5 < 3");
    });
  });
});