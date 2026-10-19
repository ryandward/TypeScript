# λ_Top — a type with no eliminations is sound, and `any`'s permissions each break it

Lean 4.22.0, no Mathlib, no lake project.

```
lean -o Top.olean Top.lean          # calculus, theorems, inline examples, #print axioms
LEAN_PATH=. lean Vacuity.lean       # the stuck terms are untypable
LEAN=lean mutants/check.sh          # each any-permission: proof fails AND a stuck well-typed term exists
```

## What the theorem is

`sound`: in a calculus whose `Top` has no eliminations, a well-typed term never evaluates to
`stuck`, and any value it produces has its type. That is the standard result for a typed
λ-calculus with a top type; it is TypeScript's `unknown`. On its own it says nothing about
`any`.

## What says something about L

`mutants/`. Each `.rule` is one permission TypeScript grants `any` — a property read, a call,
iteration, spread, `in`, `instanceof`, assignability to everything, assignability nested
through an array — added back to `Top`. For each, `check.sh` verifies two things:

1. the proof of `sound` no longer goes through, and
2. the theorem is **false**: `mutants/<name>.cex` is a closed, well-typed term that evaluates
   to `stuck`, checked by Lean under the mutant (`refuted`, no `sorry`).

`mutants/README.md` maps each to its `checker.ts` function and its witness file in the `any`
finding. Same hole: refuted here, thrown in V8.

## Coverage against the `any` finding

| obligation | witness | covered by |
| --- | --- | --- |
| TS2900 | chk-property-off-any, chk-destructure-any | `proj` / mutant projTop |
| TS2900 | chk-element-off-any | `elem` / elemTop |
| TS2900 | chk-call-any, chk-tagged-template-any | `app` / appTop |
| TS2900 | chk-iterate-any | `forEach` / iterTop |
| TS2900 | chk-spread-any | `spread` / spreadTop |
| TS2900 | chk-in-any | `hasKey` / inTop |
| TS2900 | chk-instanceof-any | `instOf` / instOfTop |
| TS2900 | chk-new-any | **not covered** — no constructors in the calculus |
| TS2898 | direct `any` → `T` | `sub` only goes up / subDown |
| TS2898 | rel-any-nested-array, lib-array-isarray-any, lib-new-array-any | `arr` / subArr |
| TS2898 | rel-any-nested-promise, lib-response-json-await, lib-then-json-parse | **not covered** — no promise type; `subArr` is the nested case for the one container present |
| TS2898 | lib-map-no-typeargs, lib-generator-tnext-any, callbacks handed `any` | **not covered** — no generics, no generators |

## Assumptions the proof makes

- **Immutable bindings.** `ifStr`/`ifNum` retype a variable inside a branch. That is sound here
  only because the calculus has no assignment. The `any` rule therefore depends on L's
  immutable-bindings rule; the calculus with references and `await` (D01) is where that is
  paid for.
- **`stuck` is L's error, not V8's.** A missing field and an element read on a non-array are
  stuck here; JavaScript returns `undefined` for the first and for `(42)[0]`. L is stricter
  than V8 in that direction only. Out-of-range element reads are typed `Top` (the sound
  over-approximation of `τ | undefined`).
- The only refinements are `typeof === "string"` and `=== "number"`. Equality, truthiness and
  `instanceof` narrowing are not in the calculus. Whether TypeScript's narrowing of `unknown`
  is exactly the set of total tests is a correspondence to check against `checker.ts`
  (`narrowTypeByTypeof`, `narrowTypeByEquality`, `narrowTypeByTruthiness`,
  `narrowTypeByInstanceof`), not something this file proves.

## Vacuity checks

| check | where | rules out |
| --- | --- | --- |
| inhabitation | `example`s after `HasType` | a relation that types nothing |
| `stuck` reachable | `example`s after `eval`, one per elimination | an evaluator that cannot fail |
| axioms | `#print axioms` at the end of `Top.lean` | `sorry` or an added axiom |
| mutants, weak | `check.sh` step 1 | a proof that does not depend on the rule's absence |
| mutants, strong | `check.sh` step 2 | a rule that is merely unproved rather than false |
