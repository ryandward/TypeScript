// witness: TimerHandler = string | Function, so any callback shape is accepted and called with no arguments.
const shout = (word: string): string => word.toUpperCase();
setTimeout(shout, 0);
