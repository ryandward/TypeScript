// witness: A class held as Function is called without new, and Function's type has no signature to check the call
// against.
class Job {
  readonly id: string = "j";
}
const run: Function = Job;
run();
