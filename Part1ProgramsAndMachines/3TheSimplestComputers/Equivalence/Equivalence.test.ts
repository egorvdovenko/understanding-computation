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
      const state = states[1];
      const rules = nfaSimulation.rulesFor(state);
      expect(rules.length).toBe(2);
    });
  
    it("should correctly discover states and rules", () => {
      const nfaSimulation = new NFASimulation(nfaDesign);
      const initialStates = new Set([states[1]]);
      const [discoveredStates, rules] = nfaSimulation.discoverStatesAndRules(initialStates);
      expect(discoveredStates.size).toBe(5);
      expect(rules.length).toBeGreaterThan(0);
    });
  
    // it("should correctly convert to DFA design", () => {
    //   const nfaSimulation = new NFASimulation(nfaDesign);
    //   const dfaDesign = nfaSimulation.toDFADesign();
    //   expect(dfaDesign).toBeDefined();
    //   expect(dfaDesign.startState).toEqual(states[1]);
    //   expect(dfaDesign.acceptStates).toContain(states[3]);
    // });
  
    // it("should correctly simulate the DFA design", () => {
    //   const nfaSimulation = new NFASimulation(nfaDesign);
    //   const dfaDesign = nfaSimulation.toDFADesign();
    //   expect(dfaDesign.accepts("aaa")).toBe(true);
    //   expect(dfaDesign.accepts("aab")).toBe(false);
    // });
  });
});