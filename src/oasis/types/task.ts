import type { Milliseconds } from "../constants.ts";
import type { DiscordenoUser } from "discordeno";
import type { BotWithCache } from "cache_plugin";

export interface ReadyPayload {
  shardId: number;
  v: number;
  user: DiscordenoUser;
  guilds: bigint[];
  sessionId: string;
  shard?: number[];
  applicationId: bigint;
}

export interface Task {
  // arbitrary name
  name: string;
  interval: Milliseconds;
  // botId uptime and anothe ruseful ids
  execute: (bot: BotWithCache, payload: ReadyPayload, ...args: number[]) => void | Promise<void> | Promise<void>;
}
