// witness: A namespace's first block calls a function from its second block before that block has run.
namespace Config { // rejected here: TS2906
  export const banner: string = describe(); // rejected here: TS2912
}
namespace Config { // rejected here: TS2906
  export const name: string = "app";
  export function describe(): string {
    return name.toUpperCase();
  }
}
console.log(Config.banner);
