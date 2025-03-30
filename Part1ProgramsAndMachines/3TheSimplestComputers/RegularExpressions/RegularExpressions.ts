import { FARule } from "../DeterministicFiniteAutomata/DeterministicFiniteAutomata";
import { NFARulebook, NFADesign } from "../NondeterministicFiniteAutomata/NondeterministicFiniteAutomata";

function* statesGenerator(): Generator<number> {
  let state = 0;

  while (true) {
    yield state++;
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
 * @example
 * const pattern = new Literal('a');
 * console.log(pattern.precedence); // 3
 * console.log(pattern.bracket(2)); // '(a)'
 * console.log(pattern.toNFADesign()); // NFADesign object
 * console.log(pattern.matches('a')); // true
 * console.log(pattern.inspect()); // '/a/'
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
 * @example
 * const emptyPattern = new Empty();
 * console.log(emptyPattern.precedence); // 3
 * console.log(emptyPattern.toString()); // ''
 */
export class Empty extends Pattern {
  get precedence(): number {
    return 3;
  }

  toNFADesign(): NFADesign {
    const startState = states.next().value;
    const acceptState = startState;
    const rulebook = new NFARulebook([]);

    return new NFADesign(startState, [acceptState], rulebook);
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
 * @example
 * const literalPattern = new Literal('a');
 * console.log(literalPattern.precedence); // 3
 * console.log(literalPattern.toString()); // 'a'
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

    return new NFADesign(startState, [acceptState], rulebook);
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
 * @example
 * const concatPattern = new Concatenate(new Literal('a'), new Literal('b'));
 * console.log(concatPattern.precedence); // 1
 * console.log(concatPattern.toString()); // 'ab'
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
      ...firstNFADesign.acceptStates.map((state) => {
        return new FARule(state, "ε", secondNFADesign.startState);
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
 * @example
 * const choosePattern = new Choose(new Literal('a'), new Literal('b'));
 * console.log(choosePattern.precedence); // 0
 * console.log(choosePattern.toString()); // 'a|b'
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

    const acceptStates = [
      ...firstNFADesign.acceptStates,
      ...secondNFADesign.acceptStates,
    ];

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
 * @example
 * const repeatPattern = new Repeat(new Literal('a'));
 * console.log(repeatPattern.precedence); // 2
 * console.log(repeatPattern.toString()); // '(a)*'
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
    const acceptStates = [...nfaDesign.acceptStates, startState];

    const rulebook = new NFARulebook([
      ...nfaDesign.rulebook.rules,
      new FARule(startState, "ε", nfaDesign.startState),
      ...acceptStates.map((state) => {
        return new FARule(state, "ε", nfaDesign.startState);
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