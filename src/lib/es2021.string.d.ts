interface String {
    /**
     * Replace all instances of a substring in a string, using a regular expression or search string.
     * @param searchValue A string to search for.
     * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
     */
    replaceAll(searchValue: string, replaceValue: string): string; // L: a RegExp without the g flag throws

    /**
     * Replace all instances of a substring in a string, using a regular expression or search string.
     * @param searchValue A string to search for.
     * @param replacer A function that returns the replacement text.
     */
    replaceAll(searchValue: string, replacer: (substring: string, ...args: any[]) => string): string; // L: the same
}
