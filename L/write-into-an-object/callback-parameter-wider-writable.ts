// rejected sound code: A comparer whose parameter has a writable optional field is handed values whose field is required: through the
// parameter it could delete it. It only reads, but its type grants the write. The subtype pass picks this
// overload, and it must still be rejected as a value.
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
console.log(dedupe<SourceMapped>(list, sameGenerated).length); // rejected here: TS2894
