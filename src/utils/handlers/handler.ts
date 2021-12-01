import { join } from "https://deno.land/std@0.113.0/path/mod.ts";

async function handle<T>(root: string, folder: string, fn: (i: T) => void) {
  // slice(8) for removing the scheme: file:///
  const dir = join(root.slice(8), folder);

  // reading all of the directories
  for await (const file of Deno.readDir(dir)) {
    // if is a subdirectory
    if (!file.name.endsWith(".ts")) {
      handle(root, join(folder, file.name), fn);
      continue;
    }
    const pathToFile = join("file:///", dir, file.name);
    const output: { default: T } = await import(pathToFile);

    fn(output.default);
  }
}

export { handle };
