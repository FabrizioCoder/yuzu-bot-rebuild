import { join, resolve } from "path";

export async function load<T>(root: string, dir: string, fn: (f: T) => void) {
  // getting the absolute path of the given directory
  const rootDir = resolve(root, dir);

  for await (const file of Deno.readDir(rootDir)) {
    // if is a directory recursively read all of the files inside the directory/subdirectory
    if (file.isDirectory) {
      await load(root, join(dir, file.name), fn);
      continue;
    }
    // finally execute the file
    const { default: struct }: { default?: T } = await import(join("file:///", rootDir, file.name));

    if (struct) fn(struct);
  }
}

export function loadFilesFromSource<T>(dir: string, fn: (f: T) => void) {
  return load("./src/", dir, fn);
}

export function loadFilesFromRoot<T>(root: string, dir: string, fn: (f: T) => void) {
  return load(root, dir, fn);
}

export function loadFilesFromBot<T>(dir: string, fn: (f: T) => void) {
  return load("./src/bot", dir, fn);
}

export function loadFilesFromHandler<T>(dir: string, fn: (f: T) => void) {
  return load(".", dir, fn);
}
