// control: A Date the shell hands in keeps its type and the methods that read only the value itself: its time
// since the epoch and its parts in UTC.
const describe = (when: Date): string => `${when.getTime()} ${when.getUTCHours()} ${when.toISOString()}`;
console.log(typeof describe);
