import { join } from "https://deno.land/std@0.113.0/path/mod.ts";

async function handle<T>(dir: string, fn: (i: T) => void) {
  // reading all of the directories
  for await (const file of Deno.readDir(`./src/${dir}`)) {
    // if is a subdirectory
    if (!file.name.endsWith(".ts")) {
      handle(join(dir, file.name), fn);
      continue;
    }
    const struct: { default?: T } = await import(`../../${dir}/${file.name}`);
    if (struct.default) fn(struct.default);
  }
}

export { handle };