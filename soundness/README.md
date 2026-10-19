# Soundness

Holes where TypeScript accepts a program whose types are false, shown by a program that the 6.0.3
release accepts and that throws when it runs. Each folder is named for the L rule that stands at the hole, and holds one case per file:

- `<witness>.ts`: one hole, named as L names its witnesses (`rel-` the type relation, `flow-` narrowing,
  `chk-` other checks, `lib-` library declarations). The line where the patched compiler must reject it
  is marked `// rejected here`. A witness with no marked line is a hole the lab hasn't closed yet.
- `controls/<case>.ts`: a program the patch must keep accepting.
- `rejected-sound-code/<case>.ts`: a safe program the patch rejects on purpose, saying why.

`node l-tracker.mjs` runs every case against the release (`lib/tsc.js`), the lab build
(`built/local/tsc.js`, from `npx hereby local`) and Node, and prints where each rule stands.
