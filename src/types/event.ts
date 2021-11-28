import type { EventHandlers } from "../../deps.ts";

export type Event<T extends keyof EventHandlers = keyof EventHandlers> = {
  disabled?: boolean;
  name: T;
  execute: (
    ...args: Parameters<EventHandlers[T]>
  ) => void | Promise<void>;
};
