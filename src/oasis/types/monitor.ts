import type { EventHandlers } from "discordeno";
import type { BotWithCache as _ } from "cache_plugin";

type Values<T> = T[keyof T];

type Variants<Dictionary extends Omit<EventHandlers, "debug">> = Values<
  {
    [Prop in keyof Dictionary]: {
      name: string;
      event: Prop;
      execute: Dictionary[Prop];
      ignoreBots: boolean; // if the author is a bot
      isGuildOnly: boolean; // if the monitor is executed on dm
    };
  }
>;

export type Monitor = Variants<Omit<EventHandlers, "debug">>;
