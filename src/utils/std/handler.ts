import { dirname, fromFileUrl, join, relative, resolve } from "path";

export async function load<T>(root: string, dir: string, fn: (file: T) => void) {
  // getting the absolute path of the given directory
  const fromRoot = resolve(root, dir);

  // read all of the files inside
  for await (const file of Deno.readDir(fromRoot)) {
    // if is a directory recursively read all of the files inside the directory/subdirectory
    if (file.isDirectory) {
      await load(root, join(dir, file.name), fn);
      continue;
    }
    // otherwise read from the path of this file to the absolute path of the given directory
    // this should give us a relative path coming from an absolute path
    const mod = join(relative(dirname(fromFileUrl(import.meta.url)), fromRoot), file.name);
    const { default: struct }: { default?: T } = await import(mod.replace("\\", "/"));

    // if the file has a default export finally execute the callback
    if (struct) fn(struct);
  }
}

export function loadFilesFromSource<T>(dir: string, fn: (file: T) => void) {
  return load("./src/", dir, fn);
}

export function loadFilesFromRoot<T>(root: string, dir: string, fn: (file: T) => void) {
  return load(root, dir, fn);
}

export function loadFilesFromBot<T>(dir: string, fn: (file: T) => void) {
  return load("./src/bot", dir, fn);
}

export function loadFilesFromHandler<T>(dir: string, fn: (file: T) => void) {
  return load(".", dir, fn);
}
