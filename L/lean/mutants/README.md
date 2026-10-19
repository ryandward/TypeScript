# Mutants

Each `.rule` file is one typing rule that TypeScript has and L removes: an `any` permission,
written for `Top`. `check.sh` inserts it into `HasType` and requires the proof of `sound` to
fail. A mutant that still proves means the theorem never depended on that rule's absence.

| mutant | TypeScript rule (checker.ts) | witness (any finding) | obligation |
| --- | --- | --- | --- |
| projTop | property read off `any` is `any` — `isAnyLike` branch of `checkPropertyAccessExpressionOrQualifiedName` | chk-property-off-any.ts, chk-destructure-any.ts | TS2900 |
| elemTop | element read off `any` — same branch, `checkElementAccessExpression` | chk-element-off-any.ts | TS2900 |
| appTop | call on `any` returns `any` — `isUntypedFunctionCall` → `resolveUntypedCall` | chk-call-any.ts, chk-tagged-template-any.ts | TS2900 |
| iterTop | `for-of` over `any` yields `any` — `checkIteratedTypeOrElementType` | chk-iterate-any.ts | TS2900 |
| spreadTop | spread of `any` is `any[]` — `checkIteratedTypeOrElementType` | chk-spread-any.ts | TS2900 |
| inTop | `in` with `any` on the right — `checkInExpression` | chk-in-any.ts | TS2900 |
| instOfTop | `instanceof` with `any` on the right — `resolveInstanceofExpression` | chk-instanceof-any.ts | TS2900 |
| subDown | `any` is assignable to every type — `isSimpleTypeRelatedTo`, source `any` | rel-* (direct) | TS2898 |
| subArr | `any[]` is assignable to `T[]` — the same, nested through Array's covariance | rel-any-nested-array.ts, lib-array-isarray-any.ts, lib-new-array-any.ts | TS2898 |

Not modelled, so not mutated: `new` (no constructors in the calculus); `Promise<any>` (no
promise type; `subArr` is the nested case for the one container the calculus has).
