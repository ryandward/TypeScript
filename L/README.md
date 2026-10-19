# L lab

This fork of TypeScript 6.0.3 is where L's rules get formalized as checker patches before they are
ported to typescript-go. Everything L-specific lives in this folder. The patches themselves live in
`src/compiler` and `src/lib`, each tagged with a comment naming the rule it serves, as in
`// L (soundness/mutable-array-or-tuple): ...`.

## Layout

Each rule has a folder at `<type>/<rule-label>/`, named with L's rule label. The type says what kind of
rule it is: `soundness/`, `policy/`, `information/` or `project/` (each folder's README describes its
type). Inside a rule's folder, a case's place says what the case must do:

- `<witness>.ts` is a hole: the 6.0.3 release accepts it, and Node throws when it runs. Witnesses are
  named as L names them: `rel-` for the type relation, `flow-` for narrowing, `chk-` for other checks,
  and `lib-` for library declarations.
- `controls/<case>.ts` is a program the lab must keep accepting.
- `rejected-sound-code/<case>.ts` is a safe program that the lab rejects on purpose. Its first comment
  says why.

A line the lab must reject is marked with the diagnostic that its mechanism emits:
`// rejected here: TS2890`. Text after the code, as in `// rejected here: TS2339 on type 'string | number'`,
must also appear in that diagnostic's chain. A rejection only counts when it comes through the mechanism,
so a case rejected for some other reason is broken, not closed. A witness with no marked line is a hole
the lab hasn't closed yet.

## Mechanisms

Each patch is in one compiler subsystem and doesn't reach into the others. The relation decides what may
flow where, flow analysis decides what a reference holds at a point, and node checks reject syntax.

| Diagnostic | Where it comes from | Subsystem |
|---|---|---|
| TS2890 | `relatedBack`: a writable property or index signature whose source type doesn't accept the target's | relation |
| TS2891 | `relateVariances`: a type argument made invariant by a writable position | relation (variance) |
| TS2339 on the getter's declared type | `getFlowTypeOfAccessExpression`: an accessor read isn't narrowed | flow |

## Tools

- `node L/tracker.mjs` runs every case against the release (`lib/typescript.js`), the lab build
  (`built/local/typescript.js`, from `npx hereby local`) and Node. It prints a matrix of where each
  rule stands and exits 1 if any case is broken or any control fails.

## Before a checker edit

Every edit to `checker.ts` states three things, in its commit message:

1. Which subsystem is responsible for the behavior: relation, flow or node checks.
2. Why the fix belongs in that function and nowhere else.
3. Why it doesn't change how unrelated constructs are handled.
