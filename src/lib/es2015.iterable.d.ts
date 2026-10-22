/// <reference lib="es2015.symbol" />

interface SymbolConstructor {
    /**
     * A method that returns the default iterator for an object. Called by the semantics of the
     * for-of statement.
     */
    readonly iterator: unique symbol;
}

// L: iterator results and built-in entries() tuples are readonly, since each is new and nothing writes it.
// L: a plain object the engine builds, with own enumerable data properties, is declared as a type literal, which a
// record type and a spread treat as data; an interface describes an engine object, whose members aren't.
type IteratorYieldResult<TYield> = {
    readonly done?: false;
    readonly value: TYield;
};

type IteratorReturnResult<TReturn> = {
    readonly done: true;
    readonly value: TReturn;
};

type IteratorResult<T, TReturn = any> = IteratorYieldResult<T> | IteratorReturnResult<TReturn>;

interface Iterator<T, TReturn = any, TNext = any> {
    // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
    next(...[value]: [] | [TNext]): IteratorResult<T, TReturn>;
    // L: return and throw stay declared, so for-of, which calls return when a loop breaks, never meets one that isn't a
    // function. They take never: a TReturn taken in would make TReturn invariant, and the core drives no iterator by hand.
    return?(value: never): IteratorResult<T, unknown>;
    throw?(e: never): IteratorResult<T, unknown>;
}

interface Iterable<T, TReturn = any, TNext = any> {
    [Symbol.iterator](): Iterator<T, TReturn, TNext>;
}

/**
 * Describes a user-defined {@link Iterator} that is also iterable.
 */
interface IterableIterator<T, TReturn = any, TNext = any> extends Iterator<T, TReturn, TNext> {
    [Symbol.iterator](): IterableIterator<T, TReturn, TNext>;
}

/**
 * Describes an {@link Iterator} produced by the runtime that inherits from the intrinsic `Iterator.prototype`.
 */
interface IteratorObject<T, TReturn = unknown, TNext = unknown> extends Iterator<T, TReturn, TNext> {
    [Symbol.iterator](): IteratorObject<T, TReturn, TNext>;
}

/**
 * Defines the `TReturn` type used for built-in iterators produced by `Array`, `Map`, `Set`, and others.
 * This is `undefined` when `strictBuiltInIteratorReturn` is `true`; otherwise, this is `any`.
 */
type BuiltinIteratorReturn = intrinsic;

interface ArrayIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
    [Symbol.iterator](): ArrayIterator<T>;
}

interface Array<T> {
    /** Iterator */
    [Symbol.iterator](): ArrayIterator<T>;

    /**
     * Returns an iterable of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<readonly [number, T]>;

    /**
     * Returns an iterable of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an iterable of values in the array
     */
    values(): ArrayIterator<T>;
}

interface ArrayConstructor {
    /**
     * Creates an array from an iterable object.
     * @param iterable An iterable object to convert to an array.
     */
    from<T>(iterable: Iterable<T>): T[]; // L: an array-like goes to es2015.core's from, whose places may hold nothing

    /**
     * Creates an array from an iterable object.
     * @param iterable An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T, U>(iterable: Iterable<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[]; // L: the same

    // L: a string is no Iterable, since no primitive is a value of an object type, so from takes it as itself, and
    // the engine iterates it by code point.
    /**
     * Creates an array of a string's code points.
     * @param source The string to take apart.
     */
    from(source: string): string[];

    /**
     * Creates an array of a string's code points, mapped.
     * @param source The string to take apart.
     * @param mapfn A mapping function to call on every code point.
     */
    from<U>(source: string, mapfn: (v: string, k: number) => U): U[];
}

interface ReadonlyArray<T> {
    /** Iterator of values in the array. */
    [Symbol.iterator](): ArrayIterator<T>;

    /**
     * Returns an iterable of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<readonly [number, T]>;

    /**
     * Returns an iterable of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an iterable of values in the array
     */
    values(): ArrayIterator<T>;
}

interface IArguments {
    /** Iterator */
    [Symbol.iterator](): ArrayIterator<any>;
}

interface MapIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
    [Symbol.iterator](): MapIterator<T>;
}

interface Map<K, V> {
    /** Returns an iterable of entries in the map. */
    [Symbol.iterator](): MapIterator<readonly [K, V]>;

    /**
     * Returns an iterable of key, value pairs for every entry in the map.
     */
    entries(): MapIterator<readonly [K, V]>;

    /**
     * Returns an iterable of keys in the map
     */
    keys(): MapIterator<K>;

    /**
     * Returns an iterable of values in the map
     */
    values(): MapIterator<V>;
}

interface ReadonlyMap<K, V> {
    /** Returns an iterable of entries in the map. */
    [Symbol.iterator](): MapIterator<readonly [K, V]>;

