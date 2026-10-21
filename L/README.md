# L

The lab holds L's rules, each with its proof and the programs the proof cites, and the catalog of crashes no
rule closes yet. A rule's folder is named for what the rule enforces, which is sometimes not what L-hooks calls
it: immutable-bindings is the hooks' ban on let and var, built on what the binding does instead of on the
keyword.

```
L/
  README.md          this file
  changes.txt        every change the fork makes to TypeScript 6.0.3, by rule
  debt.txt           what is known to be wrong or unproven, by rule
  rules/<rule>/
    rule.txt         the rule's proof
    <case>.ts        one program, whose first line says what it is for
  catalog/           crashes TypeScript 6.0.3 accepts that no rule closes yet, one program each
  lean/              machine-checked calculi that the proofs cite, with their own README
  tools/
    tracker.mjs      runs every case, checks it against its proof, and prints where each rule and the catalog stand
    compare.mjs      lists what the lab rejects in a project that plain TypeScript accepts
    rules.mjs        reads every rule's proof, for the tracker and compare.mjs
```

Build the compiler with `npx hereby local` from the repository's root, then run `node L/tools/tracker.mjs`. It
exits 1 when a case is broken or a control is rejected.

## Rules

rule.txt opens with the rule's name and kind, then argues in a fixed order: the claim, the counterexample in
plain TypeScript, and one obligation per mechanism, as in `Obligation 1, assignability: TS2898`. Each
obligation gives its statement, its mechanism in the checker, and why the mechanism suffices, then cites
every case it rests on, one per line, beneath `Witnesses:`, `Controls:` or `Rejected sound code, because ...:`.
A rule with no obligations is a specification that isn't built yet, and the tracker shows it as spec only.
An obligation can also say what lean/ proves for it, under `In Lean.`: a theorem about a small calculus, not
about checker.ts.

The kind says why L has the rule:

- soundness: TypeScript accepts a program whose types are false, and a witness crashes to prove it.
- policy: TypeScript's types are honest, and L forbids the construct anyway, for its own goals.
- information: absence and truthiness, where a sound encoding can still tell a reader nothing.
- project: a project's structure and tests rather than its types.

## Cases

A case's first line says what it is for:

- `// witness:` a program plain TypeScript 6.0.3 accepts and Node crashes on. A witness with no marked line is
  a hole the lab hasn't closed yet, and the tracker counts it open.
- `// control:` a program the lab must keep accepting.
- `// rejected sound code:` a program that can't go wrong, which the lab rejects on purpose, and why.

A witness's name says what it gets past, as in L-hooks' catalog: rel- the type relation, flow- narrowing,
chk- other checks, lib- library declarations, and rule- a program that crashes only when its rule is
bypassed. A name also sets how the case is compiled: one with esnext in it gets the esnext libraries instead of
es2022, and one with script in it is compiled as a script instead of a module.

A line the lab must reject ends with a marker naming the L code of the mechanism that rejects it, as in
`// rejected here: TS2894`. The tracker holds each rule's folder to its proof: every case is cited under the
obligations it supports, in the role its first line claims; every marker names the code of an obligation that
cites it; and a rejection counts only when a diagnostic on that line carries that code.

Each case is compiled in a program of its own, so a global that one case declares can't reach another, under
L's options: strict, noUncheckedIndexedAccess and exactOptionalPropertyTypes. Node runs the JavaScript the
6.0.3 release emits for the case, since the lab doesn't change what is emitted.

## The catalog

catalog/ holds crashes that TypeScript 6.0.3 accepts and that no rule closes yet. They came from L-hooks'
witnesses/cases at its commit d073d92, all but the ones a rule's folder already held and the ones 6.0.3
rejects or runs without a crash. Every catalog case is a witness with no marked line. The tracker reports each
one as open, when the lab accepts it, or as rejected, when the lab rejects it but no rule cites it yet. A rule
that closes a catalog case takes it into its own folder, marks the line its mechanism rejects, and cites it, so
every case lives in exactly one place.
