import type { DiscordenoUser } from "discordeno";
import type { BotWithCache } from "cache_plugin";
import type { Milliseconds } from "utils";

export interface Payload {
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
  disabled?: boolean;
  // botId uptime and anothe ruseful ids
  execute: (bot: BotWithCache, payload: Payload, ...args: number[]) => void | Promise<void> | Promise<void>;
}
