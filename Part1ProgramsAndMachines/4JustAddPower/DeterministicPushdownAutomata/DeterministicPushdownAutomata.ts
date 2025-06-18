/**
 * Represents a stack data structure.
 * 
 * @class Stack
 * @template T - The type of elements in the stack.
 * @property {T[]} contents - The contents of the stack.
 * @method push - Adds an item to the top of the stack and returns a new stack.
 * @method pop - Removes the top item from the stack and returns a new stack.
 * @method top - Returns the top item of the stack without removing it.
 * 
 */
export class Stack<T> {
  private contents: T[];

  constructor(contents: T[] = []) {
    this.contents = contents;
  }

  push(item: T): Stack<T> {
    return new Stack([item, ...this.contents]);
  }

  pop(): Stack<T> {
    return new Stack(this.contents.slice(1));
  }

  top(): T | undefined {
    return this.contents[0];
  }

  toString(): string {
    const [top, ...rest] = this.contents;
    return `[${top}]${rest.join("")}`;
  }
}

/**
 * Represents a configuration of a Pushdown Automaton (PDA).
 * 
 * @class PDAConfiguration
 * @template T - The type of elements in the stack.
 * @property {number} state - The current state of the PDA.
 * @property {Stack<T>} stack - The stack of the PDA.
 * 
 */
export class PDAConfiguration<T> {
  STUCK_STATE = -1; // Represents a stuck state where no rules apply

  constructor(
    public state: number,
    public stack: Stack<T>,
  ) {}

  stuck(): PDAConfiguration<T> {
    return new PDAConfiguration(this.STUCK_STATE, this.stack);
  }

  isStuck(): boolean {
    return this.state === this.STUCK_STATE;
  }

  toString(): string {
    return `${this.state}:${this.stack.toString()}`;
  }
}

/**
 * Represents a rule for a Pushdown Automaton (PDA).
 * 
 * @class PDARule
 * @template T - The type of elements in the stack.
 * @property {number} state - The current state of the PDA.
 * @property {string} character - The input character that triggers the rule.
 * @property {string} nextState - The next state of the PDA after applying the rule.
 * @property {T} popCharacter - The character to pop from the stack.
 * @property {T[]} pushCharacters - The characters to push onto the stack.
 * @method appliesTo - Checks if the rule applies to a given PDA configuration and input character.
 * @method follow - Returns the next PDA configuration after applying the rule.
 * @method nextStack - Returns the new stack after applying the rule.
 * 
 */
export class PDARule<T> {
  constructor(
    public state: number,
    public character: T,
    public nextState: number,
    public popCharacter: T,
    public pushCharacters: T[],
  ) {}

  appliesTo(configuration: PDAConfiguration<T>, character: T | "ε"): boolean {
    return (
      configuration.state === this.state &&
      character === this.character &&
      configuration.stack.top() === this.popCharacter
    );
  }

  follow(configuration: PDAConfiguration<T>): PDAConfiguration<T> {
    return new PDAConfiguration(
      this.nextState,
      this.nextStack(configuration)
    );
  }

  nextStack(configuration: PDAConfiguration<T>): Stack<T> {
    const poppedStack = configuration.stack.pop();
    return this.pushCharacters.slice().reverse().reduce(
      (stack, character) => stack.push(character), poppedStack
    );
  }

  toString(): string {
    return `${this.state} --${this.character};${this.popCharacter}/${this.pushCharacters.join("")}-> ${this.nextState}`;
  }
}

/**
 * Represents a rulebook for a Pushdown Automaton (PDA).
 * 
 * @class DPDARulebook
 * @template T - The type of elements in the stack.
 * @property {PDARule<T>[]} rules - The list of rules in the rulebook.
 * @method nextConfiguration - Returns the next PDA configuration based on the current configuration and input character.
 * @method ruleFor - Finds the applicable rule for a given configuration and input character.
 * @method appliesTo - Checks if there is an applicable rule for a given configuration and input character.
 * @method followFreeMoves - Follows free moves (ε-transitions) until no more can be applied, returning the final configuration.
 * 
 */
