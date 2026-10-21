// witness: The await form of the call hole: a discriminant checked before an await is trusted after
// it, while another task replaced the object's state in between.
type Idle = { readonly kind: 'idle' };
type Open = { readonly kind: 'open'; readonly send: (m: string) => number };
type Conn = { readonly state: Idle | Open };

const idle: Idle = { kind: 'idle' };
const conn: Conn = { state: { kind: 'open', send: (m: string) => m.length } };
const tick = (): Promise<number> => new Promise((done) => { setTimeout(done, 10, 0); });

const sendLater = async (c: Conn): Promise<number> =>
  c.state.kind === 'open' ? (await tick()) + c.state.send('hi') : 0;

const closeSoon = async (c: Conn): Promise<Conn> => Object.assign(c, { state: idle });

console.log(await Promise.all([sendLater(conn), closeSoon(conn)]));
export {};
