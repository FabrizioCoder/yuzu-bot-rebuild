import type { Bot, DiscordenoUser } from "../../deps.ts";
import type { Milliseconds } from "../utils/mod.ts";

export type Payload = {
  shardId: number;
  v: number;
  user: DiscordenoUser;
  guilds: bigint[];
  sessionId: string;
  shard?: number[];
  applicationId: bigint;
};

export type Task = {
  // arbitrary name
  name: string;
  interval: Milliseconds;
  disabled?: boolean;
  // botId uptime and anothe ruseful ids
  execute: (
    bot: Bot,
    payload: Payload,
    ...args: number[]
  ) => void | Promise<void>;
};
