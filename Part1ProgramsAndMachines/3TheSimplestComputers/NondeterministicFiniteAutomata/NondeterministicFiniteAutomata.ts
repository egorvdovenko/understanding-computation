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
    console.log("followRulesFor: ", result);
    return result;
  }

  rulesFor(state: number, character: string): FARule[] {
    const result = this.rules.filter((rule: FARule) => rule.appliesTo(state, character));
    console.log("rulesFor: ", result);
    return result;
  }

  toString(): string {
    return this.rules.map((rule: FARule) => rule.toString()).join("\n");
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

  readCharacter(character: string) {
    console.log("currentStates: ", this.currentStates);
    this.currentStates = this.rulebook.nextStates(this.currentStates, character);
  }

  readString(string: string) {
    for (const character of string) {
      this.readCharacter(character);
    }
  }
}

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

console.groupEnd();