# L

Each of L's rules has a folder here, named for what the rule enforces, which is sometimes not what L-hooks
calls it: immutable-bindings is the hooks' ban on let and var, built on what the binding does instead of on
the keyword. The folder holds the rule's proof and every program the proof cites, side by side.

```
L/
  rules.mjs          reads every rule's proof, for the tracker and compare.mjs
  tracker.mjs        runs every case, checks it against its proof, and prints where each rule stands
  compare.mjs        lists what the lab rejects in a project that plain TypeScript accepts
  debt.txt           what is known to be wrong or unproven, by rule
  <rule>/
    rule.txt         the rule's proof
    <case>.ts        one program, whose first line says what it is for
```

rule.txt opens with the rule's name and kind, then argues in a fixed order: the claim, the counterexample in
plain TypeScript, and one obligation per mechanism, as in `Obligation 1, assignability: TS2898`. Each
obligation gives its statement, its mechanism in the checker, and why the mechanism suffices, then cites
every case it rests on, one per line, beneath `Witnesses:`, `Controls:` or `Rejected sound code, because ...:`.
A rule with no obligations is a specification that isn't built yet, and the tracker shows it as spec only.

The kind says why L has the rule:

- soundness: TypeScript accepts a program whose types are false, and a witness crashes to prove it.
- policy: TypeScript's types are honest, and L forbids the construct anyway, for its own goals.
- information: absence and truthiness, where a sound encoding can still tell a reader nothing.
- project: a project's structure and tests rather than its types.

A case's first line says what it is for:

- `// witness:` a program plain TypeScript 6.0.3 accepts and Node crashes on.
- `// control:` a program the lab must keep accepting.
- `// rejected sound code:` a program that can't go wrong, which the lab rejects on purpose, and why.

A witness's name says what it gets past, as in L-hooks' catalog: rel- the type relation, flow- narrowing,
chk- other checks, lib- library declarations, and rule- a program that crashes only when its rule is
bypassed.

A line the lab must reject ends with a marker naming the L code of the mechanism that rejects it, as in
`// rejected here: TS2894`. The tracker holds the folder to the proof: every case is cited under the
obligations it supports, in the role its first line claims; every marker names the code of an obligation that
cites it; and a rejection counts only when a diagnostic on that line carries that code. Cases are compiled
under L's options: strict, noUncheckedIndexedAccess and exactOptionalPropertyTypes.
