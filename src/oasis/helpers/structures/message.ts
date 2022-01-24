import type { Bot, DiscordenoMessage } from "discordeno";
import type { Helper, Tail } from "../../types/utility.ts";

export interface OasisMessage extends DiscordenoMessage {
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
  publish(): ReturnType<Helper<"publishMessage">>;
}

export function makeMessage(bot: Bot, message: DiscordenoMessage): OasisMessage {
  return {
    ...message,
    // helpers
    addReaction: bot.helpers.addReaction.bind(null, message.channelId, message.id),
    addReactions: bot.helpers.addReactions.bind(null, message.channelId, message.id),
    delete: bot.helpers.deleteMessage.bind(null, message.channelId, message.id),
    edit: bot.helpers.editMessage.bind(null, message.channelId, message.id),
    getReactions: bot.helpers.getReactions.bind(null, message.channelId, message.id),
    pin: bot.helpers.pinMessage.bind(null, message.channelId, message.id),
    publish: bot.helpers.publishMessage.bind(null, message.channelId, message.id),
    removeAllReactions: bot.helpers.removeAllReactions.bind(null, message.channelId, message.id),
    removeReaction: bot.helpers.removeReaction.bind(null, message.channelId, message.id),
    removeReactionEmoji: bot.helpers.removeReactionEmoji.bind(null, message.channelId, message.id),
    unpin: bot.helpers.unpinMessage.bind(null, message.channelId, message.id),
  };
}
