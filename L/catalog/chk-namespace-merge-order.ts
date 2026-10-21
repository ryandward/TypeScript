// witness: A namespace's first block calls a function from its second block before that block has run.
namespace Config {
  export const banner: string = describe();
}
namespace Config {
  export const name: string = "app";
  export function describe(): string {
    return name.toUpperCase();
  }
}
console.log(Config.banner);
