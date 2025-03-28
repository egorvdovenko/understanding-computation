/**
 * Represents a rule in the Finite Automata (FA) system.
 *
 * @class FARule
 * @property {string} state - The current state of the FA.
 * @property {string} character - The input symbol to transition on.
 * @property {string} nextState - The next state after transitioning.
 * @method appliesTo - Checks if a given state and character match this rule's criteria.
 * @method follow - Returns the next state after applying this rule.
 * @method toString - Returns a string representation of the rule.
 * 
 * @example
 * const rule = new FARule(0, 'a', 1);
 * console.log(rule.appliesTo(0, 'a')); // true
 * console.log(rule.follow()); // 1
 * console.log(rule.toString()); // '0 -> a -> 1'
 */
export class FARule {
  constructor(state: number, character: string, nextState: number) {
    this.state = state;
    this.character = character;
    this.nextState = nextState;
  }

  state: number;
  character: string;
  nextState: number;

  appliesTo(state: number, character: string): boolean {
    return this.state === state && this.character === character;
  }

  follow(): number {
    return this.nextState;
  }

  toString(): string {
    return `${this.state} -> ${this.character} -> ${this.nextState}`;
  }
}

/**
 * Represents a rulebook for a Non-deterministic Finite Automata (NFA).
 * 
 * @class NFARulebook
 * @property {FARule[]} rules - An array of FARule objects representing the rules of the NFA.
 * @method nextStates - Returns the next states for a given set of states and input character.
 * @method followRulesFor - Returns the next states for a given state and input character.
 * @method rulesFor - Returns the rules that apply to a given state and input character.
 * @method followFreeMoves - Returns the set of states reachable from a given set of states via epsilon transitions.
 * 
 * @example
 * const rulebook = new NFARulebook([
 *   new FARule(1, 'a', 2),
 *   new FARule(1, 'b', 3),
 *   new FARule(2, 'a', 4),
 *   new FARule(3, 'b', 5)
 * ]);
 * const nextStates = rulebook.nextStates(new Set([1]), 'a');
 * console.log(nextStates); // Set { 2 }
 * const rules = rulebook.rulesFor(1, 'a');
 * console.log(rules); // [ FARule { state: 1, character: 'a', nextState: 2 } ]
 * const follow = rulebook.followRulesFor(1, 'a');
 * console.log(follow); // [ 2 ]
 */
export class NFARulebook {
  constructor(rules: FARule[]) {
    this.rules = rules;
  }

  rules: FARule[];

  nextStates(states: Set<number>, character: string): Set<number> {
    const result = new Set(Array.from(states).flatMap((state: number) => this.followRulesFor(state, character)));
    console.log("nextStates: ", result);
    return result;
  }

  followRulesFor(state: number, character: string): number[] {
    const result = this.rulesFor(state, character).map((rule: FARule) => rule.follow());
    return result;
  }

  rulesFor(state: number, character: string): FARule[] {
    const result = this.rules.filter((rule: FARule) => rule.appliesTo(state, character));
    return result;
  }

