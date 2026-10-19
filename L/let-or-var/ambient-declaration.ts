// control: An ambient declaration describes a global that may already exist, as `declare var console: Console` does in
// TypeScript's own lib. It makes no binding, so it has no initializer.
declare var configuredHost: string | undefined;
console.log(typeof configuredHost);
