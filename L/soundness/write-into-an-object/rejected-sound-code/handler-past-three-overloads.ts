// A handler typed against a request whose writable field is optional, passed where the request's field is required:
// through its parameter it could delete it, as connect's handlers could in Express. It only reads. Four
// overloads fail, and the one reported is the overload the release would have chosen, so the rejection shows its
// writable field instead of the last overload's path mismatch.
interface IncomingRequest { url?: string }
interface RoutedRequest extends IncomingRequest { url: string }
type Handler = (req: RoutedRequest) => void;
function use(...handlers: Handler[]): number;
function use(path: string, ...handlers: Handler[]): number;
function use(path: RegExp, ...handlers: Handler[]): number;
function use(path: readonly string[], ...handlers: Handler[]): number;
function use(...args: readonly unknown[]): number {
  return args.length;
}
const readUrl = (req: IncomingRequest): void => { console.log(req.url ?? "none"); };
console.log(use(readUrl)); // rejected here: TS2894
