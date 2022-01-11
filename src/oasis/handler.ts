import { resolve, join, relative, dirname, fromFileUrl } from "path";

export async function load(root: string, dir: string) {
  // getting the absolute path of the given directory
  const rootDir = resolve(root, dir);

  handler: for await (const file of Deno.readDir(rootDir)) {
    // if is a directory recursively read all of the files inside the directory/subdirectory
    if (file.isDirectory) {
      await load(root, join(dir, file.name));
      continue handler;
    }
    // otherwise read from the path of this file to the absolute path of the given directory
    // this should give us a relative path coming from an absolute path
    const rel = join(relative(dirname(fromFileUrl(import.meta.url)), rootDir), file.name);
    const mod = await import(rel.replace("\\", "/")).catch(() => {});
    mod;
  }
}

export function loadFilesFromBot(dir: string) {
  return load("./src/bot", dir);
}
