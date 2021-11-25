import { path } from "../../../deps.ts";

export async function handle<T>(
  root: string,
  folder: string,
  fn: (imported: T) => void,
): Promise<void> {
  // slice(8) for removing the scheme: file:///
  const dir = path.join(root.slice(8), folder);

  // reading all of the directories
  for await (const file of Deno.readDir(dir)) {
    // if is a subdirectory
    if (!file.name.endsWith(".ts")) {
      handle(root, path.join(folder, file.name), fn);
    } else {
      const pathToFile = path.join("file:///", dir, file.name);
      const output: { default: T } = await import(pathToFile);

      fn(output.default);
    }
  }
}
