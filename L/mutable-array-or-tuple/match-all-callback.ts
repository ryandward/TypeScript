// control: A library callback whose parameter is a mutable array, as matchAll hands it over.
console.log(Array.from('a b'.matchAll(/\w+/g), (m) => m[0]).join(','));
