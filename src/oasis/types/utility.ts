import type { Bot } from "discordeno";

export type Tail<T extends unknown[]> = T extends [infer _A, ...(infer R)] ? R : never;

export type Helper<T extends keyof Bot["helpers"]> = Bot["helpers"][T];
