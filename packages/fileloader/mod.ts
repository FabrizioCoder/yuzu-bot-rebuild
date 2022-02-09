import { dirname, fromFileUrl, join, relative, resolve } from "https://deno.land/std@0.119.0/path/mod.ts";

type RecursiveF<T> = AsyncGenerator<T, void | RecursiveF<T>>;

export async function* load<T extends { default: unknown }>(root: string, dir: string): RecursiveF<T> {
  // getting the absolute path of the given directory
  const rootDir = resolve(root, dir);

  handler: for await (const file of Deno.readDir(rootDir)) {
    // if is a directory recursively read all of the files inside the directory/subdirectory
    if (file.isDirectory) {
      yield* load(root, join(dir, file.name));
      continue handler;
    }
    // otherwise read from the path of this file to the absolute path of the given directory
    // this should give us a relative path coming from an absolute path
    const rel = join(relative(dirname(fromFileUrl(import.meta.url)), rootDir), file.name);
    const mod = await import(rel.replace("\\", "/"));
    yield mod as T;
  }
}

export async function loadEverything<T extends { default: unknown }>(root: string, dirs: string[]): Promise<T[]> {
  const output = [] as T[];

  for (const dir of dirs) {
    for await (const mod of load<T>(root, dir)) output.push(mod);
  }

  return output;
}
