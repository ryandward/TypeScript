// control: A comparer whose parameter has an optional field is handed values whose field is required. With nothing
// deleted, the wider type only reads.
interface Mapped { generated: number; source?: string }
interface SourceMapped extends Mapped { source: string }
function dedupe(array: readonly string[]): readonly string[];
function dedupe<T>(array: readonly T[], equal: (a: T, b: T) => boolean): readonly T[];
function dedupe<T>(array: readonly T[], equal?: (a: T, b: T) => boolean): readonly T[] {
  return array.filter((x, i) => {
    const previous = array[i - 1];
    return previous === undefined || !(equal ?? Object.is)(previous, x);
  });
}
function sameGenerated(a: Mapped, b: Mapped): boolean { return a.generated === b.generated; }
const list: SourceMapped[] = [{ generated: 1, source: 'a' }, { generated: 1, source: 'b' }];
console.log(dedupe<SourceMapped>(list, sameGenerated).length);
