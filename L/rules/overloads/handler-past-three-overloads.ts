// rejected sound code: A handler passed to a function with four overloads, each true of its body, typed against a
// request whose field is optional. It can't go wrong, but L has no overloads.
interface IncomingRequest { url?: string }
interface RoutedRequest extends IncomingRequest { url: string }
type Handler = (req: RoutedRequest) => void;
function use(...handlers: Handler[]): number; // rejected here: TS2908
function use(path: string, ...handlers: Handler[]): number; // rejected here: TS2908
function use(path: RegExp, ...handlers: Handler[]): number; // rejected here: TS2908
function use(path: readonly string[], ...handlers: Handler[]): number; // rejected here: TS2908
function use(...args: readonly unknown[]): number {
  return args.length;
}
const readUrl = (req: IncomingRequest): void => { console.log(req.url ?? "none"); };
console.log(use(readUrl));
