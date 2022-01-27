import type { GatewayIntents } from "discordeno";

import { parse } from "https://deno.land/std@0.122.0/encoding/toml.ts";

const decoder = new TextDecoder("utf8");
const file = await Deno.readFile("src/config.toml");

// deno-lint-ignore no-explicit-any
const config: Record<string, any> = parse(decoder.decode(file));

export default {
  logs: {
    channelId: BigInt(config.logs?.channelId ?? 0n),
    guildId: BigInt(config.logs?.guildId ?? 0n),
  },
  misc: {
    botId: BigInt(config.misc.botId),
    ownerId: BigInt(config.misc.ownerId),
  },
  bot: {
    gateway: config.bot.gateway as {
      intents: (keyof typeof GatewayIntents)[];
      token: string;
    },
  },
  db: config.db as {
    uri: string;
  },
  development: config.development as boolean,
  prefix: config.prefix as string,
  version: config.version as string,
};
