import {
  FARule,
  DFARulebook,
  DFA,
  DFADesign
} from "./DeterministicFiniteAutomata";

describe("DeterministicFiniteAutomata", () => {
  const states = [new Set([0]), new Set([1]), new Set([2])];

  const rulebook = new DFARulebook([
    new FARule(states[0], "a", states[1]),
    new FARule(states[0], "b", states[0]),
    new FARule(states[1], "a", states[1]),
    new FARule(states[1], "b", states[2]),
  ]);
  
  describe("FARule", () => {
    it("should apply to the given state and character", () => {
      const rule = new FARule(states[0], "a", states[1]);
      expect(rule.appliesTo(states[0], "a")).toBeTruthy();
      expect(rule.appliesTo(states[2], "b")).toBeFalsy();
    });

    it("should follow to the next state", () => {
      const rule = new FARule(states[0], "a", states[1]);
      expect(rule.follow()).toEqual(states[1]);
    });
  });

  describe("DFARulebook", () => {
    it("should return the next state after applying a rule to a given state and character", () => {
      expect(rulebook.nextState(states[0], "a")).toBe(states[1]);
      expect(rulebook.nextState(states[1], "b")).toBe(states[2]);
    });

    it("should find the rule for a specific state and character", () => {
      expect(rulebook.ruleFor(states[0], "a").toString()).toBe("{0} -> a -> {1}");
      expect(rulebook.ruleFor(states[1], "b").toString()).toBe("{1} -> b -> {2}");
    });
  });

  describe("DFA", () => {
    it("should return true if the DFA is in an accepting state", () => {
      const dfa = new DFA(states[0], states[0], rulebook);
      expect(dfa.accepting()).toBeTruthy();
    });

    it("should return false if the DFA is not in an accepting state", () => {
      const dfa = new DFA(states[0], states[2], rulebook);
      expect(dfa.accepting()).toBeFalsy();
    });

    it("should transition the DFA to the next state based on the given character", () => {
      const dfa = new DFA(states[0], states[1], rulebook);
      dfa.readCharacter("a");
      expect(dfa.currentState).toBe(states[1]);
    });

    it("should transition the DFA to the next state based on the given string", () => {
      const dfa = new DFA(states[0], states[1], rulebook);
      dfa.readString("ab");
      expect(dfa.currentState).toBe(states[2]);
    });
  });

  describe("DFADesign", () => {
    it("should check if the DFA design accepts a valid input string", () => {
      const dfaDesign = new DFADesign(states[0], states[2], rulebook);
      expect(dfaDesign.accepts("ab")).toBeTruthy();
      expect(dfaDesign.accepts("aa")).toBeFalsy();
    });

    it("should check if the DFA design accepts an empty string", () => {
      const dfaDesign = new DFADesign(states[0], states[2], rulebook);
      expect(dfaDesign.accepts("")).toBeFalsy();
    });
  });
});