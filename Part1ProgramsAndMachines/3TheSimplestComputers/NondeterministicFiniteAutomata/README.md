# Nondeterministic Finite Automata

**Nondeterministic Finite Automata (NFA)** is a theoretical model of computation used to recognize patterns in strings. Unlike Deterministic Finite Automata (DFA), an NFA can be in multiple states at the same time, and transitions can occur without consuming any input (via epsilon transitions).

### Key Concepts:
1. **States**: A finite set of states the automaton can be in.
2. **Alphabet**: A finite set of symbols the automaton can process.
3. **Transition Function**: Defines how the automaton moves between states based on input symbols or epsilon transitions.
4. **Start State**: The state where the automaton begins.
5. **Accepting States**: A subset of states that indicate successful recognition of input.

### Characteristics:
- **Nondeterminism**: The automaton can follow multiple paths simultaneously.
- **Multiple Current States**: At any point, the NFA can be in several states at once.
- **Epsilon Transitions**: Transitions that occur without consuming input symbols (optional).

NFAs are widely used in theoretical computer science and are equivalent in power to DFAs, though they are often more concise and easier to construct for certain patterns.