import type { Bot, DiscordenoMember } from "discordeno";
import type { Helper, Tail } from "../../types/utility.ts";
import { Util } from "../../classes/Util.ts";

export interface OasisMember extends DiscordenoMember {
  timestamp: number;
  createdAt: Date;
  toString(): string;
  ban(...[options]: Tail<Tail<Parameters<Helper<"banMember">>>>): ReturnType<Helper<"banMember">>;
  edit(...[options]: Tail<Tail<Parameters<Helper<"editMember">>>>): ReturnType<Helper<"editMember">>;
  kick(...[reason]: Tail<Tail<Parameters<Helper<"kickMember">>>>): ReturnType<Helper<"kickMember">>;
}

export function makeMember(bot: Bot, member: DiscordenoMember): OasisMember {
  return {
    ...member,
    timestamp: Util.snowflakeToTimestamp(BigInt(member.id)),
    createdAt: new Date(Util.snowflakeToTimestamp(member.id)),
    toString() {
      return `<@!<${this.id}>`;
    },
    // helpers
    ban: bot.helpers.banMember.bind(null, member.id, member.guildId),
    edit: bot.helpers.editMember.bind(null, member.id, member.guildId),
    kick: bot.helpers.kickMember.bind(null, member.id, member.guildId),
  };
}

export default function (bot: Bot) {
  bot.transformers.member = (bot, payload, ...rest) => makeMember(bot, bot.transformers.member(bot, payload, ...rest));

  return bot;
}
