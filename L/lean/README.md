# λ_Top — a type with no eliminations is sound, and `any`'s permissions each break it

Lean 4.22.0, no Mathlib, no lake project.

```
lean -o Top.olean Top.lean          # calculus, theorems, inline examples, #print axioms
LEAN_PATH=. lean Vacuity.lean       # the stuck terms are untypable; covariance does not go down
LEAN=lean mutants/check.sh          # each any-permission: proof fails AND a stuck well-typed term exists
node v8-instanceof.js               # the V8 behaviour instanceof is modelled on (recorded in .out)
node v8-narrowing.js                # the V8 behaviour the narrowing tests are modelled on (recorded in .out)
```

## What the theorem is

`sound`: in a calculus with subtyping — reflexive, transitive, every type below `Top`, width
and depth on records by label, **covariant arrays, contravariant function parameters** — where `Top` has no
eliminations, a well-typed term never evaluates to `stuck`, and any value it produces has
its type. That is the standard result for a typed λ-calculus with a top type; it is
TypeScript's `unknown`. On its own it says nothing about `any`.

The variances are the ones L requires, not TypeScript's: TypeScript relates mutable arrays
covariantly (closed by L's mutable-array-or-tuple rule) and compares method parameters
bivariantly. The counterexamples are unaffected, since an `any` leaf relates in either
direction.

## What says something about L

`mutants/`. Each `.rule` is one permission TypeScript grants `any`, added back. For each,
`check.sh` verifies that the theorem is false under it: every `<name>*.cex` is a closed,
well-typed term that evaluates to `stuck`, checked by Lean with no `sorry`. A mutant with no
counterexample fails. `check.sh` also refuses to run if `sound` itself rests on `sorry` or an
added axiom. `mutants/README.md` maps each mutant to its `checker.ts` function and witness
files.

There is exactly one assignability mutant, `subDown` (`Subty .top τ`: `any` is assignable to
everything). Its four counterexamples reach the hole directly, through array covariance,
through parameter contravariance, and through record depth inside a parameter — nothing is
postulated at the array, the arrow, or the record. That is the calculus's version of
rule.txt's argument: type arguments are related through their variances, so a nested `any`
reaches the same leaf check.

Nothing here is a proof about L's checker. Every claim that L rejects or accepts a program
still rests on the witnesses and controls run through the build; the calculus says which rules
*must* be absent for soundness, not that `checker.ts` lacks them.

What this proves: for a relation built from these variances, rejecting `any` at the leaf is
enough; and allowing it at the leaf alone breaks the direct flow and the three nested positions
shown (an array element, a parameter, a record field inside a parameter). No theorem quantifies
over positions; a result position or a record field outside a parameter has no counterexample
here. What it does **not**
prove: that `checker.ts` breaks a relation down the same way — that `structuredTypeRelatedTo`
relates type arguments through their measured variances down to `isSimpleTypeRelatedTo`,
where L's check sits. That is a claim about the compiler, checked against the compiler.

## Checking an unknown

The other half of the `any` rule is that once a value is `unknown`, a check decides what it is.
The calculus has the checks a parser of JSON needs, each refining the tested variable in its
then-branch: the plain-object test (`typeof x === "object" && x !== null && !Array.isArray(x)`)
to `record []`, `Array.isArray(x)` to `unknown[]`, and `"l" in x` on a record, adding `l : Top`.
`parseName` builds a parser from `Top` to `{ name: string }` out of them, the way L asks: the
field is bound to a name before its `typeof` test, and the result goes to an `ok` or a `fail`
continuation instead of a made-up value. `parseNameNeverStuck` proves it never gets stuck on any
value, and five evaluations show it takes the branch V8 would.

`typeof x === "function"` refines nothing, because a class is a function and calling one
throws. TypeScript narrows to `Function` and calls it with no signature. `mutants/funCall` is that
rule, refuted by calling a class, and TypeScript and L both accept the program (L/rules/call-signature).

These are tests the calculus can state, not TypeScript's narrowing. TypeScript narrows in steps
(`object | null`, then `object`, then `object & Record<"l", unknown>`) and lets `in` look into an
array; whether its steps compose to these refinements is a claim about `checker.ts`.

## Coverage against the `any` finding

| obligation | witnesses | covered by |
| --- | --- | --- |
| TS2900 | chk-property-off-any, chk-destructure-any | `proj` / projTop |
| TS2900 | chk-element-off-any | `elem` / elemTop |
| TS2900 | chk-call-any, chk-tagged-template-any | `app` / appTop |
| TS2900 | chk-iterate-any | `forEach` / iterTop |
| TS2900 | chk-spread-any | `spread` / spreadTop |
| TS2900 | chk-in-any | `hasKey` / inTop |
| TS2900 | chk-instanceof-any | `instOf` (right side must be `.ctorTy`) / instOfTop |
| TS2901 | instanceof-constructor's witness, `value instanceof make` with `make` an arrow function, which TypeScript accepts and L rejects | instOfCallable: TypeScript accepts any function on the right, because every function type inherits Function's `[Symbol.hasInstance](value: any): boolean`; refuted by `({}) instanceof (() => 1)` |
| TS2900 | chk-new-any | **not covered**: no constructors |
| controls | narrowed-before-use, unknown-checked | `ifStr`, `ifNum` |
| (open) | L/rules/call-signature: `typeof value === "function"`, then `value()` on a class | funCall: TypeScript narrows to `Function` and calls it with no signature; refuted by calling `ctor` |
| TS2898 | direct `any` → `T` | subDown.direct |
| TS2898 | rel-any-nested-array, lib-array-isarray-any, lib-object-values-interface, lib-promise-any-errors (`errors: any[]` → `readonly Error[]`) | subDown.nested-array (`Subty.arr`) |
| TS2898 | lib-promise-catch-annotated, lib-promise-any-errors (catch parameter annotated `AggregateError`) | subDown.callback-param (`Subty.arrow`) |
| TS2898 | lib-json-stringify-replacer (second parameter), lib-string-replace-callback (rest parameter's element) | by analogy only: functions here take one argument, so these routes are not modelled |
| TS2898 | lib-allsettled-reason-any (`reason` field of `PromiseRejectedResult` inside the callback's parameter) | subDown.settled-reason (`Subty.record` inside `Subty.arrow`) |
| TS2898 | rel-any-nested-promise, rel-any-declared-promise, lib-then-json-parse, lib-generator-tnext-any | **not covered** at the producing operation: in each, `await` or `yield` produces the `any` and it flows straight into an annotation (L reports `unknown` not assignable to `User`/`Point`/`string`). The route is `subDown.direct`; what the calculus lacks is `await`/`yield`, not a variance |
| TS2898 | lib-map-no-typeargs | **not covered** at the producing operation: the route is `subDown.nested-array` (L reports `any[]` not assignable to `readonly string[]`); what the calculus lacks is the generic call that infers `any[]` |

## Assumptions the proof makes

- **Immutable bindings (L rule TS2892/TS2893).** `ifStr`/`ifNum` retype a variable inside a
  branch. That is sound here only because the calculus has no assignment. The `any` proof
  depends on that rule.
- **Mutable-array-or-tuple (L rule TS2890/TS2891).** Array covariance is sound here only
  because nothing can write to an array; these are `readonly T[]`. The `any` proof depends on
  that rule too. Mutable-array covariance is a separate hole, not modelled.
- **`stuck` is L's error, not V8's.** A missing field and an element read on a non-array are
  stuck here; JavaScript returns `undefined` for the first and for `(42)[0]`. `instanceof` with
  an arrow function on the right and a non-object on the left is stuck here and `false` in V8.
  So are `"l" in []` and `"l" in (() => 1)`, which V8 answers `false`. In the other direction
  the evaluator is never laxer than V8. Every claim about V8 in this package is measured:
  `v8-instanceof.js` / `v8-instanceof.out` (Node v22.22.0, reproduced on v26.7.0) and
  `v8-narrowing.js` / `v8-narrowing.out` (Node v26.7.0). Every element read is typed `Top`
  (the index may be out of range).
- **Plain objects.** Every record is a plain object. `"l" in x` on one also finds
  Object.prototype's keys, inherited, so `ifIn` is typed only for keys outside
  `objectProtoKeys`; for those, `in` is an own-field lookup. A record literal is typed only with
  distinct keys: V8 keeps the last of two equal keys and `lookup` finds the first.
- **Honest construct signatures.** The sound `instanceof` rule requires `.ctorTy` on the right,
  and the evaluator gives `.ctor` a prototype. In TypeScript the corresponding promise is a
  construct signature, and a declaration can lie: `declare const make: new () => X` for a value
  that is really an arrow function breaks the rule, and no checker can see it. The rule is
  sound only if declarations are honest.
- The refinements are `typeof` string and number, the plain-object test, `Array.isArray` and
  `in`. Whether TypeScript's narrowing of `unknown` refines no further than these is a
  correspondence to check against `checker.ts` (`narrowTypeByTypeof`, `narrowTypeByEquality`,
  `narrowTypeByTruthiness`, `narrowTypeByInstanceof`, `narrowTypeByInKeyword`), not something
  this file proves.
- Records have width and depth subtyping, by label, as L does.

## Vacuity checks

| check | where | rules out |
| --- | --- | --- |
| inhabitation | `example`s after `HasType` | a relation that types nothing |
| `stuck` reachable | `example`s after `eval`, one per elimination | an evaluator that cannot fail |
| axioms | `#print axioms` at the end of `Top.lean` | `sorry` or an added axiom |
| `Subty` not degenerate | `Vacuity.lean`: `subTopOnlyTop`, `subArrTopOnly`, `subBaseOnly` (all five base types below only themselves and `Top`) | a subtyping relation that relates everything |
| `sound` unproved | `check.sh` step 0 | a `sorry` or added axiom in `sound` passing unnoticed |
| mutants | `check.sh` step 2 | a mutant that is merely unproved rather than false; a mutant with no counterexample |
| narrowing reachable | `example`s after `eval` | a test that never takes a branch, or never gets stuck where V8 throws |
| the parser runs | `example`s after `parseNameNeverStuck` | a parser that types but never parses |
| refinements bite | `Vacuity.lean`: the class call and `"toString" in x` are untypable | a `typeof "function"` or `in` rule that refines more than V8 guarantees |

## Still not covered

- `new` (no constructors).
- The operations that produce an `any` in the remaining witnesses: `await`, `yield`, and
  generic calls that infer `any` (`new Map()`). Their assignability routes are the ones
  shown; the producers are not modelled.
- Rest parameters and second parameters (functions take one argument).
- Unions. A narrowing's else-branch learns nothing, so `x !== null` on a `T | null` can't be
  stated, and neither can a judgment made per member of a union.
