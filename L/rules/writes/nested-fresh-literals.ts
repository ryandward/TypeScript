// rejected sound code: Literals inside a literal, each row written through the wider type: every row is fresh, so
// nothing else holds it. It can't go wrong, but the core changes no object in place.
const rows: { tags: (string | number)[] }[] = [{ tags: ['a'] }];
for (const row of rows) row.tags.push(1); // rejected here: TS2339
console.log(rows.map((row) => row.tags.join(',')).join(';'));
