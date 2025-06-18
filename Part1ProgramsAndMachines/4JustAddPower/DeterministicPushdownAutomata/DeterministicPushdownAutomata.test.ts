import { Stack, PDAConfiguration, PDARule, DPDARulebook, DPDA, DPDADesign } from "./DeterministicPushdownAutomata";

describe("Deterministic Pushdown Automaton (DPDA)", () => {
  describe("Stack", () => {
    it("should push and pop elements correctly", () => {
      const stack = new Stack(["a", "b", "c"]);
      expect(stack.top()).toBe("a");
      const poppedStack = stack.pop();
      expect(poppedStack.top()).toBe("b");
      const pushedStack = stack.push("x");
      expect(pushedStack.top()).toBe("x");
    });

    it("should return a string representation", () => {
      const stack = new Stack(["a", "b", "c"]);
      expect(stack.toString()).toBe("[a]bc");
    });
  });

  describe("PDARule", () => {
    it("should apply to correct configurations", () => {
      const rule = new PDARule(1, "(", 2, "$", ["b", "$"]);
      const configuration = new PDAConfiguration(1, new Stack(["$"]));
      expect(rule.appliesTo(configuration, "(")).toBe(true);
    });

    it("should follow the rule and update the stack", () => {
      const rule = new PDARule(1, "(", 2, "$", ["b", "$"]);
      const configuration = new PDAConfiguration(1, new Stack(["$"]));
      const newConfiguration = rule.follow(configuration);
      expect(newConfiguration.state).toBe(2);
      expect(newConfiguration.stack.toString()).toBe("[b]$");
    });
  });

  describe("DPDARulebook", () => {
    it("should find applicable rules", () => {
      const rulebook = new DPDARulebook([
        new PDARule(1, "(", 2, "$", ["b", "$"]),
        new PDARule(2, ")", 1, "b", []),
      ]);
      const configuration = new PDAConfiguration(1, new Stack(["$"]));
      expect(rulebook.appliesTo(configuration, "(")).toBe(true);
    });

    it("should follow free moves", () => {
      const rulebook = new DPDARulebook([
        new PDARule(1, "ε", 2, "$", ["$"]),
      ]);
      const configuration = new PDAConfiguration(1, new Stack(["$"]));
      const newConfiguration = rulebook.followFreeMoves(configuration);
      expect(newConfiguration.state).toBe(2);
    });
  });

  describe("DPDA", () => {
    it("should accept valid strings", () => {
      const rulebook = new DPDARulebook([
        new PDARule(1, "(", 2, "$", ["b", "$"]),
        new PDARule(2, "(", 2, "b", ["b", "b"]),
        new PDARule(2, ")", 2, "b", []),
        new PDARule(2, "ε", 1, "$", ["$"]),
      ]);
      const dpda = new DPDA(new PDAConfiguration(1, new Stack(["$"])), [1], rulebook);
      dpda.readString(["(", "(", ")", "(", ")", ")"]);
      expect(dpda.accepting()).toBe(true);
    });

    it("should reject invalid strings", () => {
      const rulebook = new DPDARulebook([
        new PDARule(1, "(", 2, "$", ["b", "$"]),
        new PDARule(2, "(", 2, "b", ["b", "b"]),
        new PDARule(2, ")", 2, "b", []),
        new PDARule(2, "ε", 1, "$", ["$"]),
      ]);
      const dpda = new DPDA(new PDAConfiguration(1, new Stack(["$"])), [1], rulebook);
      dpda.readString(["(", "(", ")", "(", ")"]);
      expect(dpda.accepting()).toBe(false);
    });
  });

  describe("DPDADesign", () => {
    it("should validate strings using the design", () => {
      const rulebook = new DPDARulebook([
        new PDARule(1, "(", 2, "$", ["b", "$"]),
        new PDARule(2, "(", 2, "b", ["b", "b"]),
        new PDARule(2, ")", 2, "b", []),
        new PDARule(2, "ε", 1, "$", ["$"]),
      ]);
      const dpdaDesign = new DPDADesign(1, "$", [1], rulebook);
      expect(dpdaDesign.accepts(["(", "(", ")", "(", ")", ")"])).toBe(true);
      expect(dpdaDesign.accepts(["(", "(", ")", "(", ")"])).toBe(false);
    });
  });
});