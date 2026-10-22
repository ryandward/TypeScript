// control: A required parameter that takes undefined may be left out: unknown, an optional parameter and a default.
const show: (...xs: readonly unknown[]) => string = (x: unknown) => typeof x;
const orZero: (...xs: readonly number[]) => number = (n?: number) => n ?? 0;
const withDefault: (...xs: readonly number[]) => number = (n = 0) => n;
console.log(show(), show(1), orZero(), withDefault(), withDefault(2));