  followFreeMoves(states: Set<number>): Set<number> {
    const moreStates = this.nextStates(states, "ε");

    if (Array.from(moreStates).every((state: number) => Array.from(states).includes(state))) {
      return states;
    } else {
      return this.followFreeMoves(new Set([...states, ...moreStates]));
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
 * @property {Set<number>} currentStates - The current states of the NFA.
 * @property {number[]} acceptStates - The accepting states of the NFA.
 * @property {NFARulebook} rulebook - The rulebook for the NFA.
 * @method accepting - Checks if the NFA is in an accepting state.
 * @method readCharacter - Reads a character and transitions to the next state.
 * @method readString - Reads a string and transitions through the states.
 * 
 * @example
 * const nfa = new NFA(new Set([1]), [4], rulebook);
 * nfa.readCharacter('a');
 * console.log(nfa.accepting()); // false
 */
export class NFA {
  constructor(currentStates: Set<number>, acceptStates: number[], rulebook: NFARulebook) {
    this._currentStates = currentStates;

    this.acceptStates = acceptStates;
    this.rulebook = rulebook;
  }

  _currentStates: Set<number>;

  set currentStates(value: Set<number>) {
    this._currentStates = value;
  }

  get currentStates(): Set<number> {
    return this.rulebook.followFreeMoves(this._currentStates);
  }

  acceptStates: number[];
  rulebook: NFARulebook;

  accepting(): boolean {
    return Array.from(this.currentStates).some((state: number) => this.acceptStates.includes(state));
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
 * @property {number} startState - The starting state of the NFA.
 * @property {number[]} acceptStates - The accepting states of the NFA.
 * @property {NFARulebook} rulebook - The rulebook for the NFA.
 * @method accepts - Checks if the NFA accepts a given string.
 * @method toNFA - Converts the NFADesign to an NFA instance.
 * 
 * @example
 * const nfaDesign = new NFADesign(1, [4], rulebook);
 * console.log(nfaDesign.accepts('a')); // false
 */
export class NFADesign {
  constructor(startState: number, acceptStates: number[], rulebook: NFARulebook) {
    this.startState = startState;
    this.acceptStates = acceptStates;
    this.rulebook = rulebook;
  }

  startState: number;
  acceptStates: number[];
  rulebook: NFARulebook;

  accepts(string: string): boolean {
    const nfa = this.toNFA();
    nfa.readString(string);
    return nfa.accepting();
  }

  toNFA(): NFA {
    return new NFA(new Set([this.startState]), this.acceptStates, this.rulebook);
  }
}

console.group("Part 1: Programs and Machines => 3. The Simplest Computers => Nondeterministic Finite Automata");

const rulebook = new NFARulebook([
  new FARule(1, "a", 1), new FARule(1, "b", 1), new FARule(1, "b", 2),
  new FARule(2, "a", 3), new FARule(2, "b", 3),
  new FARule(3, "a", 4), new FARule(3, "b", 4)
]);

console.log("Rulebook: ", rulebook.toString());

console.log("----------------------------------------");
const nfa = new NFA(new Set([1]), [4], rulebook);
console.log("Input: b");
nfa.readCharacter("b");
console.log("Accepting: ", nfa.accepting());
console.log("Input: a");
nfa.readCharacter("a");
console.log("Accepting: ", nfa.accepting());
console.log("Input: b");
nfa.readCharacter("b");
console.log("Accepting: ", nfa.accepting());
console.log("----------------------------------------");

console.log("----------------------------------------");
const nfa2 = new NFA(new Set([1]), [4], rulebook);
console.log("Input: bbbbb");
nfa2.readString("bbbbb");
console.log("Accepting: ", nfa2.accepting());
console.log("----------------------------------------");

console.log("----------------------------------------");
const nfaDesign = new NFADesign(1, [4], rulebook);
console.log("Input: bbbbb");
console.log("Accepting: ", nfaDesign.accepts("bbbbb"));
console.log("Input: babb");
console.log("Accepting: ", nfaDesign.accepts("babb"));
console.log("----------------------------------------");

const rulebook2 = new NFARulebook([
  new FARule(1, "ε", 2), new FARule(1, "ε", 4),
  new FARule(2, "a", 3),
  new FARule(3, "a", 2),
  new FARule(4, "a", 5),
  new FARule(5, "a", 6),
  new FARule(6, "a", 4),
]);

console.log("Rulebook: ", rulebook2.toString());

console.log("----------------------------------------");
const nfaDesign2 = new NFADesign(1, [2, 4], rulebook2);
console.log("Input: aa");
console.log("Accepting: ", nfaDesign2.accepts("aa"));
console.log("Input: aaa");
console.log("Accepting: ", nfaDesign2.accepts("aaa"));
console.log("Input: aaaaa");
console.log("Accepting: ", nfaDesign2.accepts("aaaaa"));
console.log("----------------------------------------");

console.groupEnd();