// Literals inside a literal: the array in each row is fresh too, so nothing else holds it.
const rows: { tags: (string | number)[] }[] = [{ tags: ['a'] }];
rows[0]!.tags.push(1);
console.log(rows[0]!.tags.join(','));
