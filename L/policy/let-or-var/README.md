# let-or-var

## What L says

L's rules list `let` and `var` under writes. The hook rejects every `let` or `var` declaration list, whatever
it holds.

## What the lab decided

The lab enforces single assignment instead of banning the keywords: every binding is assigned once, where it
is declared. That's the property L actually wants, that a binding never changes, and it means a `let` that is
initialized and never reassigned compiles.

- TS2892, in `checkGrammarVariableDeclaration` beside the check that a `const` is initialized: a `let` or
  `var` in a declaration list without an initializer.
- TS2893, in `checkIdentifier`'s assignment target check beside the error for assigning to a `const`: any
  assignment to a variable after its declaration, including parameters, loop variables and catch variables.

Some bindings aren't held to TS2892, because something other than the program assigns them:

- for-in and for-of variables are bound by the loop;
- catch variables are bound by the throw;
- ambient declarations describe a global that already exists, as `declare var console: Console` does in
  TypeScript's own lib.

`isReadonlySymbol` is left alone on purpose. Narrowing reads constness, so treating every variable as a
constant there would reach into flow analysis.

## What it rejects on purpose

`rejected-sound-code/counting-loop.ts`: a counting loop is safe, but `i++` reassigns its counter. In L a run
of numbers is a value, as in `Array.from({ length: 3 }, (_, i) => i)`.

## What was tried and dropped

A definite-assignment patch in flow analysis (`assumeInitialized`) closed the witness for a hoisted function.
Making that exact would take cross-function call-order analysis, which TypeScript left out on purpose because
it's intractable, so it was reverted. A keyword ban replaced it briefly, before single assignment.

## Open

L's hook still rejects the keyword, including a `let` that is never reassigned. The rule in `~/Git/L` should
follow the lab once single assignment is settled.

## Commits

dbe09f6e5
