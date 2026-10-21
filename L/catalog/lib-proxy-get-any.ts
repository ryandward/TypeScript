// witness: new Proxy<T>(target, handler): T, but ProxyHandler.get returns any.
const target = { name: 'ann' };
const proxied: { readonly name: string } = new Proxy(target, { get: (): number => 5 });
console.log(proxied.name.toUpperCase());
