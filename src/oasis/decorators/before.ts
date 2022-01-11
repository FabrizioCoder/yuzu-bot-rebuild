import type { Context } from "../types/command.ts";

export function Before<T extends boolean = true>(fn: (ctx: Context<T>) => void) {
  return function (_target: object, _key: string, descriptor: PropertyDescriptor) {
    const origin = descriptor.value;

    descriptor.value = function (...args: [Context<T>, ...any[]]) {
      fn(args[0]);
      const result = origin.apply(this, args);
      return result;
    };
  };
}
