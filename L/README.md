# L

Each of L's rules that has been built into the checker has a folder here, holding the programs that test it.
The folder names are L-hooks' rule labels.

```
L/
  tracker.mjs                       runs every case and prints where each rule stands
  compare.mjs                       lists what the lab rejects in a project that plain TypeScript accepts
  <kind>/<rule>/
    rule.txt                        what the rule is, and which checker functions enforce it
    <witness>.ts                    a program plain TypeScript 6.0.3 accepts and Node crashes on
    controls/<case>.ts              a program the lab must keep accepting
    rejected-sound-code/<case>.ts   a safe program the lab rejects on purpose, with a comment saying why
```

A rule the checker has to enforce at more than one kind of node gets a folder per mechanism,
`<kind>/<rule>/<mechanism>/`, each laid out like a rule folder, and its rule.txt states each mechanism's proof
obligation. The tracker shows each mechanism as its own row.

A rule that is specified but not built yet has only its rule.txt, and the tracker shows it as spec only.

The kind says why L has the rule:

- soundness: TypeScript accepts a program whose types are false, and a witness crashes to prove it.
- policy: TypeScript's types are honest, and L forbids the construct anyway, for its own goals.
- information: absence and truthiness, where a sound encoding can still tell a reader nothing.
- project: a project's structure and tests rather than its types.

A witness's name says what it gets past, as in L-hooks' catalog: rel- the type relation, flow- narrowing,
chk- other checks, lib- library declarations, and rule- a program that crashes only when its rule is
bypassed.

A line the lab must reject ends with a marker naming the code the rule's check reports, as in
`// rejected here: TS2894`. The tracker counts a rejection only when it carries that code, so a case
rejected for some other reason shows as broken. Cases are compiled under L's options: strict,
noUncheckedIndexedAccess and exactOptionalPropertyTypes.
