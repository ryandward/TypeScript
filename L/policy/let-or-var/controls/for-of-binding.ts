// A for-of variable is bound by the loop, once per iteration, and the body never assigns it.
for (let host of ["example.com"]) {
  console.log(host.toUpperCase());
}
