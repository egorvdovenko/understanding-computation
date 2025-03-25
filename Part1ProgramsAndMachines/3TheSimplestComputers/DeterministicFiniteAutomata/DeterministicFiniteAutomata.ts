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

  follow() {
    return this.nextState;
  }

  toString() {
    return `${this.state} -> ${this.character} -> ${this.nextState}`;
  }
}

/**
 * Represents a deterministic finite automaton (DFA).
 *
 * @class DFARulebook
 * @property {FARule[]} rules - An array of rules that define the DFA's behavior.
 * @method nextState - Returns the next state after applying a rule to a given state and character.
 * @method ruleFor - Finds the rule for a specific state and character.
 * 
 * @example
 * const rule1 = new FARule(0, 'a', 1);
 * const rule2 = new FARule(1, 'b', 2);
 * const rulebook = new DFARulebook([rule1, rule2]);
 * console.log(rulebook.nextState(0, 'a')); // 1
 * console.log(rulebook.ruleFor(0, 'a').toString()); // '0 -> a -> 1'
 */
export class DFARulebook {
  constructor(rules: FARule[]) {
    this.rules = rules;
  }

  rules: FARule[];

  nextState(state: number, character: string): number {
    return this.ruleFor(state, character).follow();
  }

  ruleFor(state: number, character: string): FARule {
    return this.rules.find((rule) => rule.appliesTo(state, character))!;
  }
}

/**
 * Represents a deterministic finite automaton (DFA).
 * 
 * @class DFA
 * @property {number} currentState - The current state of the DFA.
 * @property {number[]} acceptStates - An array of states that are accepting states.
 * @property {DFARulebook} rulebook - The DFA's rulebook.
 * @method accepting - Checks if the DFA is in an accepting state.
 * @method readCharacter - Transitions the DFA to the next state based on the given character.
 * @method readString - Transitions the DFA to the next state based on the given string.
 * 
 * @example
 * const rule1 = new FARule(0, 'a', 1);
 * const rule2 = new FARule(1, 'b', 2);
 * const rulebook = new DFARulebook([rule1, rule2]);
 * const dfa = new DFA(0, [1], rulebook);
 */
export class DFA {
  constructor(currentState: number, acceptStates: number[], rulebook: DFARulebook) {
    this.currentState = currentState;
    this.acceptStates = acceptStates;
    this.rulebook = rulebook;
  }

  currentState: number;
  acceptStates: number[];
  rulebook: DFARulebook;

  accepting() {
    return this.acceptStates.includes(this.currentState);
  }

  readCharacter(character: string) {
    this.currentState = this.rulebook.nextState(this.currentState, character);
  }

  readString(input: string) {
    for (const character of input) {
      this.readCharacter(character);
    }
  }
}

/**
 * Represents a DFA design.
 * 
 * @class DFADesign
 * @property {number} startState - The start state of the DFA.
 * @property {number[]} acceptStates - An array of states that are accepting states.
 * @property {DFARulebook} rulebook - The DFA's rulebook.
 * @method toDFA - Converts the DFA design to a DFA.
 * @method accepts - Checks if the DFA design accepts a given input string.
 * 
 * @example
 * const rule1 = new FARule(0, 'a', 1);
 * const rule2 = new FARule(0, 'b', 0);
 * const rule3 = new FARule(1, 'b', 2);
 * const rulebook = new DFARulebook([rule1, rule2, rule3]);
 * const dfaDesign = new DFADesign(0, [2], rulebook);
 * console.log(dfaDesign.accepts('ab')); // true
 * console.log(dfaDesign.accepts('ba')); // false
 */
export class DFADesign {
  constructor(startState: number, acceptStates: number[], rulebook: DFARulebook) {
    this.startState = startState;
    this.acceptStates = acceptStates;
    this.rulebook = rulebook;
  }

  startState: number;
  acceptStates: number[];
  rulebook: DFARulebook;

  toDFA() {
    return new DFA(this.startState, this.acceptStates, this.rulebook);
  }

  accepts(input: string) {
    const dfa = this.toDFA();
    dfa.readString(input);
    return dfa.accepting();
  }    
}

console.group("Part 1: Programs and Machines => 3. The Simplest Computers => Deterministic Finite Automata");

const rule1 = new FARule(0, "a", 1);
const rule2 = new FARule(0, "b", 0);
const rule3 = new FARule(1, "b", 2);

console.log("rule1: ", rule1.toString());
console.log("rule2: ", rule2.toString());
console.log("rule3: ", rule3.toString());

const rulebook = new DFARulebook([rule1, rule2, rule3]);
const dfaDesign = new DFADesign(0, [2], rulebook);

console.log("ab: ", dfaDesign.accepts("ab"));
console.log("ba: ", dfaDesign.accepts("ba"));

console.groupEnd();