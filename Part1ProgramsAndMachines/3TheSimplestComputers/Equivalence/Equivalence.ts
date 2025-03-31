import { FARule } from "../DeterministicFiniteAutomata/DeterministicFiniteAutomata";
import { NFARulebook, NFADesign } from "../NondeterministicFiniteAutomata/NondeterministicFiniteAutomata";
import NormalizedSet from "../NormalizedSet";

/**
 * Represents a Non-deterministic Finite Automata (NFA) simulation.
 * 
 * @class NFASimulation
 * @property {NFADesign} nfaDesign - The design of the NFA.
 * @method nextState - Returns the next state after applying a character to a given state.
 * @method rulesFor - Returns the rules for a given state.
 * @method discoverStatesAndRules - Discovers states and rules for the NFA.
 * @method toDFADesign - Converts the NFA to a DFA design.
 * 
 */
export class NFASimulation {
  constructor(nfaDesign: NFADesign) {
    this.nfaDesign = nfaDesign;
  }

  nfaDesign: NFADesign;

  nextState(state: Set<number>, character: string): Set<number> {
    const nfa = this.nfaDesign.toNFA(state);

    nfa.readCharacter(character);
    return Array.from(nfa.currentStates).reduce((acc: Set<number>, currentState: number) => 
      acc.add(currentState), new Set<number>()
    );
  }

  rulesFor(state: Set<number>): FARule[] {
    return this.nfaDesign.rulebook.alphabet.map((character: string) =>
      new FARule(state, character, this.nextState(state, character))
    );
  }

  discoverStatesAndRules(states: Set<Set<number>>): [Set<Set<number>>, FARule[]] {
    const rules = Array.from(states).flatMap((state: Set<number>) => this.rulesFor(state));
    const moreStates = rules.reduce((acc: Set<Set<number>>, rule: FARule) => 
      acc.add(rule.follow()), new Set<Set<number>>()
    );

    if (new NormalizedSet(moreStates).isSubsetOf(states)) {
      return [states, rules];
    } else {
      return this.discoverStatesAndRules(new NormalizedSet(states).union(moreStates));
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
  new FARule(new Set([1]), "a", new Set([1])), 
  new FARule(new Set([1]), "a", new Set([2])), 
  new FARule(new Set([1]), "ε", new Set([2])),
  new FARule(new Set([2]), "b", new Set([3])),
  new FARule(new Set([3]), "b", new Set([1])), 
  new FARule(new Set([3]), "ε", new Set([2])),
]);

console.log("Rulebook: ", rulebook.toString());

console.log("----------------------------------------");
const nfaDesign = new NFADesign(new Set([1]), new Set([3]), rulebook);
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
console.log("Accept [1, 2]: ", nfaDesign.toNFA(new Set([1, 2])).accepting());
console.log("Accept [2, 3]: ", nfaDesign.toNFA(new Set([2, 3])).accepting());
console.log("----------------------------------------");

// console.log("----------------------------------------");
// const dfaDesign = simulation.toDFADesign();
// console.log("DFA accept \"aaa\": ", dfaDesign.accepts("aaa"));
// console.log("DFA accept \"aab\": ", dfaDesign.accepts("aab"));
// console.log("DFA accept \"bbbabb\": ", dfaDesign.accepts("bbbabb"));
// console.log("----------------------------------------");

console.groupEnd();
