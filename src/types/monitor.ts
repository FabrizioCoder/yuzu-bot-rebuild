import type { EventHandlers } from "../../deps.ts";

// T<'messageCreate'>

export type Monitor<T extends keyof EventHandlers> = {
  // arbitrary name
  name: string;

  ignoreBots: boolean; // if the author is a bot
  ignoreDM: boolean; // if the monitor is executed on dm

  disabled?: boolean;
  kind?: T; // the monitor event
  execute: (
    ...args: Parameters<EventHandlers[T]>
  ) => void | Promise<void>;
};
