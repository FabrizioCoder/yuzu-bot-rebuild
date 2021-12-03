import { join } from "https://deno.land/std@0.113.0/path/mod.ts";

async function handle<T>(folder: string, fn: (i: T) => void) {
  const dir = `./src/${folder}`;

  // reading all of the directories
  for await (const file of Deno.readDir(dir)) {
    // if is a subdirectory
    if (!file.name.endsWith(".ts")) {
      handle(join(folder, file.name), fn);
      continue;
    }
    const output: { default: T } = await import(`../../${folder}/${file.name}`);
    if (output.default) fn(output.default);
  }
}

export { handle };
