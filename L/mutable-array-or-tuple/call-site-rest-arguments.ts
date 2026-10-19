// control: Arguments matched against a tuple rest parameter form a new list that no other name holds.
function configure(...[config]: [] | [{ region: string; endpoint?: string }]): string {
  return config === undefined ? 'none' : config.region;
}
console.log(configure({ region: 'us-east-1' }));