export class DPDARulebook<T> {
  private rules: PDARule<T>[];

  constructor(rules: PDARule<T>[]) {
    this.rules = rules;
  }

  nextConfiguration(configuration: PDAConfiguration<T>, character: T | "ε"): PDAConfiguration<T> {
    const rule = this.ruleFor(configuration, character);
    if (!rule) {
      return configuration.stuck();
    }
    return rule.follow(configuration);
  }

  ruleFor(configuration: PDAConfiguration<T>, character: T | "ε"): PDARule<T> | undefined {
    return this.rules.find(rule => rule.appliesTo(configuration, character));
  }

  appliesTo(configuration: PDAConfiguration<T>, character: T | "ε"): boolean {
    return this.ruleFor(configuration, character) !== undefined;
  }

  followFreeMoves(configuration: PDAConfiguration<T>): PDAConfiguration<T> {
    if (this.appliesTo(configuration, "ε")) {
      return this.followFreeMoves(this.nextConfiguration(configuration, "ε"));
    } else {
      return configuration;
    }
  }

  toString(): string {
    return this.rules.map(rule => rule.toString()).join("\n");
  }
}

/**
 * Represents a Deterministic Pushdown Automaton (DPDA).
 * 
 * @class DPDA
 * @template T - The type of elements in the stack.
 * @property {PDAConfiguration<T>} currentConfiguration - The current configuration of the DPDA.
 * @property {number[]} acceptStates - The list of accepting states.
 * @property {DPDARulebook<T>} rulebook - The rulebook that defines the DPDA's behavior.
 * @method accepting - Checks if the current configuration is in an accepting state.
 * @method readCharacter - Reads a single character and updates the current configuration.
 * @method readString - Reads a string of characters and updates the current configuration.
 * 
 */
export class DPDA<T> {
  private _currentConfiguration: PDAConfiguration<T>;
  get currentConfiguration(): PDAConfiguration<T> {
    return this.rulebook.followFreeMoves(this._currentConfiguration);
  }
  set currentConfiguration(configuration: PDAConfiguration<T>) {
    this._currentConfiguration = configuration;
  }

  constructor(
    currentConfiguration: PDAConfiguration<T>,
    public acceptStates: number[], 
    public rulebook: DPDARulebook<T>
  ) {
    this._currentConfiguration = currentConfiguration;
  }

  accepting(): boolean {
    return this.acceptStates.includes(this.currentConfiguration.state);
  }

  nextConfiguration(character: T | "ε"): PDAConfiguration<T> {
    if (this.rulebook.appliesTo(this.currentConfiguration, character)) {
      return this.rulebook.nextConfiguration(this.currentConfiguration, character);
    } else {
      return this.currentConfiguration.stuck();
    }
  }

  readCharacter(character: T): void {
    this.currentConfiguration = this.nextConfiguration(character);
  }

  readString(characters: T[]): void {
    for (const character of characters) {
      this.readCharacter(character);
      if (this.currentConfiguration.isStuck()) {
        break;
      }
    }
  }
}

/**
 * Represents a Deterministic Pushdown Automaton Design (DPDADesign).
 * 
 * @class DPDADesign
 * @template T - The type of elements in the stack.
 * @property {number} startState - The initial state of the DPDA.
 * @property {T} bottomCharacter - The character that represents the bottom of the stack.
 * @property {number[]} acceptStates - The list of accepting states.
 * @property {DPDARulebook<T>} rulebook - The rulebook that defines the DPDA's behavior.
 * @method accepts - Checks if the DPDA accepts a given string of characters.
 * @method toDPDA - Converts the design to a DPDA instance.
 */
export class DPDADesign<T> {
  constructor(
    public startState: number,
    public bottomCharacter: T,
    public acceptStates: number[],
    public rulebook: DPDARulebook<T>
  ) {}

