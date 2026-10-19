// MessageEvent<T = any>: the event map uses MessageEvent<any>, so a listener may claim any T.
const channel: MessageChannel = new MessageChannel();
channel.port2.addEventListener('message', (ev: MessageEvent<{ readonly n: number }>) => { // rejected here: TS2898
  console.log(ev.data.n.toFixed(1));
  channel.port2.close();
});
channel.port2.start();
channel.port1.postMessage('just a string');
