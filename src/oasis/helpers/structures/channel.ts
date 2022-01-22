// deno-lint-ignore-file no-empty-interface

import type { Bot, DiscordenoChannel } from "discordeno";
import type { Helper, Tail } from "../../types/utility.ts";

export interface OasisChannel {
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

declare module "discordeno" {
  interface DiscordenoChannel extends OasisChannel {
    // pass
  }
}

export default function (bot: Bot) {
  const { channel } = bot.transformers;

  bot.transformers.channel = function (bot, { ...rest }) {
    const payload = channel(bot, rest);

    const data = {
      ...payload,
      toString() {
        return `<#${this.id}>`;
      },
      // channel helpers
      createStageInstance: bot.helpers.createStageInstance.bind(null, payload.id),
      delete: bot.helpers.deleteChannel.bind(null, payload.id),
      deleteOverwrite: bot.helpers.deleteChannelOverwrite.bind(null, payload.id),
      edit: bot.helpers.editChannel.bind(null, payload.id),
      editOverwrite: bot.helpers.editChannelOverwrite.bind(null, payload.id),
      follow: bot.helpers.followChannel.bind(null, payload.id),
      getPins: bot.helpers.getPins.bind(null, payload.id),
      getWebhooks: bot.helpers.getChannelWebhooks.bind(null, payload.id),
      startTyping: bot.helpers.startTyping.bind(null, payload.id),
      // useful things
      send: bot.helpers.sendMessage.bind(null, payload.id),
      getMessage: bot.helpers.getMessage.bind(null, payload.id),
      getMessages: bot.helpers.getMessages.bind(null, payload.id),
    };

    return data as DiscordenoChannel & OasisChannel;
  };

  return bot;
}
