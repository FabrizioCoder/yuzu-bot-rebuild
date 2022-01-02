import type { Event } from "./event.ts";
import type { EventHandlers } from "discordeno";

// ex: Monitor<'messageCreate'>

export interface Monitor<T extends keyof EventHandlers> extends Omit<Event<T>, "name"> {
  // arbitrary name
  name: string;

  ignoreBots: boolean; // if the author is a bot
  isGuildOnly: boolean; // if the monitor is executed on dm

  type?: T; // the monitor event
}
