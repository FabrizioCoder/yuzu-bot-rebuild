import { dirname, fromFileUrl, join, relative, resolve } from "path";

// TODO: make the root directory configurable (line 7)

export async function load<T>(dir: string, fn: (file: T) => void) {
  // getting the absolute path of the given directory
  const fromRoot = resolve("./src/bot/", dir);

  // read all of the files inside
  for await (const file of Deno.readDir(fromRoot)) {
    // if is a directory file recursively read all of the files inside the directory/subdirectory
    if (file.isDirectory) {
      load(join(dir, file.name), fn);
      continue;
    }
    // otherwise read from the path of this file to the absolute path of the given directory
    // this should give us a relative path coming from an absolute path
    const mod = join(relative(dirname(fromFileUrl(import.meta.url)), fromRoot), file.name);
    const { default: struct }: { default?: T } = await import(mod.replace("\\", "/"));

    // if the file has a default export finally respond the callback
    if (struct) {
      fn(struct);
    }
  }
}

export { load as loadFilesFromFolder };
