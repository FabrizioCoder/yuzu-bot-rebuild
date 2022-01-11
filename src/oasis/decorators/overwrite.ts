import type { Context } from "../types/command.ts";

export function OverwriteExecute<T extends boolean = true>(
  cond: (ctx: Context<T>) => boolean,
  fn: (ctx: Context<T>) => any
) {
  return function (_target: object, _key: string, descriptor: PropertyDescriptor) {
    descriptor.value = function (...args: [Context<T>, ...any[]]) {
      if (cond(args[0])) return fn(args[0]);
    };
  };
}
