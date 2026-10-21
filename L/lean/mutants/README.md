# Mutants

Each `.rule` file is one typing rule TypeScript has and L removes — an `any` permission —
written for `Top`. Its first line says which relation it extends (`HasType` or `Subty`);
`check.sh` inserts it at that relation's `MUTANT-POINT` and requires that the theorem is
**false** under it: every `<name>*.cex` is a closed, well-typed term that evaluates to
`stuck`, checked by Lean with no `sorry`. (That the proof of `sound` breaks is only an
insertion check — any new constructor breaks an exhaustive case split.) A mutant with no
counterexample fails.

| mutant | TypeScript rule (checker.ts) | witnesses (any finding) | obligation |
| --- | --- | --- | --- |
| projTop | property read off `any` is `any` — `isAnyLike` branch of `checkPropertyAccessExpressionOrQualifiedName` | chk-property-off-any, chk-destructure-any | TS2900 |
| elemTop | element read off `any` — `checkElementAccessExpression` | chk-element-off-any | TS2900 |
| appTop | call on `any` returns `any` — `isUntypedFunctionCall` → `resolveUntypedCall` | chk-call-any, chk-tagged-template-any | TS2900 |
| iterTop | `for-of` over `any` — `checkIteratedTypeOrElementType` | chk-iterate-any | TS2900 |
| spreadTop | spread of `any` — `checkIteratedTypeOrElementType` | chk-spread-any | TS2900 |
| inTop | `in` with `any` on the right — `checkInExpression` | chk-in-any | TS2900 |
| instOfTop | `instanceof` with `any` on the right — `resolveInstanceofExpression` | chk-instanceof-any | TS2900 |
| instOfCallable | `instanceof` with any function on the right: every function type inherits Function's `[Symbol.hasInstance](value: any): boolean`, and `resolveInstanceofExpression` resolves the call against it | instanceof-constructor/chk-instanceof-arrow.ts: `value instanceof make`, `make` an arrow function, `value` an object; Node throws `Function has non-object prototype 'undefined'` | TS2901 |
| funCall | `typeof x === "function"` narrows to `Function`, which is called with no signature — `isUntypedFunctionCall` → `resolveUntypedCall` | L/rules/call-signature: `value()` on an unknown holding a class; Node throws `Class constructor ... cannot be invoked without 'new'` | (open) |
| subDown | `any` is assignable to every type — `isSimpleTypeRelatedTo`, source `any` | see below | TS2898 |

`subDown` is the **only** assignability mutant. Its four counterexamples show the nested
witnesses following from it through the variances, which is the argument rule.txt makes about
TypeScript (type arguments are related through their variances, so a nested `any` reaches the
same leaf check):

| counterexample | route | witnesses |
| --- | --- | --- |
| `subDown.direct` | `Subty.top` then `subDown` | direct `any` → `T` |
| `subDown.nested-array` | `Subty.arr subDown` — array covariance | rel-any-nested-array, lib-array-isarray-any, lib-new-array-any, lib-object-values-interface, lib-promise-any-errors (`errors: any[]`) |
| `subDown.callback-param` | `Subty.arrow subDown refl` — parameter contravariance | lib-promise-catch-annotated, lib-promise-any-errors (catch parameter). lib-json-stringify-replacer and lib-string-replace-callback go through a second / rest parameter, not modelled |
| `subDown.message-event` | `Subty.arrow (Subty.record … subDown) refl` — record depth inside parameter contravariance | lib-message-event-default-any |

Not modelled, so not mutated: `new` (the calculus has a constructor *value* with a prototype, used
only on the right of `instanceof`, and no construction); the producers of `any` in the
remaining witnesses — `await`, `yield`, and generic calls inferring `any` — whose
assignability routes are `subDown.direct` and `subDown.nested-array` respectively.
