import { FARule } from "../DeterministicFiniteAutomata/DeterministicFiniteAutomata";
import {
  NFARulebook,
  NFA,
  NFADesign
} from "./NondeterministicFiniteAutomata";

describe("NondeterministicFiniteAutomata", () => {
  const states = [new Set([0]), new Set([1]), new Set([2]), new Set([3]), new Set([4])];

  const rulebook = new NFARulebook([
    new FARule(states[0], "a", states[1]),
    new FARule(states[1], "b", states[1]),
    new FARule(states[1], "b", states[2]),
    new FARule(states[2], "a", states[3]),
    new FARule(states[3], "b", states[4])
  ]);

  describe("FARule", () => {
    it("should apply to the given state and character", () => {
      const rule = new FARule(states[0], "a", states[1]);
      expect(rule.appliesTo(states[0], "a")).toBeTruthy();
      expect(rule.appliesTo(states[2], "b")).toBeFalsy();
    });

    it("should follow to the next state", () => {
      const rule = new FARule(states[0], "a", states[1]);
      expect(rule.follow()).toBe(states[1]);
    });

    it("should return a string representation of the rule", () => {
      const rule = new FARule(states[0], "a", states[1]);
      expect(rule.toString()).toBe("{0} -> a -> {1}");
    });
  });

  describe("NFARulebook", () => {
    it("should return the next states", () => {
      expect(rulebook.nextStates([states[0]], "a")).toEqual([states[1]]);
      expect(rulebook.nextStates([states[1]], "b")).toEqual([states[1], states[2]]);
      expect(rulebook.nextStates([states[1], states[2]], "a")).toEqual([states[3]]);
    });

    it("should return the following rules for the given state and character", () => {
      expect(rulebook.followRulesFor(states[1], "b")).toEqual([states[1], states[2]]);
    });

    it("should return the rules for the given state and character", () => {
      expect(rulebook.rulesFor(states[1], "b")).toEqual([rulebook.rules[1], rulebook.rules[2]]);
    });
  });

  describe("NFA", () => {
    it("should accept the string", () => {
      const nfa = new NFA([states[0]], [states[4]], rulebook);
      nfa.readCharacter("a");
      nfa.readCharacter("b");
      nfa.readCharacter("b");
      nfa.readCharacter("a");
      nfa.readCharacter("b");
      expect(nfa.accepting()).toBeTruthy();
    });

    it("should accept the string", () => {
      const nfa = new NFA([states[0]], [states[4]], rulebook);
      nfa.readString("abab");
      expect(nfa.accepting()).toBeTruthy();
    });
  });

  describe("NFADesign", () => {
    it("should accept the string", () => {
      const nfaDesign = new NFADesign(states[0], [states[4]], rulebook);
      expect(nfaDesign.accepts("abab")).toBeTruthy();
    });
  });
});
