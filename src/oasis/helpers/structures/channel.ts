import type { Bot, DiscordenoChannel } from "discordeno";
import type { Helper, Tail } from "../../types/utility.ts";

export interface OasisChannel extends DiscordenoChannel {
  toString(): string;
  createStageInstance(
    ...[topic, privacyLevel]: Tail<Parameters<Helper<"createStageInstance">>>
  ): ReturnType<Helper<"createStageInstance">>;
  delete(...[reason]: Tail<Parameters<Helper<"deleteChannel">>>): ReturnType<Helper<"deleteChannel">>;
  deleteOverwrite(
    ...[overwriteId]: Tail<Parameters<Helper<"deleteChannelOverwrite">>>
  ): ReturnType<Helper<"deleteChannelOverwrite">>;
  edit(...[options, reason]: Tail<Parameters<Helper<"editChannel">>>): ReturnType<Helper<"editChannel">>;
  editOverwrite(
    ...[overwriteId, options]: Tail<Parameters<Helper<"editChannelOverwrite">>>
  ): ReturnType<Helper<"editChannelOverwrite">>;
  follow(...[targetChannelId]: Tail<Parameters<Helper<"followChannel">>>): ReturnType<Helper<"followChannel">>;
  getPins(): ReturnType<Helper<"getPins">>;
  getWebhooks(): ReturnType<Helper<"getChannelWebhooks">>;
  startTyping(): ReturnType<Helper<"startTyping">>;
  // useful helpers
  send(...[content]: Tail<Parameters<Helper<"sendMessage">>>): ReturnType<Helper<"sendMessage">>;
  getMessage(...[id]: Tail<Parameters<Helper<"getMessage">>>): ReturnType<Helper<"getMessage">>;
  getMessages(...[options]: Tail<Parameters<Helper<"getMessages">>>): ReturnType<Helper<"getMessages">>;
}

export function makeChannel(bot: Bot, channel: DiscordenoChannel): OasisChannel {
  return {
    ...channel,
    toString() {
      return `<#${this.id}>`;
    },
    // channel helpers
    createStageInstance: bot.helpers.createStageInstance.bind(null, channel.id),
    delete: bot.helpers.deleteChannel.bind(null, channel.id),
    deleteOverwrite: bot.helpers.deleteChannelOverwrite.bind(null, channel.id),
    edit: bot.helpers.editChannel.bind(null, channel.id),
    editOverwrite: bot.helpers.editChannelOverwrite.bind(null, channel.id),
    follow: bot.helpers.followChannel.bind(null, channel.id),
    getPins: bot.helpers.getPins.bind(null, channel.id),
    getWebhooks: bot.helpers.getChannelWebhooks.bind(null, channel.id),
    startTyping: bot.helpers.startTyping.bind(null, channel.id),
    // useful things
    // TODO: MAKE SEND FUNCTION ACCEPT EMBED CONSTRUCTOR OR DO A sendEmbed() METHOD
    send: bot.helpers.sendMessage.bind(null, channel.id),
    getMessage: bot.helpers.getMessage.bind(null, channel.id),
    getMessages: bot.helpers.getMessages.bind(null, channel.id),
  };
}

export default function (bot: Bot) {
  bot.transformers.channel = (bot, payload) => makeChannel(bot, bot.transformers.channel(bot, payload));

  return bot;
}
