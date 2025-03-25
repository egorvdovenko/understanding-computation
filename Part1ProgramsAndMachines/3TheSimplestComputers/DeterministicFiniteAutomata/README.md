# Deterministic Finite Automata

Real computers typically have large amounts of volatile memory (RAM) and nonvolatile storage (hard drive or SSD), many input/output devices, and several processor cores capable of executing multiple instructions simultaneously. A **finite state machine**, also known as a **finite automaton**, is a drastically simplified model of a computer that throws out all of these features in exchange for being easy to understand, easy to reason about, and easy to implement in hardware or software.

## States, Rules, and Input

A finite automaton has no permanent storage and virtually no RAM. It’s a little machine with a handful of possible states and the ability to keep track of which one of those states it’s currently in—think of it as a computer with enough RAM to store a single value. Similarly, finite automata don’t have a keyboard, mouse, or network interface for receiving input, just a single external stream of input characters that they can read one at a time.

Instead of a general-purpose CPU for executing arbitrary programs, each finite automaton has a hardcoded collection of rules that determine how it should move from one state to another in response to input. The automaton starts in one particular state and reads individual characters from its input stream, following a rule each time it reads a character.
