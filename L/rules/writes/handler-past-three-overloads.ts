// control: A handler typed against a request whose field is optional, passed where the field is required, past four
// overloads. With nothing deleted, the handler only reads.
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
console.log(use(readUrl));
