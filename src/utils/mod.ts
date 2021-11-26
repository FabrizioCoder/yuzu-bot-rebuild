// exporting all the modules to get a clear import/from './utils/mod.ts'
export * from "./constants/categories.ts";
export * from "./constants/options.ts";
export * from "./constants/time.ts";

// our cache
export * from "./handlers/cache.ts";
export * from "./handlers/handler.ts";
export * from "./handlers/registerTasks.ts";

export * from "./collectors/needButton.ts";
export * from "./collectors/needMessage.ts";

export function range(start: number, stop: number, step = 1) {
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
