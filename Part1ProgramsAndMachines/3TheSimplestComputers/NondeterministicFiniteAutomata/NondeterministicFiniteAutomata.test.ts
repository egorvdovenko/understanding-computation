import {
  FARule,
  NFARulebook,
  NFA,
  NFADesign
} from "./NondeterministicFiniteAutomata";

describe("NondeterministicFiniteAutomata", () => {
  const rules = [
    new FARule(0, "a", 1),
    new FARule(1, "b", 1),
    new FARule(1, "b", 2),
    new FARule(2, "a", 3),
    new FARule(3, "b", 4)
  ];

  describe("FARule", () => {
    it("should create an instance with the given state, character, and next state", () => {
      const rule = new FARule(0, "a", 1);
      expect(rule.state).toBe(0);
      expect(rule.character).toBe("a");
      expect(rule.nextState).toBe(1);
    });

    it("should apply to the given state and character", () => {
      const rule = new FARule(0, "a", 1);
      expect(rule.appliesTo(0, "a")).toBeTruthy();
      expect(rule.appliesTo(2, "b")).toBeFalsy();
    });

    it("should follow to the next state", () => {
      const rule = new FARule(0, "a", 1);
      expect(rule.follow()).toBe(1);
    });

    it("should return a string representation of the rule", () => {
      const rule = new FARule(0, "a", 1);
      expect(rule.toString()).toBe("0 -> a -> 1");
    });
  });

  describe("NFARulebook", () => {
    it("should create an instance with the given rules", () => {
      const rulebook = new NFARulebook(rules);
      expect(rulebook.rules).toEqual(rules);
    });

    it("should return the next states", () => {
      const rulebook = new NFARulebook(rules);
      expect(rulebook.nextStates(new Set([0]), "a")).toEqual(new Set([1]));
      expect(rulebook.nextStates(new Set([1]), "b")).toEqual(new Set([1, 2]));
      expect(rulebook.nextStates(new Set([1, 2]), "a")).toEqual(new Set([3]));
    });

    it("should return the following rules for the given state and character", () => {
      const rulebook = new NFARulebook(rules);
      expect(rulebook.followRulesFor(1, "b")).toEqual([1, 2]);
    });

    it("should return the rules for the given state and character", () => {
      const rulebook = new NFARulebook(rules);
      expect(rulebook.rulesFor(1, "b")).toEqual([rules[1], rules[2]]);
    });
  });

  describe("NFA", () => {
    it("should create an instance with the given current states, accept states, and rulebook", () => {
      const rulebook = new NFARulebook(rules);
      const nfa = new NFA(new Set([0]), [4], rulebook);
      expect(nfa.currentStates).toEqual(new Set([0]));
      expect(nfa.acceptStates).toEqual([4]);
      expect(nfa.rulebook).toBe(rulebook);
    });

    it("should accept the string", () => {
      const rulebook = new NFARulebook(rules);
      const nfa = new NFA(new Set([0]), [4], rulebook);
      nfa.readCharacter("a");
      nfa.readCharacter("b");
      nfa.readCharacter("b");
      nfa.readCharacter("a");
      nfa.readCharacter("b");
      expect(nfa.accepting()).toBeTruthy();
    });

    it("should accept the string", () => {
      const rulebook = new NFARulebook(rules);
      const nfa = new NFA(new Set([0]), [4], rulebook);
      nfa.readString("abab");
      expect(nfa.accepting()).toBeTruthy();
    });
  });

  describe("NFADesign", () => {
    it("should create an instance with the given start state, accept states, and rulebook", () => {
      const rulebook = new NFARulebook(rules);
      const nfaDesign = new NFADesign(0, [4], rulebook);
      expect(nfaDesign.startState).toBe(0);
      expect(nfaDesign.acceptStates).toEqual([4]);
      expect(nfaDesign.rulebook).toBe(rulebook);
    });

    it("should accept the string", () => {
      const rulebook = new NFARulebook(rules);
      const nfaDesign = new NFADesign(0, [4], rulebook);
      expect(nfaDesign.accepts("abab")).toBeTruthy();
    });
  });
});
