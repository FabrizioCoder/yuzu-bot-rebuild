import type { EventHandlers } from "discordeno";

export interface Event<T extends keyof EventHandlers> {
  name: T;
  execute: (...args: Parameters<EventHandlers[T]>) => void | Promise<void> | PromiseLike<void>;
}
