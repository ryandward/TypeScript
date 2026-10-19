# L

Each of L's rules has a folder here, named with L-hooks' label for the rule. The folder holds the rule's
specification and every program that tests it, side by side.

```
L/
  rules.mjs          reads every rule.txt header, for the tracker and compare.mjs
  tracker.mjs        runs every case and prints where each rule stands
  compare.mjs        lists what the lab rejects in a project that plain TypeScript accepts
  <rule>/
    rule.txt         the rule's kind, its mechanisms, and its specification
    <case>.ts        one program, whose first line says what it is for
```

rule.txt opens with a header, ended by a blank line:

```
let-or-var
kind: policy
TS2892 binding without an initializer: checkGrammarVariableDeclaration
TS2893 assignment to a binding: checkIdentifier
```

The first line is the rule's name, and the kind says why L has the rule:

- soundness: TypeScript accepts a program whose types are false, and a witness crashes to prove it.
- policy: TypeScript's types are honest, and L forbids the construct anyway, for its own goals.
- information: absence and truthiness, where a sound encoding can still tell a reader nothing.
- project: a project's structure and tests rather than its types.

Each mechanism line gives the L code the mechanism reports, its name, and the checker functions that enforce
it. A mechanism that closes holes in two rules appears in both under the same name. A rule with no mechanism
lines is specified but not built yet, and the tracker shows it as spec only.

A rule written as a proof, as any is, follows its kind with a claim, the counterexample in plain TypeScript, and
one obligation per mechanism, `Obligation 1, assignability: TS2898`. Each obligation gives its statement, its
mechanism and why the mechanism suffices, and cites every case that supports it beneath `Witnesses:`,
`Controls:` or `Rejected sound code, ...:`. The tracker holds the folder to the proof: every case is cited once,
in the role its first line claims, and its markers name its obligation's code.

A case's first line says what it is for:

- `// witness:` a program plain TypeScript 6.0.3 accepts and Node crashes on.
- `// control:` a program the lab must keep accepting.
- `// rejected sound code:` a program that can't go wrong, which the lab rejects on purpose, and why.

A witness's name says what it gets past, as in L-hooks' catalog: rel- the type relation, flow- narrowing,
chk- other checks, lib- library declarations, and rule- a program that crashes only when its rule is
bypassed.

A line the lab must reject ends with a marker naming the L code of the mechanism that rejects it, as in
`// rejected here: TS2894`. The code has to be one of the rule's mechanisms, and the tracker counts a
rejection only when a diagnostic on that line carries it, so a case rejected for some other reason shows as
broken. Cases are compiled under L's options: strict, noUncheckedIndexedAccess and exactOptionalPropertyTypes.
