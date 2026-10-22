// rejected sound code: The program only asks what at is, and never calls it, but a read that doesn't call an
// instance's method takes it off its object.
const at = [1].at; // rejected here: TS2924
console.log(typeof at);
