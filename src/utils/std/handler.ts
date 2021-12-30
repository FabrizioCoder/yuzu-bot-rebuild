import { resolve, join, relative, dirname, fromFileUrl } from "path";

export async function load<T>(root: string, dir: string, fn: (f: T) => void) {
  // getting the absolute path of the given directory
  const rootDir = resolve(root, dir);

  for await (const file of Deno.readDir(rootDir)) {
    // if is a directory recursively read all of the files inside the directory/subdirectory
    if (file.isDirectory) {
      await load(root, join(dir, file.name), fn);
      continue;
    }
    // otherwise read from the path of this file to the absolute path of the given directory
    // this should give us a relative path coming from an absolute path
    const rel = join(relative(dirname(fromFileUrl(import.meta.url)), rootDir), file.name);
    const mod = await import(rel.replace("\\", "/"));

    if (mod.default) fn(mod.default);
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
