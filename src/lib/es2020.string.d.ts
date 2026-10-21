/// <reference lib="es2015.iterable" />
/// <reference lib="es2020.intl" />
/// <reference lib="es2020.symbol.wellknown" />

// L: the core performs no effects, so this file declares nothing that reads the machine's locale.
interface String {
    /**
     * Matches a string with a regular expression, and returns an iterable of matches
     * containing the results of that search.
     * @param regexp A regular expression
     */
    matchAll(regexp: string): RegExpStringIterator<RegExpExecArray>; // L: a RegExp without the g flag throws, so only a string, which matchAll makes global
}
