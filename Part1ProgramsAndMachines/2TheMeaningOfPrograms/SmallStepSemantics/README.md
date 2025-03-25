# Small-Step Semantics

So, how can we design an abstract machine and use it to specify the operational semantics of a programming language? One way is to imagine a machine that evaluates a program by operating on its syntax directly, repeatedly reducing it in small steps, with each step bringing the program closer to its final result, whatever that turns out to mean.

These small-step reductions are similar to the way we are taught in school to evaluate algebraic expressions. For example, to evaluate (1 × 2) + (3 × 4), we know we should:

1. Perform the left-hand multiplication (1 × 2 becomes 2) and reduce the expression to 2 + (3 × 4)
2. Perform the right-hand multiplication (3 × 4 becomes 12) and reduce the expression to 2 + 12
3. Perform the addition (2 + 12 becomes 14) and end up with 14

We can think of 14 as the result because it can’t be reduced any further by this process —we recognize 14 as a special kind of algebraic expression, a value, which has its own meaning and doesn’t require any more work on our part.