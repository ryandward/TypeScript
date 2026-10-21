// witness: isUsedInFunctionOrInstanceProperty: a use inside any non-IIFE function counts as deferred.
const banner: string = render();
const PREFIX = "v";
function render(): string {
  return PREFIX.toUpperCase();
}
console.log(banner);
