// control: instanceof true proves the value came from the constructor, so the true branch narrows.
const describe = (e: unknown): string => (e instanceof Error ? e.message : 'not an error');
console.log(describe(new Error('boom')), describe('plain'));
