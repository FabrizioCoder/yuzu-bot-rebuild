// exporting all the modules to get a clear import/from './utils/mod.ts'
export * from "./constants/categories.ts";
export * from "./constants/options.ts";
export * from "./constants/time.ts";
export * from "./constants/mentions.ts";

// our cache
export * from "./handlers/cache.ts";
export * from "./handlers/handler.ts";
export * from "./handlers/registerTasks.ts";

export * from "./collectors/needButton.ts";
export * from "./collectors/needMessage.ts";

export function range(start: number, stop: number = start, step = 1) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + (i * step),
  );
}

export function randomHex() {
  return Math.floor(Math.random() * 16777215);
}

export function sum(nums: number[]): number {
  if (!nums[0]) return 0;
  return nums[0] + sum(nums.slice(1));
}

export function multiply(nums: number[]): number {
  if (!nums[0]) return 0;
  return nums[0] * multiply(nums.slice(1));
}

export function mean(nums: number[]) {
  return sum(nums) / nums.length;
}

export function splitMessage(n: number, limit = 2048): number[] {
  const rest = n - limit;
  if (rest > limit) {
    return [limit, splitMessage(rest, limit)].flat();
  }
  return [limit, rest].flat();
}

// say command
export const isInvite = (str: string) =>
  /(https:\/\/)?.*(discord.*\.?g.*g.*|invite\/*)\/?.+/igm.test(str);

// check for spam
export const isURL = (str: string) =>
  /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/
    .test(str);

// check if the string is an emoji
export const isCustomEmoji = (str: string) =>
  /^<([a]?):.*[a-z0-9]:\d{18}>/i.test(str);

// prefix command
// deno-lint-ignore-line no-control-regexp
export const isNotAscii = (str: string) => /[^\x00-\x7F]+/g.test(str);
