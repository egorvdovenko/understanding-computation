import { FARule } from "../DeterministicFiniteAutomata/DeterministicFiniteAutomata";
import { NFARulebook, NFADesign } from "../NondeterministicFiniteAutomata/NondeterministicFiniteAutomata";

function* statesGenerator(): Generator<Set<number>, Set<number>, Set<number>> {
  let state = 0;

  while (true) {
    yield new Set([state++]);
  }
}

const states = statesGenerator();

/**
 * Represents a pattern in a regular expression.
 * 
 * @abstract
 * @class Pattern
 * @property {number} precedence - The precedence of the pattern.
 * @method bracket - Wraps the pattern in parentheses if its precedence is lower than the given precedence.
 * @method toNFADesign - Converts the pattern to a Non-deterministic Finite Automata (NFA) design.
 * @method matches - Checks if the pattern matches a given string.
 * @method inspect - Returns a string representation of the pattern.
 * 
 */
abstract class Pattern {
  abstract get precedence(): number;

  bracket(outerPrecedence: number): string {
    return this.precedence < outerPrecedence ? `(${this})` : `${this}`;
  }

  abstract toNFADesign(): NFADesign;

  matches(string: string): boolean {
    return this.toNFADesign().accepts(string);
  }

  inspect(): string {
    return `/${this.toString()}/`;
  }
}


/**
 * Represents an empty pattern in a regular expression.
 * 
 * @class Empty
 * @extends Pattern
 * @property {number} precedence - The precedence of the empty pattern.
 * @method toNFADesign - Converts the empty pattern to a Non-deterministic Finite Automata (NFA) design.
 * @method toString - Returns a string representation of the empty pattern.
 * 
 */
export class Empty extends Pattern {
  get precedence(): number {
    return 3;
  }

  toNFADesign(): NFADesign {
    const startState = states.next().value;
    const acceptState = startState;
    const rulebook = new NFARulebook([]);

    return new NFADesign(startState, acceptState, rulebook);
  }

  toString(): string {
    return "";
  }
}

/**
 * Represents a literal character pattern in a regular expression.
 * 
 * @class Literal
 * @extends Pattern
 * @property {string} character - The character of the literal pattern.
 * @property {number} precedence - The precedence of the literal pattern.
 * @method toNFADesign - Converts the literal pattern to a Non-deterministic Finite Automata (NFA) design.
 * @method toString - Returns a string representation of the literal pattern.
 * 
 */
export class Literal extends Pattern {
  constructor(private character: string) {
    super();
  }

  get precedence(): number {
    return 3;
  }

  toNFADesign(): NFADesign {
    const startState = states.next().value;
    const acceptState = states.next().value;
    const rule =  new FARule(startState, this.character, acceptState);
    const rulebook = new NFARulebook([rule]);

    return new NFADesign(startState, acceptState, rulebook);
  }

  toString(): string {
    return this.character;
  }
}

/**
 * Represents a concatenation of two patterns in a regular expression.
 * 
 * @class Concatenate
 * @extends Pattern
 * @property {Pattern} firstPattern - The first pattern in the concatenation.
 * @property {Pattern} secondPattern - The second pattern in the concatenation.
 * @property {number} precedence - The precedence of the concatenation pattern.
 * @method toNFADesign - Converts the concatenation pattern to a Non-deterministic Finite Automata (NFA) design.
 * @method toString - Returns a string representation of the concatenation pattern.
 * 
 */
export class Concatenate extends Pattern {
  constructor(firstPattern: Pattern, secondPattern: Pattern) {
    super();
    this.firstPattern = firstPattern;
    this.secondPattern = secondPattern;
  }

  private firstPattern: Pattern;
  private secondPattern: Pattern;

  get precedence(): number {
    return 1;
  }

  toNFADesign(): NFADesign {
    const firstNFADesign = this.firstPattern.toNFADesign();
    const secondNFADesign = this.secondPattern.toNFADesign();

    const startState = firstNFADesign.startState;
    const acceptStates = secondNFADesign.acceptStates;

    const rulebook = new NFARulebook([
      ...firstNFADesign.rulebook.rules,
      ...Array.from(firstNFADesign.acceptStates).map((state: number) => {
        return new FARule(new Set([state]), "ε", secondNFADesign.startState);
      }),
      ...secondNFADesign.rulebook.rules,
    ]);

    return new NFADesign(startState, acceptStates, rulebook);
  }

