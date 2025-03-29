import {
  Empty,
  Literal,
  Concatenate,
  Choose,
  Repeat
} from "./RegularExpressions";

describe("RegularExpressions", () => {
  describe("Empty", () => {
    it("should have precedence 3", () => {
      const empty = new Empty();
      expect(empty.precedence).toBe(3);
    });

    it("should return an empty string when converted to string", () => {
      const empty = new Empty();
      expect(empty.toString()).toBe("");
    });

    it("should accept an empty string", () => {
      const empty = new Empty();
      expect(empty.matches("")).toBe(true);
    });

    it("should not accept a non-empty string", () => {
      const empty = new Empty();
      expect(empty.matches("a")).toBe(false);
    });
  });

  describe("Literal", () => {
    it("should have precedence 3", () => {
      const literal = new Literal("a");
      expect(literal.precedence).toBe(3);
    });

    it("should return the character when converted to string", () => {
      const literal = new Literal("a");
      expect(literal.toString()).toBe("a");
    });

    it("should accept the character when matched", () => {
      const literal = new Literal("a");
      expect(literal.matches("a")).toBe(true);
    });

    it("should not accept a different character when matched", () => {
      const literal = new Literal("a");
      expect(literal.matches("b")).toBe(false);
    });
  });

  describe("Concatenate", () => {
    it("should have precedence 1", () => {
      const concat = new Concatenate(new Literal("a"), new Literal("b"));
      expect(concat.precedence).toBe(1);
    });

    it("should return the concatenated string when converted to string", () => {
      const concat = new Concatenate(new Literal("a"), new Literal("b"));
      expect(concat.toString()).toBe("ab");
    });

    it("should accept the concatenated string when matched", () => {
      const concat = new Concatenate(new Literal("a"), new Literal("b"));
      expect(concat.matches("ab")).toBe(true);
    });

    it("should not accept a different string when matched", () => {
      const concat = new Concatenate(new Literal("a"), new Literal("b"));
      expect(concat.matches("ba")).toBe(false);
    });
  });

  describe("Choose", () => {
    it("should have precedence 0", () => {
      const choose = new Choose(new Literal("a"), new Literal("b"));
      expect(choose.precedence).toBe(0);
    });

    it("should return the chosen string when converted to string", () => {
      const choose = new Choose(new Literal("a"), new Literal("b"));
      expect(choose.toString()).toBe("a|b");
    });

    it("should accept either string when matched", () => {
      const choose = new Choose(new Literal("a"), new Literal("b"));
      expect(choose.matches("a")).toBe(true);
      expect(choose.matches("b")).toBe(true);
    });

    it("should not accept a different string when matched", () => {
      const choose = new Choose(new Literal("a"), new Literal("b"));
      expect(choose.matches("c")).toBe(false);
    });
  });

  describe("Repeat", () => {
    it("should have precedence 2", () => {
      const repeat = new Repeat(new Literal("a"));
      expect(repeat.precedence).toBe(2);
    });

    it("should return the repeated string when converted to string", () => {
      const repeat = new Repeat(new Literal("a"));
      expect(repeat.toString()).toBe("a*");
    });

    it("should accept the repeated string when matched", () => {
      const repeat = new Repeat(new Literal("a"));
      expect(repeat.matches("")).toBe(true);
      expect(repeat.matches("a")).toBe(true);
      expect(repeat.matches("aa")).toBe(true);
    });

    it("should not accept a different string when matched", () => {
      const repeat = new Repeat(new Literal("a"));
      expect(repeat.matches("b")).toBe(false);
    });
  });
});
