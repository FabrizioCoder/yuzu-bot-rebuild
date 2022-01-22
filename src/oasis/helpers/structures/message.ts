// deno-lint-ignore-file no-empty-interface

import type { Bot, DiscordenoMessage, DiscordenoMember, DiscordenoUser } from "discordeno";
import type { Helper, Tail } from "../../types/utility.ts";

export interface OasisMessage {
  author: DiscordenoUser;
  member: DiscordenoMember;
  addReaction(...[reason]: Tail<Tail<Parameters<Helper<"addReaction">>>>): ReturnType<Helper<"addReaction">>;
  addReactions(
    ...[reactions, ordered]: Tail<Tail<Parameters<Helper<"addReactions">>>>
  ): ReturnType<Helper<"addReactions">>;
  delete(...[reason]: Tail<Tail<Parameters<Helper<"deleteMessage">>>>): ReturnType<Helper<"deleteMessage">>;
  edit(...[reason]: Tail<Tail<Parameters<Helper<"editMessage">>>>): ReturnType<Helper<"editMessage">>;
  getReactions(...[reason]: Tail<Tail<Parameters<Helper<"getReactions">>>>): ReturnType<Helper<"getReactions">>;
  pin(): ReturnType<Helper<"pinMessage">>;
  removeAllReactions(): ReturnType<Helper<"removeAllReactions">>;
  removeReaction(
    ...[reaction, options]: Tail<Tail<Parameters<Helper<"removeReaction">>>>
  ): ReturnType<Helper<"removeReaction">>;
  removeReactionEmoji(
    ...[reaction]: Tail<Tail<Parameters<Helper<"removeReactionEmoji">>>>
  ): ReturnType<Helper<"removeReactionEmoji">>;
  unpin(): ReturnType<Helper<"unpinMessage">>;
}

declare module "discordeno" {
  interface DiscordenoMessage extends OasisMessage {
    // pass
  }
}

export default function (bot: Bot) {
  const { message } = bot.transformers;

  bot.transformers.message = function (bot, { ...rest }) {
    const payload = message(bot, rest);

    const data = {
      ...payload,
      author: bot.transformers.user(bot, rest.author),
      member:
        rest.member && rest.guild_id && rest.id
          ? bot.transformers.member(bot, rest.member, BigInt(rest.guild_id), BigInt(rest.id))
          : undefined,
      // helpers
      addReaction: bot.helpers.addReaction.bind(null, payload.channelId, payload.id),
      addReactions: bot.helpers.addReactions.bind(null, payload.channelId, payload.id),
      delete: bot.helpers.deleteMessage.bind(null, payload.channelId, payload.id),
      edit: bot.helpers.editMessage.bind(null, payload.channelId, payload.id),
      getReactions: bot.helpers.getReactions.bind(null, payload.channelId, payload.id),
      pin: bot.helpers.pinMessage.bind(null, payload.channelId, payload.id),
      publish: bot.helpers.publishMessage.bind(null, payload.channelId, payload.id),
      removeAllReactions: bot.helpers.removeAllReactions.bind(null, payload.channelId, payload.id),
      removeReaction: bot.helpers.removeReaction.bind(null, payload.channelId, payload.id),
      removeReactionEmoji: bot.helpers.removeReactionEmoji.bind(null, payload.channelId, payload.id),
      unpin: bot.helpers.unpinMessage.bind(null, payload.channelId, payload.id),
    };

    return data as DiscordenoMessage & OasisMessage;
  };

  return bot;
}
