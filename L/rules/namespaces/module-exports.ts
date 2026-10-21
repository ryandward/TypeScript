// control: A module's own exports take a namespace's place: they are assigned once, in the order the module runs.
export const area = (r: number): number => r * r * 3;
export const perimeter = (r: number): number => r * 6;
console.log(area(2), perimeter(2));
