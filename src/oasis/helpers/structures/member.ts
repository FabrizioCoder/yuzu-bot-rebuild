import type { Bot, DiscordenoMember } from "discordeno";
import type { Helper, Tail } from "../../types/utility.ts";
import { avatarURL } from "discordeno";
import { Util } from "../../classes/Util.ts";

export interface OasisMember extends DiscordenoMember {
  tag: string;
  avatarURL: string;
  timestamp: number;
  createdAt: Date;
  toString(): string;
  ban(...[options]: Tail<Tail<Parameters<Helper<"banMember">>>>): ReturnType<Helper<"banMember">>;
  edit(...[options]: Tail<Tail<Parameters<Helper<"editMember">>>>): ReturnType<Helper<"editMember">>;
  kick(...[reason]: Tail<Tail<Parameters<Helper<"kickMember">>>>): ReturnType<Helper<"kickMember">>;
}

export default function (bot: Bot) {
  const { member } = bot.transformers;

  bot.transformers.member = function (bot, { ...rest }, guildId, userId) {
    const payload = member(bot, rest, guildId, userId);

    const data = {
      ...payload,
      avatarURL: avatarURL(bot, payload.id, Number(rest.user?.discriminator), {
        avatar: bot.utils.iconHashToBigInt(String(payload.avatar)),
      }),
      timestamp: Util.snowflakeToTimestamp(BigInt(payload.id)),
      createdAt: new Date(Util.snowflakeToTimestamp(payload.id)),
      toString() {
        return `<@!<${this.id}>`;
      },
      // helpers
      ban: bot.helpers.banMember.bind(null, payload.id, payload.guildId),
      edit: bot.helpers.editMember.bind(null, payload.id, payload.guildId),
      kick: bot.helpers.kickMember.bind(null, payload.id, payload.guildId),
    };

    return data as OasisMember;
  };

  return bot;
}
