// deno-lint-ignore-file no-empty-interface

import type { Bot, DiscordenoUser } from "discordeno";
import { Util } from "../../classes/Util.ts";

export interface OasisUser extends DiscordenoUser {
  tag: string;
  toString(): string;
}

export default function (bot: Bot) {
  const { user } = bot.transformers;

  bot.transformers.user = function (bot, { ...rest }) {
    const payload = user(bot, rest);

    const data = {
      ...payload,
      tag: `${payload.username}#${payload.discriminator}`,
      timestamp: Util.snowflakeToTimestamp(BigInt(payload.id)),
      toString() {
        return `<@${this.id}>`;
      },
    };

    return data as OasisUser;
  };

  return bot;
}