  toString(): string {
    return [this.firstPattern, this.secondPattern]
      .map((pattern) => pattern.bracket(this.precedence))
      .join("");
  }
}

/**
 * Represents a choice between two patterns in a regular expression.
 * 
 * @class Choose
 * @extends Pattern
 * @property {Pattern} firstPattern - The first pattern in the choice.
 * @property {Pattern} secondPattern - The second pattern in the choice.
 * @property {number} precedence - The precedence of the choice pattern.
 * @method toNFADesign - Converts the choice pattern to a Non-deterministic Finite Automata (NFA) design.
 * @method toString - Returns a string representation of the choice pattern.
 * 
 */
export class Choose extends Pattern {
  constructor(firstPattern: Pattern, secondPattern: Pattern) {
    super();
    this.firstPattern = firstPattern;
    this.secondPattern = secondPattern;
  }

  private firstPattern: Pattern;
  private secondPattern: Pattern;

  get precedence(): number {
    return 0;
  }

  toNFADesign(): NFADesign {
    const firstNFADesign = this.firstPattern.toNFADesign();
    const secondNFADesign = this.secondPattern.toNFADesign();

    const startState = states.next().value;
    const acceptStates = firstNFADesign.acceptStates.union(
      secondNFADesign.acceptStates
    );

    const rulebook = new NFARulebook([
      ...firstNFADesign.rulebook.rules,
      ...secondNFADesign.rulebook.rules,
      new FARule(startState, "ε", firstNFADesign.startState),
      new FARule(startState, "ε", secondNFADesign.startState),
    ]);

    return new NFADesign(startState, acceptStates, rulebook);
  }

  toString(): string {
    return [this.firstPattern, this.secondPattern]
      .map((pattern) => pattern.bracket(this.precedence))
      .join("|");
  }
}

/**
 * Represents a repetition of a pattern in a regular expression.
 * 
 * @class Repeat
 * @extends Pattern
 * @property {Pattern} pattern - The pattern to be repeated.
 * @property {number} precedence - The precedence of the repetition pattern.
 * @method toNFADesign - Converts the repetition pattern to a Non-deterministic Finite Automata (NFA) design.
 * @method toString - Returns a string representation of the repetition pattern.
 * 
 */
export class Repeat extends Pattern {
  constructor(pattern: Pattern) {
    super();
    this.pattern = pattern;
  }

  private pattern: Pattern;

  get precedence(): number {
    return 2;
  }

  toNFADesign(): NFADesign {
    const nfaDesign = this.pattern.toNFADesign();

    const startState = states.next().value;
    const acceptStates = nfaDesign.acceptStates.union(startState);

    const rulebook = new NFARulebook([
      ...nfaDesign.rulebook.rules,
      new FARule(startState, "ε", nfaDesign.startState),
      ...Array.from(acceptStates).map((state: number) => {
        return new FARule(new Set([state]), "ε", nfaDesign.startState);
      }),
    ]);

    return new NFADesign(startState, acceptStates, rulebook);
  }

  toString(): string {
    return `${this.pattern.bracket(this.precedence)}*`;
  }
}

console.group("* Part 1: Programs and Machines => 3. The Simplest Computers => Regular Expressions");

const pattern = new Repeat(
  new Concatenate(
    new Literal("a"),
    new Choose(
      new Empty(), 
      new Literal("b")
    ),
  ),
);

console.log("Pattern:", pattern.inspect());
console.log("Matches '':", pattern.matches(""));
console.log("Matches 'a':", pattern.matches("a"));
console.log("Matches 'ab':", pattern.matches("ab"));
console.log("Matches 'aba':", pattern.matches("aba"));
console.log("Matches 'abab':", pattern.matches("abab"));
console.log("Matches 'abaab':", pattern.matches("abaab"));
console.log("Matches 'abba':", pattern.matches("abba"));

console.groupEnd();