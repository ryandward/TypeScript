// Literals inside a literal: the array in each row is fresh too, so nothing else holds it.
const rows: { tags: (string | number)[] }[] = [{ tags: ['a'] }];
for (const row of rows) row.tags.push(1);
console.log(rows.map((row) => row.tags.join(',')).join(';'));
