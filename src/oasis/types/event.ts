import type { EventHandlers } from "discordeno";

type Values<T> = T[keyof T];

type Variants<Dictionary extends EventHandlers> = Values<
  {
    [Prop in keyof Dictionary]: {
      name: Prop;
      execute: Dictionary[Prop];
    };
  }
>;

export type Event = Variants<Exclude<EventHandlers, "debug">>;
