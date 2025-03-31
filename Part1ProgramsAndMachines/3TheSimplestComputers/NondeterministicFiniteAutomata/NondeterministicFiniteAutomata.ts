import { FARule } from "../DeterministicFiniteAutomata/DeterministicFiniteAutomata";

function normalizeSet(set: Set<number>[]): Set<string> {
  return new Set(set.map(s => JSON.stringify([...s].sort())));
}

/**
 * Represents a rulebook for a Non-deterministic Finite Automata (NFA).
 *
 * @class NFARulebook
 * @property {FARule[]} rules - An array of FARule objects representing the rules of the NFA.
 * @property {string[]} alphabet - The set of characters that the NFA can process.
 * @method nextStates - Returns the next states for a given set of states and input character.
 * @method followRulesFor - Returns the next states for a given state and input character.
 * @method rulesFor - Returns the rules that apply to a given state and input character.
 * @method followFreeMoves - Returns the set of states reachable from a given set of states via epsilon transitions.
 * 
 */
export class NFARulebook {
  constructor(rules: FARule[]) {
    this.rules = rules;
  }

  rules: FARule[];

  get alphabet(): string[] {
    return Array.from(new Set(
      this.rules.filter((rule: FARule) => rule.character !== "ε").map((rule: FARule) => rule.character)
    ));
  }

  nextStates(states: Set<number>[], character: string): Set<number>[] {
    return states.flatMap((state: Set<number>) => this.followRulesFor(state, character));
  }

  followRulesFor(state: Set<number>, character: string): Set<number>[] {
    return this.rulesFor(state, character).map((rule: FARule) => rule.follow());
  }

  rulesFor(state: Set<number>, character: string): FARule[] {
    return this.rules.filter((rule: FARule) => rule.appliesTo(state, character));
  }

  followFreeMoves(states: Set<number>[]): Set<number>[] {
    const moreStates = this.nextStates(states, "ε");

    if (normalizeSet(moreStates).isSubsetOf(normalizeSet(states))) {
      return states;
    } else {
      return this.followFreeMoves([...states, ...moreStates]);
    }
  }

  toString(): string {
    return this.rules.map((rule: FARule) => rule.toString()).join("\n");
  }
}

/**
 * Represents a Non-deterministic Finite Automata (NFA).
 * 
 * @class NFA
 * @property {Set<number>[]} currentStates - The current states of the NFA.
 * @property {Set<number>[]} acceptStates - The accepting states of the NFA.
 * @property {NFARulebook} rulebook - The rulebook for the NFA.
 * @method accepting - Checks if the NFA is in an accepting state.
 * @method readCharacter - Reads a character and transitions to the next state.
 * @method readString - Reads a string and transitions through the states.
 * 
 */
export class NFA {
  constructor(currentStates: Set<number>[], acceptStates: Set<number>[], rulebook: NFARulebook) {
    this._currentStates = currentStates;

    this.acceptStates = acceptStates;
    this.rulebook = rulebook;
  }

  _currentStates: Set<number>[];
  
  set currentStates(value: Set<number>[]) {
    this._currentStates = value;
  }
  get currentStates(): Set<number>[] {
    return this.rulebook.followFreeMoves(this._currentStates);
  }

  acceptStates: Set<number>[];
  rulebook: NFARulebook;

  accepting(): boolean {
    return this.currentStates.some((currentState: Set<number>) => 
      this.acceptStates.some((acceptState: Set<number>) => currentState.isSubsetOf(acceptState))
    );
  }

  readCharacter(character: string) {
    this.currentStates = this.rulebook.nextStates(this.currentStates, character);
  }

  readString(string: string) {
    for (const character of string) {
      this.readCharacter(character);
    }
  }
}

/**
 * Represents a Non-deterministic Finite Automata (NFA) design.
 * 
 * @class NFADesign
 * @property {Set<number>} startState - The starting state of the NFA.
 * @property {Set<number>[]} acceptStates - The accepting states of the NFA.
 * @property {NFARulebook} rulebook - The rulebook for the NFA.
 * @method accepts - Checks if the NFA accepts a given string.
 * @method toNFA - Converts the NFADesign to an NFA instance.
 * 
 */
export class NFADesign {
  constructor(startState: Set<number>, acceptStates: Set<number>[], rulebook: NFARulebook) {
    this.startState = startState;
    this.acceptStates = acceptStates;
    this.rulebook = rulebook;
  }

  startState: Set<number>;
  acceptStates: Set<number>[];
  rulebook: NFARulebook;

  accepts(string: string): boolean {
    const nfa = this.toNFA();
    nfa.readString(string);
    return nfa.accepting();
  }

  toNFA(currentStates = [this.startState]): NFA {
    return new NFA(currentStates, this.acceptStates, this.rulebook);
  }
}

console.group("* Part 1: Programs and Machines => 3. The Simplest Computers => Nondeterministic Finite Automata");

const rulebook = new NFARulebook([
  new FARule(new Set([1]), "ε", new Set([2])),
  new FARule(new Set([1]), "ε", new Set([4])),
  new FARule(new Set([2]), "a", new Set([3])),
  new FARule(new Set([3]), "a", new Set([2])),
  new FARule(new Set([4]), "a", new Set([5])),
  new FARule(new Set([5]), "a", new Set([6])),
  new FARule(new Set([6]), "a", new Set([4])),
]);

console.log("Rulebook: ", rulebook.toString());

const nfaDesign = new NFADesign(new Set([1]), [new Set([2]), new Set([4])], rulebook);

console.log("Input: a");
console.log("Accepting: ", nfaDesign.accepts("a"));
console.log("Input: aa");
console.log("Accepting: ", nfaDesign.accepts("aa"));
console.log("Input: aaa");
console.log("Accepting: ", nfaDesign.accepts("aaa"));
console.log("Input: aaaa");
console.log("Accepting: ", nfaDesign.accepts("aaaa"));
console.log("Input: aaaaa");
console.log("Accepting: ", nfaDesign.accepts("aaaaa"));
console.log("Input: aaaaaa");
console.log("Accepting: ", nfaDesign.accepts("aaaaaa"));

console.groupEnd();