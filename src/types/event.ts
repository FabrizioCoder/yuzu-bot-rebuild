import type { EventHandlers } from "../../deps.ts";

export interface Event<T extends keyof EventHandlers> {
  disabled?: boolean;
  name: T;
  execute: (...args: Parameters<EventHandlers[T]>) => void | Promise<void> | PromiseLike<void>;
}
