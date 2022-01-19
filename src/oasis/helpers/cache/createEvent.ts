import type { EventHandlers } from "discordeno";
import type { BotWithCache as _ } from "cache_plugin";

import { events } from "../../cache.ts";

type Values<T> = T[keyof T];

type Variants<Dictionary extends Omit<EventHandlers, "debug">> = Values<
  {
    [Prop in keyof Dictionary]: {
      name: Prop;
      execute: Dictionary[Prop];
    };
  }
>;

export type Event = Variants<Omit<EventHandlers, "debug">>;

export function createEvent(o: Event) {
  events.set(o.name, o);
  return o;
}
