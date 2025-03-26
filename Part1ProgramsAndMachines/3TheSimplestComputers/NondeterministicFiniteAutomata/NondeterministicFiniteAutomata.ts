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

export class NFARulebook {
  constructor(rules: FARule[]) {
    this.rules = rules;
  }

  rules: FARule[];

  nextStates(states: Set<number>, character: string): Set<number> {
    return new Set(Array.from(states).flatMap((state: number) => this.followRulesFor(state, character)));
  }

  followRulesFor(state: number, character: string): number[] {
    return this.rulesFor(state, character).map((rule: FARule) => rule.follow());
  }

  rulesFor(state: number, character: string): FARule[] {
    return this.rules.filter((rule: FARule) => rule.appliesTo(state, character));
  }
}

export class NFA {
  constructor(currentStates: Set<number>, acceptStates: number[], rulebook: NFARulebook) {
    this.currentStates = currentStates;
    this.acceptStates = acceptStates;
    this.rulebook = rulebook;
  }

  currentStates: Set<number>;
  acceptStates: number[];
  rulebook: NFARulebook;

  accepting(): boolean {
    return Array.from(this.currentStates).some((state: number) => this.acceptStates.includes(state));
  }

  readCharacter(character: string): void {
    this.currentStates = this.rulebook.nextStates(this.currentStates, character);
  }

  readString(string: string): void {
    for (const character of string) {
      this.readCharacter(character);
    }
  }
}

console.group("Part 1: Programs and Machines => 3. The Simplest Computers => Nondeterministic Finite Automata");

const rulebook = new NFARulebook([
  new FARule(1, "a", 1), new FARule(1, "b", 1), new FARule(1, "b", 2),
  new FARule(2, "a", 3), new FARule(2, "b", 3),
  new FARule(3, "a", 4), new FARule(3, "b", 4)
]);

const nfa = new NFA(new Set([1]), [4], rulebook);
console.log(nfa.accepting());
nfa.readCharacter("b");
console.log(nfa.accepting());
nfa.readCharacter("a");
console.log(nfa.accepting());
nfa.readCharacter("b");
console.log(nfa.accepting());

console.groupEnd();