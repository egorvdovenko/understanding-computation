import {
  FARule,
  DFARulebook,
  DFA,
  DFADesign
} from "./DeterministicFiniteAutomata";

describe("DeterministicFiniteAutomata", () => {
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

  describe("DFARulebook", () => {
    it("should create an instance with the given rules", () => {
      const rules = [
        new FARule(0, "a", 1),
        new FARule(1, "b", 2),
      ];
      const automaton = new DFARulebook(rules);
      expect(automaton.rules).toEqual(rules);
    });

    it("should return the next state after applying a rule to a given state and character", () => {
      const rules = [
        new FARule(0, "a", 1),
        new FARule(1, "b", 2),
      ];
      const automaton = new DFARulebook(rules);
      expect(automaton.nextState(0, "a")).toBe(1);
      expect(automaton.nextState(1, "b")).toBe(2);
    });

    it("should find the rule for a specific state and character", () => {
      const rules = [
        new FARule(0, "a", 1),
        new FARule(1, "b", 2),
      ];
      const automaton = new DFARulebook(rules);
      expect(automaton.ruleFor(0, "a").toString()).toBe("0 -> a -> 1");
      expect(automaton.ruleFor(1, "b").toString()).toBe("1 -> b -> 2");
    });
  });

  describe("DFA", () => {
    it("should create an instance with the given current state, accept states, and rulebook", () => {
      const rule1 = new FARule(0, "a", 1);
      const rule2 = new FARule(1, "b", 2);
      const rulebook = new DFARulebook([rule1, rule2]);
      const dfa = new DFA(0, [1], rulebook);
      expect(dfa.currentState).toBe(0);
      expect(dfa.acceptStates).toEqual([1]);
      expect(dfa.rulebook).toBe(rulebook);
    });
    
    it("should return true if the DFA is in an accepting state", () => {
      const rule1 = new FARule(0, "a", 1);
      const rule2 = new FARule(1, "b", 2);
      const rulebook = new DFARulebook([rule1, rule2]);
      const dfa = new DFA(0, [0], rulebook);
      expect(dfa.accepting()).toBeTruthy();
    });

    it("should return false if the DFA is not in an accepting state", () => {
      const rule1 = new FARule(0, "a", 1);
      const rule2 = new FARule(1, "b", 2);
      const rulebook = new DFARulebook([rule1, rule2]);
      const dfa = new DFA(0, [2], rulebook);
      expect(dfa.accepting()).toBeFalsy();
    });

    it("should transition the DFA to the next state based on the given character", () => {
      const rule1 = new FARule(0, "a", 1);
      const rule2 = new FARule(1, "b", 2);
      const rulebook = new DFARulebook([rule1, rule2]);
      const dfa = new DFA(0, [1], rulebook);
      dfa.readCharacter("a");
      expect(dfa.currentState).toBe(1);
    });

    it("should transition the DFA to the next state based on the given string", () => {
      const rule1 = new FARule(0, "a", 1);
      const rule2 = new FARule(1, "b", 2);
      const rulebook = new DFARulebook([rule1, rule2]);
      const dfa = new DFA(0, [1], rulebook);
      dfa.readString("ab");
      expect(dfa.currentState).toBe(2);
    });
  });

  describe("DFADesign", () => {
    it("should create an instance with the given start state, accept states, and rulebook", () => {
      const rule1 = new FARule(0, "a", 1);
      const rule2 = new FARule(1, "b", 2);
      const rulebook = new DFARulebook([rule1, rule2]);
      const dfaDesign = new DFADesign(0, [1], rulebook);
      expect(dfaDesign.startState).toBe(0);
      expect(dfaDesign.acceptStates).toEqual([1]);
      expect(dfaDesign.rulebook).toBe(rulebook);
    });

    it("should convert the DFA design to a DFA", () => {
      const rule1 = new FARule(0, "a", 1);
      const rule2 = new FARule(1, "b", 2);
      const rulebook = new DFARulebook([rule1, rule2]);
      const dfaDesign = new DFADesign(0, [1], rulebook);
      const dfa = dfaDesign.toDFA();
      expect(dfa.currentState).toBe(0);
      expect(dfa.acceptStates).toEqual([1]);
      expect(dfa.rulebook).toBe(rulebook);
    });

    it("should check if the DFA design accepts a given input string", () => {
      const rule1 = new FARule(0, "a", 1);
      const rule2 = new FARule(0, "b", 0);
      const rule3 = new FARule(1, "b", 2);
      const rulebook = new DFARulebook([rule1, rule2, rule3]);
      const dfaDesign = new DFADesign(0, [2], rulebook);
      expect(dfaDesign.accepts("ab")).toBeTruthy();
      expect(dfaDesign.accepts("ba")).toBeFalsy();
    });
  });
});