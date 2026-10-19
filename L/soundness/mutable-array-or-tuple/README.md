# mutable-array-or-tuple

## What L says

L's rules list mutable arrays and tuples under writes. The hook rejects any name whose type is a mutable
array or tuple ("which allows push and splice"), and asks for `readonly T[]` or `readonly [A, B]` instead.

## The hole

TypeScript treats every array and tuple as covariant in its element type: `getVariances` short-circuits them
to `arrayVariances` without measuring them. So `string[]` passes as `(string | number)[]`, the wider name
pushes a number, and the original holds a number its type says can't be there. `rel-array-covariance.ts` is
the plain case, and the other witnesses take the same swap through an argument, a return, a generic call, a
nested property, a literal bound to a name first, and a tuple element.

## What the lab decided

A readonly array or tuple stays covariant, because nothing can be written through it. A mutable one is
invariant in its element type wherever a value flows into a slot, because the slot's wider name can write
into it.

- `valueAssignableRelation` is used only where a value flows: initializers, assignments, returns, properties,
  for-of, `satisfies`, `yield`, and call arguments. Type-level questions (conditional types, constraints,
  inference) keep `assignableRelation` and TypeScript's own answers.
- `getVariances(type, relation)` keeps `arrayVariances` for `ReadonlyArray` and readonly tuples under the
  value relation, and measures `Array` like any other generic, where its writable index signature makes it
  invariant. Variances are cached per relation, so a value's variance never answers a type-level question.
- A mutable tuple is compared element by element, and its writable number index signature goes through
  `relatedBack`, so widening an element is rejected with TS2890.
- When a type argument fails because a writable position made it invariant, `relateVariances` reports TS2891
  above the structural elaboration, naming the type and the type argument.
- An array literal is held by nothing else, so `isUnaliasedLiteral` lets it relate with the variances a
  type-level question uses, and a tuple literal skips the index-signature back-check. The literal's own type
  is never changed.
- A rest parameter's argument list relates as readonly (`SignatureCheckMode.FreshArguments`, `argumentList`),
  because every call makes a new list.
- TypeScript's lib declares every built-in `entries()` tuple readonly in the lab, since each step makes a new
  array that nothing writes.
- When more than three overloads fail, only one is reported. The lab reports the one type-level
  assignability accepts, which is the overload the release would have chosen, so its TS2891 shows.

## What it rejects on purpose

These are in `rejected-sound-code/`, each with its reason:

- a parameter typed `unknown[]` that only reads, since nothing in its type says it won't write;
- `concat`, because lib.es5.d.ts declares `ConcatArray<T>.slice(): T[]`, a mutable array in return position;
- a `slice()` result passed on, since the checker only sees a function result, which another name may hold.

The fix in our code is to declare what's true: `readonly unknown[]`, or the source with the element type its
consumer takes.

## Open

Nothing.

## Commits

931689677, 89beff3af, fadc61c80, e5795182f, 3b5956834
