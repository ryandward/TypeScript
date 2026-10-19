# TypeScript-L

This fork is TypeScript 6.0.3, the last release of the compiler written in TypeScript, with L's rules built
into its checker. L is a strict dialect of TypeScript, and its Claude Code hooks are in
[ryandward/L-hooks](https://github.com/ryandward/L-hooks).

The checker changes are tagged `// L:` in `src/compiler/checker.ts`. Each rule's test programs, and a
`rule.txt` describing it, are in [L/](L/):

- [L/soundness/mutable-array-or-tuple](L/soundness/mutable-array-or-tuple)
- [L/soundness/write-into-an-object](L/soundness/write-into-an-object)
- [L/policy/let-or-var](L/policy/let-or-var)

Build the compiler with `npx hereby local`, then run `node L/tracker.mjs` to see where each rule stands.
Microsoft's README for TypeScript itself is in [README.upstream.md](README.upstream.md).
