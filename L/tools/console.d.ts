// The one host function the lab gives its cases, so a case can show a value. The tracker serves it as part of the
// library, in lib.es5.d.ts, the way a host's own library declares its functions. The core sees no host at all: it
// compiles against the ES library with every effect deleted, and nothing else.
declare const console: { readonly log: (...values: readonly unknown[]) => void };
