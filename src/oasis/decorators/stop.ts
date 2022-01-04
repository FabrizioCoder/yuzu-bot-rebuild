import type { Context } from "../types/command.ts";

export function Stop<T extends boolean = true>(fn: (ctx: Context<T>) => boolean) {
  return function(_target: object, _key: string, descriptor: PropertyDescriptor) {
    const origin = descriptor.value;

    descriptor.value = function(...args: [Context<T>, ...any[]]) {
      const cond = fn(args[0]);

      if (!cond) return origin.apply(this, args);
    }
  }
}
