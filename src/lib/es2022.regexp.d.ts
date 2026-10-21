interface RegExpMatchArray {
    indices?: RegExpIndicesArray;
}

interface RegExpExecArray {
    indices?: RegExpIndicesArray;
}

interface RegExpIndicesArray extends Array<[number, number] | undefined> {
    groups?: {
        [key: string]: [number, number] | undefined; // L: a group that took no part is undefined
    };
}

interface RegExp {
    /**
     * Returns a Boolean value indicating the state of the hasIndices flag (d) used with a regular expression.
     * Default is false. Read-only.
     */
    readonly hasIndices: boolean;
}
