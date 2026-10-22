// control: concat never writes into its argument, and takes a readonly list, so string[] passes where a
// readonly (string | number)[] is taken.
const strings: string[] = ['a'];
const sink: (string | number)[] = [];
console.log(sink.concat(strings).join(','));
