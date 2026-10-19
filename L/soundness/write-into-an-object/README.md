# write-into-an-object

## What L says

L's rules list assignment into an object under writes. The hook rejects any assignment whose target is a
property or element, as in `o.x = ...` or `o[k] = ...`, and asks for a new value instead.

## The hole

TypeScript relates a property or an index signature in one direction only (`isPropertySymbolTypeRelated`,
`indexInfoRelatedTo`), whether or not the target can write it, and ignores `readonly` outside the strict
subtype relation. So `{ value: string }` passes as `{ value: string | number }`, the wider name stores a
number, and the original holds a number its type says can't be there. The witnesses take this through a
property, an optional property, an index signature, a literal bound to a name first, and a readonly property
written through a mutable alias.

`flow-setter-assign.ts` is a different hole with the same hook rule in front of it. Assigning to a property
narrows the next read to the assigned type, but a setter need not store what it was given.

## What the lab decided

When a value flows into a slot, a writable position relates both ways: the source's type there must also
accept the target's, because the target can store a value of its own type into it.

- A writable position is a property or accessor that isn't readonly (`isWritablePosition`). Methods are left
  out, because method bivariance is a separate decision.
- Every writable position is checked by one helper, `relatedBack`, which reports TS2890: "A value of type
  '{0}' could be written into this position, which holds '{1}'." The shortcut that accepts any type into an
  `any` or `unknown` target doesn't apply at a writable position.
- A source held by nothing else skips the back-check: a fresh object literal, JSX attributes, or an array
  literal (`isUnaliasedLiteral`). A fresh literal stays fresh against each member of a union target.
- Overload resolution checks the subtype pass's winner as a value before accepting it. While
  context-sensitive arguments are skipped, the provisional pass uses plain assignability, because it judges
  stand-ins, not values.
- An accessor read isn't narrowed (`getFlowTypeOfAccessExpression`). This is a flow patch, kept in flow
  analysis. The witness is rejected with whatever its use produces on the getter's declared type, TS2339 on
  `'string | number'` here.
- TypeScript's lib declares iterator results readonly in the lab, since every built-in iterator returns a new
  result object that nothing writes.

## What it rejects on purpose

These are in `rejected-sound-code/`, each with its reason:

- a readonly object passed where its field is writable, even when the receiver only reads;
- a subclass narrowing a field its base declares writable, like `Error.name`;
- a comparer whose parameter has a writable optional field, handed values whose field is required;
- a getter that does return stored state, since nothing in its type says two reads agree;
- a library's phantom fields declared writable, as zod's `input` and `output` are;
- a library's mapped copy of an entity, as TypeORM's update argument is.

## Library contracts

By L's boundary rule, we fix our own model where we can, and stop and report where the library's contract
forces the relation.

- zod: keep each schema's own type instead of widening it to `ZodType<...>`.
- TypeORM's mapped partial turns every method of a Date into a writable property: stop and report.
- connect's `IncomingMessage` declares `originalUrl?` optional and writable, while Express's `Request`
  declares it required, so `app.use(express.json())` is rejected: stop and report.
- The AWS SDK's config declares `httpAgent` as a writable `Agent | AgentOptions`: stop and report.

## Open

When more than three overloads fail, TypeScript reports only the last one, so a TS2890 in an earlier overload
never shows. That's how the Express rejection above looked unexplained. The lab still has to make an overload
failure carry the L failure behind it.

## Commits

931689677, 8b384c9e3, 89beff3af, fadc61c80, e5795182f
