/**
 * Represents a rule in the Finite Automata (FA) system.
 * 
 * @class FARule
 * @property {Set<number>} state - The state of the rule.
 * @property {string} character - The character of the rule.
 * @property {Set<number>} nextState - The next state of the rule.
 * @method appliesTo - Checks if the rule applies to a given state and character.
 * @method follow - Returns the next state of the rule.
 * @method toString - Returns a string representation of the rule.
 * 
 */
export class FARule {
  constructor(state: Set<number>, character: string, nextState: Set<number>) {
    this.state = state;
    this.character = character;
    this.nextState = nextState;
  }

  state: Set<number>;
  character: string;
  nextState: Set<number>;

  appliesTo(state: Set<number>, character: string): boolean {
    return character === this.character && state.isSubsetOf(this.state);
  }

  follow(): Set<number> {
    return this.nextState;
  }

  toString(): string {
    return `{${Array.from(this.state).join(",")}} -> ${this.character} -> {${Array.from(this.nextState).join(",")}}`;
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
 */
export class DFARulebook {
  constructor(rules: FARule[]) {
    this.rules = rules;
  }

  rules: FARule[];

  nextState(state: Set<number>, character: string): Set<number> {
    return this.ruleFor(state, character).follow();
  }

  ruleFor(state: Set<number>, character: string): FARule {
    const rules = this.rules.find((rule) => rule.appliesTo(state, character));

    if (!rules) {
      throw new Error(`No rule found for state ${Array.from(state).join(",")} and character ${character}`);
    }
    
    return rules;
  }

  toString(): string {
    return this.rules.map((rule) => rule.toString()).join("\n");
  }
}

/**
 * Represents a deterministic finite automaton (DFA).
 * 
 * @class DFA
 * @property {Set<number>} currentState - The current state of the DFA.
 * @property {Set<number>} acceptStates - The DFA's accepting states.
 * @property {DFARulebook} rulebook - The DFA's rulebook.
 * @method accepting - Checks if the DFA is in an accepting state.
 * @method readCharacter - Transitions the DFA to the next state based on the given character.
 * @method readString - Transitions the DFA to the next state based on the given string.
 * 
 */
export class DFA {
  constructor(currentState: Set<number>, acceptStates: Set<number>, rulebook: DFARulebook) {
    this.currentState = currentState;
    this.acceptStates = acceptStates;
    this.rulebook = rulebook;
  }

  currentState: Set<number>;
  acceptStates: Set<number>;
  rulebook: DFARulebook;

  accepting(): boolean {
    return this.currentState.isSubsetOf(this.acceptStates);
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
 * @property {Set<number>} startState - The DFA's starting state.
 * @property {Set<number>} acceptStates - The DFA's accepting states.
 * @property {DFARulebook} rulebook - The DFA's rulebook.
 * @method toDFA - Converts the DFA design to a DFA.
 * @method accepts - Checks if the DFA design accepts a given input string.
 * 
 */
export class DFADesign {
  constructor(startState: Set<number>, acceptStates: Set<number>, rulebook: DFARulebook) {
    this.startState = startState;
    this.acceptStates = acceptStates;
    this.rulebook = rulebook;
  }

  startState: Set<number>;
  acceptStates: Set<number>;
  rulebook: DFARulebook;

  toDFA(): DFA {
    return new DFA(this.startState, this.acceptStates, this.rulebook);
  }

  accepts(input: string): boolean {
    const dfa = this.toDFA();
    dfa.readString(input);
    return dfa.accepting();
  }    
}

console.group("* Part 1: Programs and Machines => 3. The Simplest Computers => Deterministic Finite Automata");

const rulebook = new DFARulebook([
  new FARule(new Set([0]), "a", new Set([1])),
  new FARule(new Set([0]), "b", new Set([0])),
  new FARule(new Set([1]), "b", new Set([2]))
]);

console.log("Rulebook: ", rulebook.toString());

const dfaDesign = new DFADesign(new Set([0]), new Set([2]), rulebook);

console.log("Input: ab");
console.log("Accepts: ", dfaDesign.accepts("ab"));
console.log("Input: ba");
console.log("Accepts: ", dfaDesign.accepts("ba"));

console.groupEnd();