    /**
     * Returns an iterable of key, value pairs for every entry in the map.
     */
    entries(): MapIterator<readonly [K, V]>;

    /**
     * Returns an iterable of keys in the map
     */
    keys(): MapIterator<K>;

    /**
     * Returns an iterable of values in the map
     */
    values(): MapIterator<V>;
}

interface MapConstructor {
    new (): Map<any, any>;
    new <K, V>(iterable?: Iterable<readonly [K, V]> | null): Map<K, V>;
}

interface WeakMap<K extends WeakKey, V> {}

interface WeakMapConstructor {
    new <K extends WeakKey = WeakKey, V = any>(iterable?: Iterable<readonly [K, V]> | null): WeakMap<K, V>;
}

interface SetIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
    [Symbol.iterator](): SetIterator<T>;
}

interface Set<T> {
    /** Iterates over values in the set. */
    [Symbol.iterator](): SetIterator<T>;

    /**
     * Returns an iterable of [v,v] pairs for every value `v` in the set.
     */
    entries(): SetIterator<readonly [T, T]>;

    /**
     * Despite its name, returns an iterable of the values in the set.
     */
    keys(): SetIterator<T>;

    /**
     * Returns an iterable of values in the set.
     */
    values(): SetIterator<T>;
}

interface ReadonlySet<T> {
    /** Iterates over values in the set. */
    [Symbol.iterator](): SetIterator<T>;

    /**
     * Returns an iterable of [v,v] pairs for every value `v` in the set.
     */
    entries(): SetIterator<readonly [T, T]>;

    /**
     * Despite its name, returns an iterable of the values in the set.
     */
    keys(): SetIterator<T>;

    /**
     * Returns an iterable of values in the set.
     */
    values(): SetIterator<T>;
}

interface SetConstructor {
    new <T>(iterable?: Iterable<T> | null): Set<T>;
}

interface WeakSet<T extends WeakKey> {}

interface WeakSetConstructor {
    new <T extends WeakKey = WeakKey>(iterable: Iterable<T>): WeakSet<T>;
}

interface Promise<out T> {}

interface PromiseConstructor {
    /**
     * Creates a Promise that is resolved with an array of results when all of the provided Promises
     * resolve, or rejected when any Promise is rejected.
     * @param values An iterable of Promises.
     * @returns A new Promise.
     */
    all<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;

    /**
     * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
     * or rejected.
     * @param values An iterable of Promises.
     * @returns A new Promise.
     */
    race<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
}

interface StringIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
    [Symbol.iterator](): StringIterator<T>;
}

interface String {
    /** Iterator */
    [Symbol.iterator](): StringIterator<string>;
}

interface Int8Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<readonly [number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Int8ArrayConstructor {
    new (elements: Iterable<number>): Int8Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Int8Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Int8Array<ArrayBuffer>;
}

interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<readonly [number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Uint8ArrayConstructor {
    new (elements: Iterable<number>): Uint8Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Uint8Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Uint8Array<ArrayBuffer>;
}

interface Uint8ClampedArray<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<readonly [number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Uint8ClampedArrayConstructor {
    new (elements: Iterable<number>): Uint8ClampedArray<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Uint8ClampedArray<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Uint8ClampedArray<ArrayBuffer>;
}

interface Int16Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;
    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<readonly [number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Int16ArrayConstructor {
    new (elements: Iterable<number>): Int16Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Int16Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Int16Array<ArrayBuffer>;
}

interface Uint16Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<readonly [number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Uint16ArrayConstructor {
    new (elements: Iterable<number>): Uint16Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Uint16Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Uint16Array<ArrayBuffer>;
}

interface Int32Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<readonly [number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Int32ArrayConstructor {
    new (elements: Iterable<number>): Int32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Int32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Int32Array<ArrayBuffer>;
}

interface Uint32Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<readonly [number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Uint32ArrayConstructor {
    new (elements: Iterable<number>): Uint32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Uint32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Uint32Array<ArrayBuffer>;
}

interface Float32Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<readonly [number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Float32ArrayConstructor {
    new (elements: Iterable<number>): Float32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Float32Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Float32Array<ArrayBuffer>;
}

interface Float64Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;

    /**
     * Returns an array of key, value pairs for every entry in the array
     */
    entries(): ArrayIterator<readonly [number, number]>;

    /**
     * Returns an list of keys in the array
     */
    keys(): ArrayIterator<number>;

    /**
     * Returns an list of values in the array
     */
    values(): ArrayIterator<number>;
}

interface Float64ArrayConstructor {
    new (elements: Iterable<number>): Float64Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     */
    from(elements: Iterable<number>): Float64Array<ArrayBuffer>;

    /**
     * Creates an array from an array-like or iterable object.
     * @param elements An iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Float64Array<ArrayBuffer>;
}
