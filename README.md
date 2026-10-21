# TypeScript-L

This fork is TypeScript 6.0.3, the last release of the compiler written in TypeScript, with L's rules built
into its checker. L is a strict dialect of TypeScript, and its Claude Code hooks are in
[ryandward/L-hooks](https://github.com/ryandward/L-hooks).

Every change the fork makes to TypeScript 6.0.3 is listed in [L/changes.txt](L/changes.txt), and each change
in the checker is tagged `// L:`. Each rule's proof and the programs it cites are in [L/rules/](L/rules/), the
crashes no rule closes yet are in [L/catalog/](L/catalog/), and [L/README.md](L/README.md) explains the layout.

Build the compiler with `npx hereby local`, then run `node L/tools/tracker.mjs` to see where each rule stands.
Microsoft's README for TypeScript itself is in [README.upstream.md](README.upstream.md).
