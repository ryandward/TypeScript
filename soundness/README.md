# Soundness

Holes where TypeScript accepts a program whose types are false, shown by a program that the 6.0.3
release accepts and that throws when it runs. Each folder is named for the L rule that stands at the
hole, and holds:

- `<witness>.ts`: one hole, named as L names its witnesses (`rel-` the type relation, `flow-` narrowing,
  `chk-` other checks, `lib-` library declarations). The line where the patched compiler must reject it
  is marked `// rejected here`. A witness with no marked line is a hole the lab hasn't closed yet.
- `controls.ts`: programs the patch must keep accepting.
- `rejected-sound-code.ts`: safe programs the patch rejects on purpose, each with why.

`node check-witnesses.mjs` holds every folder to that, against the release (`lib/tsc.js`), the lab
build (`built/local/tsc.js`, from `npx hereby local`) and Node.
