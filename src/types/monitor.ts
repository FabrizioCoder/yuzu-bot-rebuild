import type { EventHandlers } from "../../deps.ts";

// T<'messageCreate'>

export interface Monitor<T extends keyof EventHandlers = keyof EventHandlers> {
  // arbitrary name
  name: string;

  ignoreBots: boolean; // if the author is a bot
  ignoreDM: boolean; // if the monitor is executed on dm

  disabled?: boolean;
  type?: T; // the monitor event
  execute: (
    ...args: Parameters<EventHandlers[T]>
  ) => void | Promise<void>;
}
