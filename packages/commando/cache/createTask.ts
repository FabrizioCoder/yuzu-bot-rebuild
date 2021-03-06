import type { DiscordenoUser } from "discordeno";
import type { BotWithCache } from "cache_plugin";

import { tasks } from "../cache.ts";

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
  interval: number;
  // botId uptime and anothe ruseful ids
  execute: (bot: BotWithCache, payload: ReadyPayload, ...args: number[]) => void | Promise<void> | Promise<void>;
}

export function createTask(o: Task) {
  tasks.set(o.name, o);
  return o;
}
