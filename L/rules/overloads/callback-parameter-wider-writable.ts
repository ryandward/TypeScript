// rejected sound code: A function with two overloads, each true of its body, sorting values whose optional field
// the comparer only reads. It can't go wrong, but L has no overloads.
interface Mapped { generated: number; source?: string }
interface SourceMapped extends Mapped { source: string }
function dedupe(array: readonly string[]): readonly string[]; // rejected here: TS2908
function dedupe<T>(array: readonly T[], equal: (a: T, b: T) => boolean): readonly T[]; // rejected here: TS2908
function dedupe<T>(array: readonly T[], equal?: (a: T, b: T) => boolean): readonly T[] {
  return array.filter((x, i) => {
    const previous = array[i - 1];
    return previous === undefined || !(equal ?? Object.is)(previous, x);
  });
}
function sameGenerated(a: Mapped, b: Mapped): boolean { return a.generated === b.generated; }
const list: SourceMapped[] = [{ generated: 1, source: 'a' }, { generated: 1, source: 'b' }];
console.log(dedupe<SourceMapped>(list, sameGenerated).length);
