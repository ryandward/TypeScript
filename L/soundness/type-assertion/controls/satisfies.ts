// 'satisfies' checks a value against a type instead of asserting it.
const config = { port: 8080 } satisfies { readonly port: number };
console.log(config.port + 1);