  accepts(characters: T[]): boolean {
    const dpda = this.toDPDA();
    dpda.readString(characters);
    return dpda.accepting();
  }

  toDPDA(): DPDA<T> {
    const startStack = new Stack([this.bottomCharacter]);
    const startConfiguration = new PDAConfiguration(this.startState, startStack);
    return new DPDA(startConfiguration, this.acceptStates, this.rulebook);
  }
}

console.group("* Part 1: Programs and Machines => 4. Just Add Power => Deterministic Pushdown Automata");

console.log("----------------------------------------");
const stack = new Stack(["a", "b", "c", "d", "e"]);
console.log(stack.top()); // "a"
console.log(stack.pop().pop().top()); // "c"
console.log(stack.push("x").push("y").top()); // "y"
console.log(stack.push("x").push("y").pop().top()); // "x"
console.log("----------------------------------------");

console.log("----------------------------------------");
const rule = new PDARule(1, "(", 2, "$", ["b", "$"]);
console.log(rule.toString()); // "1 --(;$/b$-> 2"
console.log("----------------------------------------");

console.log("----------------------------------------");
let configuration = new PDAConfiguration(1, new Stack(["$"]));
console.log(configuration.toString()); // "1:[$]"

console.log(rule.appliesTo(configuration, "(")); // true
console.log(rule.follow(configuration).toString()); // "2:[b]$"
console.log("----------------------------------------");

console.log("----------------------------------------");
const rulebook = new DPDARulebook([
  new PDARule(1, "(", 2, "$", ["b", "$"]),
  new PDARule(2, "(", 2, "b", ["b", "b"]),
  new PDARule(2, ")", 2, "b", []),
  new PDARule(2, "ε", 1, "$", ["$"]),
]);

configuration = rulebook.nextConfiguration(configuration, "(");
console.log(configuration.toString()); // "2:[b]$"
configuration = rulebook.nextConfiguration(configuration, "(");
console.log(configuration.toString()); // "2:[b]b$"
configuration = rulebook.nextConfiguration(configuration, ")");
console.log(configuration.toString()); // "2:[b]$"
console.log("----------------------------------------");

console.log("----------------------------------------");
let dpda = new DPDA(new PDAConfiguration(1, new Stack(["$"])), [1], rulebook);
console.log(dpda.accepting()); // true
dpda.readString(["(", "(", ")"]);
console.log(dpda.accepting()); // false
console.log(dpda.currentConfiguration.toString()); // "2:[b]$"
console.log("----------------------------------------");

console.log("----------------------------------------");
configuration = new PDAConfiguration(2, new Stack(["$"]));
console.log(configuration.toString()); // "2:[$]"
configuration = rulebook.followFreeMoves(configuration);
console.log(configuration.toString()); // "1:[$]"
console.log("----------------------------------------");

console.log("----------------------------------------");
dpda = new DPDA(new PDAConfiguration(1, new Stack(["$"])), [1], rulebook);
dpda.readString(["(", "(", ")", "("]);
console.log(dpda.accepting()); // false
console.log(dpda.currentConfiguration.toString()); // "2:[b]b$"
dpda.readString([")", ")", "(", ")"]);
console.log(dpda.accepting()); // true
console.log(dpda.currentConfiguration.toString()); // "1:[$]"
console.log("----------------------------------------");

console.log("----------------------------------------");
const dpdaDesign = new DPDADesign(1, "$", [1], rulebook);
console.log(dpdaDesign.accepts(["(", "(", ")", "(", ")", ")", "(", ")"])); // true
console.log(dpdaDesign.accepts(["(", "(", ")", "(", ")", "(", ")", ")"])); // true
console.log(dpdaDesign.accepts(["(", "(", "(", ")", ")", "(", ")"])); // false
console.log(dpdaDesign.accepts(["(", ")", ")"]));
console.log("----------------------------------------");

console.groupEnd();
