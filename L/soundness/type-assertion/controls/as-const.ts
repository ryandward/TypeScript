// 'as const' makes a literal's type exact and readonly; it claims nothing the literal doesn't show.
const modes = ['read', 'write'] as const;
console.log(modes.join(','));
