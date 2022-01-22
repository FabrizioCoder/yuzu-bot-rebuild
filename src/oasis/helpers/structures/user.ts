// deno-lint-ignore-file no-empty-interface

import type { Bot, DiscordenoUser } from "discordeno";
import { Util } from "../../classes/Util.ts";

export interface OasisUser {
  tag: string;
  avatarURL: string;
  createdAt: Date;
  toString(): string;
}

declare module "discordeno" {
  interface DiscordenoUser extends OasisUser {
    // pass
  }
}

export default function (bot: Bot) {
  const { user } = bot.transformers;

  bot.transformers.user = function (bot, { ...rest }) {
    const payload = user(bot, rest);

    const data = {
      ...payload,
      tag: `${payload.username}#${payload.discriminator}`,
      avatarURL: bot.helpers.avatarURL(BigInt(payload.id), Number(payload.discriminator), {
        avatar: bot.utils.iconHashToBigInt(String(payload.avatar)),
      }),
      timestamp: Util.snowflakeToTimestamp(BigInt(payload.id)),
      createdAt: new Date(Util.snowflakeToTimestamp(BigInt(payload.id))),
      toString() {
        return `<@${this.id}>`;
      },
    };

    return data as DiscordenoUser & OasisUser;
  };

  return bot;
}
