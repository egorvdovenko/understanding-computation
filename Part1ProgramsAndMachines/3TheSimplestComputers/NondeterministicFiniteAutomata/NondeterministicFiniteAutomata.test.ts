import { FARule } from "../DeterministicFiniteAutomata/DeterministicFiniteAutomata";
import {
  NFARulebook,
  NFA,
  NFADesign
} from "./NondeterministicFiniteAutomata";

describe("NondeterministicFiniteAutomata", () => {
  const states = [new Set([0]), new Set([1]), new Set([2]), new Set([3]), new Set([4]), new Set([5]), new Set([6])];

  const rulebook = new NFARulebook([
    new FARule(states[1], "ε", states[2]),
    new FARule(states[1], "ε", states[4]),
    new FARule(states[2], "a", states[3]),
    new FARule(states[3], "a", states[2]),
    new FARule(states[4], "a", states[5]),
    new FARule(states[5], "a", states[6]),
    new FARule(states[6], "a", states[4]),
  ]);

  describe("NFARulebook", () => {
    it("should return the next states", () => {
      expect(rulebook.nextStates(states[2], "a")).toEqual(new Set([3]));
      expect(rulebook.nextStates(states[3], "a")).toEqual(new Set([2]));
    });

    it("should return the following rules for the given state and character", () => {
      expect(rulebook.followRulesFor(states[2], "a")).toEqual(new Set([3]));
      expect(rulebook.followRulesFor(states[3], "a")).toEqual(new Set([2]));
    });

    it("should return the rules for the given state and character", () => {
      expect(rulebook.rulesFor(states[2], "a")).toEqual([rulebook.rules[2]]);
      expect(rulebook.rulesFor(states[3], "a")).toEqual([rulebook.rules[3]]);
    });
  });

  describe("NFA", () => {
    it("should accept the characters list", () => {
      const nfa = new NFA(states[1], new Set([2, 4]), rulebook);
      nfa.readCharacter("a");
      nfa.readCharacter("a");
      expect(nfa.accepting()).toBeTruthy();
    });

    it("should accept the string", () => {
      const nfa = new NFA(states[1], new Set([2, 4]), rulebook);
      nfa.readString("aa");
      expect(nfa.accepting()).toBeTruthy();
    });

    it("should not accept the string", () => {
      const nfa = new NFA(states[1], new Set([2, 4]), rulebook);
      nfa.readString("aaaaa");
      expect(nfa.accepting()).toBeFalsy();
    });
  });

  describe("NFADesign", () => {
    it("should accept the string", () => {
      const nfaDesign = new NFADesign(states[1], new Set([2, 4]), rulebook);
      expect(nfaDesign.accepts("aa")).toBeTruthy();
    });

    it("should not accept the string", () => {
      const nfaDesign = new NFADesign(states[1], new Set([2, 4]), rulebook);
      expect(nfaDesign.accepts("aaaaa")).toBeFalsy();
    });
  });
});
