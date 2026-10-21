// control: A union of two classes whose constructors are overloaded differently has no construct signature of its
// own, but each member has one, so each promises a prototype.
class Parsed {
  constructor(text: string);
  constructor(code: number);
  constructor(input: string | number) {
    console.log(input);
  }
}
class Flagged {
  constructor(flag: boolean);
  constructor(count: bigint);
  constructor(input: boolean | bigint) {
    console.log(input);
  }
}
const useParsed: boolean = 'x'.length > 0;
const pick: typeof Parsed | typeof Flagged = useParsed ? Parsed : Flagged;
const value: object = new Parsed('x');
console.log(value instanceof pick);
