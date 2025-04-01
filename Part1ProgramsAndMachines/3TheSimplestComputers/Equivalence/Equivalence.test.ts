import { NFASimulation } from "./Equivalence";
import { FARule } from "../DeterministicFiniteAutomata/DeterministicFiniteAutomata";
import { NFARulebook, NFADesign } from "../NondeterministicFiniteAutomata/NondeterministicFiniteAutomata";

describe("Equivalence", () => {
  describe("NFASimulation", () => {
    const states = [new Set([0]), new Set([1]), new Set([2]), new Set([3])];
  
    const rulebook = new NFARulebook([
      new FARule(states[1], "a", states[1]),
      new FARule(states[1], "a", states[2]),
      new FARule(states[1], "ε", states[2]),
      new FARule(states[2], "b", states[3]),
      new FARule(states[3], "b", states[1]),
      new FARule(states[3], "ε", states[2]),
    ]);
    const nfaDesign = new NFADesign(states[1], states[3], rulebook);
  
    it("should correctly calculate the next state", () => {
      const nfaSimulation = new NFASimulation(nfaDesign);
      const initialState = states[1];
      const nextState = nfaSimulation.nextState(initialState, "a");
      expect(Array.from(nextState)).toEqual([1, 2]);
    });
  
    it("should correctly calculate the rules for a given state", () => {
      const nfaSimulation = new NFASimulation(nfaDesign);
      const rules = nfaSimulation.rulesFor(new Set([1, 2]));
      expect(rules.length).toBe(2);
      expect(rules[0].toString()).toBe("{1,2} -> a -> {1,2}");
      expect(rules[1].toString()).toBe("{1,2} -> b -> {2,3}");
    });

    it("should correctly discover states and rules", () => {
      const nfaSimulation = new NFASimulation(nfaDesign);
      const [discoveredStates, rules] = nfaSimulation.discoverStatesAndRules([new Set([1, 2])]);
      expect(discoveredStates.length).toBe(4);
      expect(discoveredStates[0]).toEqual(new Set([1, 2]));
      expect(discoveredStates[1]).toEqual(new Set([2, 3]));
      expect(discoveredStates[2]).toEqual(new Set());
      expect(discoveredStates[3]).toEqual(new Set([2, 3, 1]));
      expect(rules.length).toBe(8);
      expect(rules[0].toString()).toBe("{1,2} -> a -> {1,2}");
      expect(rules[1].toString()).toBe("{1,2} -> b -> {2,3}");
      expect(rules[2].toString()).toBe("{2,3} -> a -> {}");
      expect(rules[3].toString()).toBe("{2,3} -> b -> {2,3,1}");
      expect(rules[4].toString()).toBe("{} -> a -> {}");
      expect(rules[5].toString()).toBe("{} -> b -> {}");
      expect(rules[6].toString()).toBe("{2,3,1} -> a -> {1,2}");
      expect(rules[7].toString()).toBe("{2,3,1} -> b -> {2,3,1}");
    });
  
    it("should correctly simulate the DFA", () => {
      const nfaSimulation = new NFASimulation(nfaDesign);
      const dfaDesign = nfaSimulation.toDFADesign();
      expect(dfaDesign.accepts("aaa")).toBe(false);
      expect(dfaDesign.accepts("aab")).toBe(true);
      expect(dfaDesign.accepts("bbbabb")).toBe(true);
    });
  });
});