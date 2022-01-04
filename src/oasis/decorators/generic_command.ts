import type { SlashContext } from "../types/command.ts";

export function Stop<T extends boolean = true>(fn: (ctx: SlashContext<T>) => boolean) {
  return function(_target: object, _key: string, descriptor: PropertyDescriptor) {
    const origin = descriptor.value;

    descriptor.value = function(...args: [SlashContext<T>, ...any[]]) {
      const cond = fn(args[0]);

      if (!cond) return origin.apply(this, args);
    }
  }
}

export function Before<T extends boolean = true>(fn: (ctx: SlashContext<T>) => void) {
  return function(_target: object, _key: string, descriptor: PropertyDescriptor) {
    const origin = descriptor.value;

    descriptor.value = function(...args: [SlashContext<T>, ...any[]]) {
      fn(args[0]);
      const result = origin.apply(this, args);
      return result;
    }
  }
}

export function OverwriteExecute<T extends boolean = true>(cond: (ctx: SlashContext<T>) => boolean, fn: (ctx: SlashContext<T>) => any) {
  return function(_target: object, _key: string, descriptor: PropertyDescriptor) {
    descriptor.value = function(...args: [SlashContext<T>, ...any[]]) {
      if (cond(args[0])) return fn(args[0]);
    }
  }
}
