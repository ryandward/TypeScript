# L lab

This fork of TypeScript 6.0.3 is where L's rules get formalized as checker patches before they are
ported to typescript-go. Everything L-specific lives in this folder. The patches themselves live in
`src/compiler` and `src/lib`, each tagged with a comment naming the rule it serves, as in
`// L (soundness/mutable-array-or-tuple): ...`.

## Layout

Each rule has a folder at `<type>/<rule-label>/`, named with L's rule label. The type says what kind of
rule it is: `soundness/`, `policy/`, `information/` or `project/` (each folder's README describes its
type). Each rule's own README.md says what L's hook rejects, the hole if there is one, what the lab
decided and where in the checker it's enforced, what it rejects on purpose, what's still open, and the
commits behind it. Inside a rule's folder, a case's place says what the case must do:

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
| TS2892 | `checkGrammarVariableDeclaration`: a `let` or `var` declared without an initializer | node checks (policy) |
| TS2893 | `checkIdentifier`'s assignment target check: an assignment to any variable after its declaration | node checks (policy) |

## Tools

- `node L/tracker.mjs` runs every case against the release (`lib/typescript.js`), the lab build
  (`built/local/typescript.js`, from `npx hereby local`) and Node. It prints a matrix of where each
  rule stands and exits 1 if any case is broken or any control fails.
- `node L/compare.mjs <tsconfig.json> ...` lists what the lab rejects in a project that the release
  accepts, on lines changed since the merge base with main, each with the L mechanism in its chain.
  Rejections with none are listed first. The project is only type-checked; nothing in it runs. We use
  other projects this way to find diagnostics, never to work on them, and we never hold TypeScript's own
  codebase to L.

Where the lab stands today, what got decided and what comes next is in `status.txt`.

## How every checker edit is held

- Locality. Each patch stays in one subsystem. Soundness and variance belong in the type relation and
  never touch flow analysis or narrowing. Flow and narrowing belong in flow analysis and never change
  declared types. Policy rejections belong in node checks and never touch the relation. An edit for
  mutability that lands in flow-narrowing or null-checking code is wrong.
- Proof of mechanism. A witness only counts as closed if the lab rejects it for the reason the rule
  exists, with that rule's own diagnostic, traced to the code that was changed. The tracker enforces this
  through the code in each marker.
- Before the edit. Every edit to `checker.ts` states three things in its commit message: which subsystem
  is responsible for the behavior, why the fix belongs in that function and nowhere else, and why it
  doesn't change how unrelated constructs are handled.

## Standing rules

- No exemptions. When a library contract collides with a rule, we fix our own model, or stop and report
  it when the library's contract forces the relation. TypeScript's own lib can be patched where it
  declares writable something nothing writes.
- Known false positives never stay in the compiler, and nothing gets built on top of one.
- No spreads, no acronyms in names, and one case per file.
