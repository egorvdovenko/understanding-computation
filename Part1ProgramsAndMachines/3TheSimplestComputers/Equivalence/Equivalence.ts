import { FARule } from "../DeterministicFiniteAutomata/DeterministicFiniteAutomata";
import { NFARulebook, NFADesign } from "../NondeterministicFiniteAutomata/NondeterministicFiniteAutomata";

function normalizeSet(set: Set<Set<number>>): Set<string> {
  return new Set([...set].map(s => JSON.stringify([...s].sort())));
}

function mergeSetsOfSets(setA: Set<Set<number>>, setB: Set<Set<number>>): Set<Set<number>> {
  const normalizedMerged = 
    normalizeSet(setA).union(normalizeSet(setB));
    
  return new Set([...normalizedMerged].map(s => new Set(JSON.parse(s))));
}

export class NFASimulation {
  constructor(nfaDesign: NFADesign) {
    this.nfaDesign = nfaDesign;
  }

  nfaDesign: NFADesign;

  nextState(state: Set<number>, character: string): Set<number> {
    const nfa = this.nfaDesign.toNFA(state);
    nfa.readCharacter(character);
    return nfa.currentStates;
  }

  rulesFor(state: Set<number>): FARule[] {
    return this.nfaDesign.rulebook.alphabet.map((character: string) =>
      new FARule(state, character, this.nextState(state, character))
    );
  }

  discoverStatesAndRules(states: Set<Set<number>>): [Set<Set<number>>, FARule[]] {
    const rules = Array.from(states).flatMap((state) => this.rulesFor(state));
    const moreStates = new Set(rules.map((rule: FARule) => rule.follow() as Set<number>));

    if (normalizeSet(moreStates).isSubsetOf(normalizeSet(states))) {
      return [states, rules];
    } else {
      return this.discoverStatesAndRules(mergeSetsOfSets(states, moreStates));
    }
  }

  // toDFADesign() {
  //   const startState = this.nfaDesign.toNFA().currentStates;
  //   const [states, rules] = this.discoverStatesAndRules(new Set([startState]));
  //   const acceptStates = Array.from(states).filter(state => this.nfaDesign.toNFA(state).accepting());

  //   return new DFADesign(startState, acceptStates, new DFARulebook(rules));
  // }
}

console.group("* Part 1: Programs and Machines => 3. The Simplest Computers => Equivalence");

const rulebook = new NFARulebook([
  new FARule(1, "a", 1), new FARule(1, "a", 2), new FARule(1, "ε", 2),
  new FARule(2, "b", 3),
  new FARule(3, "b", 1), new FARule(3, "ε", 2),
]);

console.log("Rulebook: ", rulebook.toString());

console.log("----------------------------------------");
const nfaDesign = new NFADesign(1, [3], rulebook);
console.log("Current states: ", nfaDesign.toNFA().currentStates);
console.log("Current states [2]: ", nfaDesign.toNFA(new Set([2])).currentStates);
console.log("Current states [3]: ", nfaDesign.toNFA(new Set([3])).currentStates);
console.log("----------------------------------------");

console.log("----------------------------------------");
const simulation = new NFASimulation(nfaDesign);
console.log("Next state [1, 2], \"a\")", simulation.nextState(new Set([1, 2]), "a"));
console.log("Next state [1, 2], \"b\")", simulation.nextState(new Set([1, 2]), "b"));
console.log("Next state [3, 2], \"b\")", simulation.nextState(new Set([3, 2]), "b"));
console.log("Next state [1, 3, 2], \"a\")", simulation.nextState(new Set([1, 3, 2]), "a"));
console.log("Next state [1, 3, 2], \"b\")", simulation.nextState(new Set([1, 3, 2]), "b"));
console.log("----------------------------------------");

console.log("Rulebook alphabet: ", rulebook.alphabet);

console.log("----------------------------------------");
console.log("Rules for [1, 2]: ", simulation.rulesFor(new Set([1, 2])));
console.log("Rules for [3, 2]: ", simulation.rulesFor(new Set([3, 2])));
console.log("----------------------------------------");

console.log("----------------------------------------");
const startState = nfaDesign.toNFA().currentStates;
console.log("Start state: ", startState);
console.log("Discover states and rules: ", simulation.discoverStatesAndRules(new Set([startState])));
console.log("----------------------------------------");

console.groupEnd();
