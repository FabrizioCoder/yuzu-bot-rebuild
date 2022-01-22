// deno-lint-ignore-file no-empty-interface

import type { Bot, DiscordenoGuild } from "discordeno";
import type { Helper, Tail } from "../../types/utility.ts";

export interface OasisGuild {
  createdAt?: Date;
  edit(...[options, shardId]: Tail<Parameters<Helper<"editGuild">>>): ReturnType<Helper<"editGuild">>;
  editWelcomeScreen(
    ...[options]: Tail<Parameters<Helper<"editWelcomeScreen">>>
  ): ReturnType<Helper<"editWelcomeScreen">>;
  editWidget(...[enabled, channelId]: Tail<Parameters<Helper<"editWidget">>>): ReturnType<Helper<"editWidget">>;
  getAuditLogs(...[options]: Tail<Parameters<Helper<"getAuditLogs">>>): ReturnType<Helper<"getAuditLogs">>;
  getBan(...[memberId]: Tail<Parameters<Helper<"getBan">>>): ReturnType<Helper<"getBan">>;
  getBans(): ReturnType<Helper<"getBans">>;
  getGuildPreview(): ReturnType<Helper<"getGuildPreview">>;
  getPruneCount(...[options]: Tail<Parameters<Helper<"getPruneCount">>>): ReturnType<Helper<"getPruneCount">>;
  getVanityUrl(): ReturnType<Helper<"getVanityUrl">>;
  getVoiceRegions(): ReturnType<Helper<"getVoiceRegions">>;
  getWelcomeScreen(): ReturnType<Helper<"getWelcomeScreen">>;
  getWidget(): ReturnType<Helper<"getWidget">>;
  getWidgetImageURL(
    ...[options]: Tail<Parameters<Helper<"getWidgetImageURL">>>
  ): ReturnType<Helper<"getWidgetImageURL">>;
  guildBannerURL(...[options]: Tail<Parameters<Helper<"guildBannerURL">>>): ReturnType<Helper<"guildBannerURL">>;
  guildSplashURL(...[options]: Tail<Parameters<Helper<"guildSplashURL">>>): ReturnType<Helper<"guildSplashURL">>;
  leave(): ReturnType<Helper<"leaveGuild">>;
  createScheduledEvent(
    ...[eventId]: Tail<Parameters<Helper<"createScheduledEvent">>>
  ): ReturnType<Helper<"createScheduledEvent">>;
  deleteScheduledEvent(
    ...[eventId]: Tail<Parameters<Helper<"deleteScheduledEvent">>>
  ): ReturnType<Helper<"deleteScheduledEvent">>;
  editScheduledEvent(
    ...[eventId, option]: Tail<Parameters<Helper<"editScheduledEvent">>>
  ): ReturnType<Helper<"editScheduledEvent">>;
  getScheduledEvent(
    ...[eventId, options]: Tail<Parameters<Helper<"getScheduledEvent">>>
  ): ReturnType<Helper<"getScheduledEvent">>;
  getScheduledEventUsers(
    ...[eventId, options]: Tail<Parameters<Helper<"getScheduledEventUsers">>>
  ): ReturnType<Helper<"getScheduledEventUsers">>;
  getScheduledEvents(
    ...[options]: Tail<Parameters<Helper<"getScheduledEvents">>>
  ): ReturnType<Helper<"getScheduledEvents">>;
  createChannel(...[options]: Tail<Parameters<Helper<"createChannel">>>): ReturnType<Helper<"createChannel">>;
  deleteChannel(...[channelId, reason]: Parameters<Helper<"deleteChannel">>): ReturnType<Helper<"deleteChannel">>;
  getChannel(...[channelId]: Parameters<Helper<"getChannel">>): ReturnType<Helper<"getChannel">>;
  getChannels(): ReturnType<Helper<"getChannels">>;
  swapChannels(...args: Tail<Parameters<Helper<"swapChannels">>>): ReturnType<Helper<"swapChannels">>;
  createEmoji(...args: Tail<Parameters<Helper<"createEmoji">>>): ReturnType<Helper<"createEmoji">>;
  deleteEmoji(...args: Tail<Parameters<Helper<"deleteEmoji">>>): ReturnType<Helper<"deleteEmoji">>;
  editEmoji(...args: Tail<Parameters<Helper<"editEmoji">>>): ReturnType<Helper<"editEmoji">>;
  getEmoji(...args: Tail<Parameters<Helper<"getEmoji">>>): ReturnType<Helper<"getEmoji">>;
  getEmojis(): ReturnType<Helper<"getEmojis">>;
  // emojiUrl(...args: Tail<Parameters<Helper<"emojiUrl">>>): ReturnType<Helper<"emojiUrl">>;
}

declare module "discordeno" {
  interface DiscordenoGuild extends OasisGuild {
    // pass
  }
}

export default function (bot: Bot) {
  const { guild } = bot.transformers;

  bot.transformers.guild = function (bot, { ...rest }) {
    const payload = guild(bot, rest);

    const data = {
      ...payload,
      createdAt: payload.joinedAt ? new Date(payload.joinedAt) : undefined,
      // helpers
      edit: bot.helpers.editGuild.bind(null, payload.id),
      editWelcomeScreen: bot.helpers.editWelcomeScreen.bind(null, payload.id),
      editWidget: bot.helpers.editWidget.bind(null, payload.id),
      getAuditLogs: bot.helpers.getAuditLogs.bind(null, payload.id),
      getBan: bot.helpers.getBan.bind(null, payload.id),
      getBans: bot.helpers.getBans.bind(null, payload.id),
      getGuildPreview: bot.helpers.getGuildPreview.bind(null, payload.id),
      getPruneCount: bot.helpers.getPruneCount.bind(null, payload.id),
      getVanityUrl: bot.helpers.getVanityUrl.bind(null, payload.id),
      getVoiceRegions: bot.helpers.getVoiceRegions.bind(null, payload.id),
      getWelcomeScreen: bot.helpers.getWelcomeScreen.bind(null, payload.id),
      getWidget: bot.helpers.getWidget.bind(null, payload.id),
      getWidgetImageURL: bot.helpers.getWidgetImageURL.bind(null, payload.id),
      guildBannerURL: bot.helpers.guildBannerURL.bind(null, payload.id),
      guildSplashURL: bot.helpers.guildSplashURL.bind(null, payload.id),
      leave: bot.helpers.leaveGuild.bind(null, payload.id),
      // scheduled events
      createScheduledEvent: bot.helpers.createScheduledEvent.bind(null, payload.id),
      deleteScheduledEvent: bot.helpers.deleteScheduledEvent.bind(null, payload.id),
      editScheduledEvent: bot.helpers.editScheduledEvent.bind(null, payload.id),
      getScheduledEvent: bot.helpers.getScheduledEvent.bind(null, payload.id),
      getScheduledEventUsers: bot.helpers.getScheduledEventUsers.bind(null, payload.id),
      getScheduledEvents: bot.helpers.getScheduledEvents.bind(null, payload.id),
      // channel helpers
      createChannel: bot.helpers.createChannel.bind(null, payload.id),
      deleteChannel: bot.helpers.deleteChannel,
      getChannel: bot.helpers.getChannel,
      getChannels: bot.helpers.getChannels.bind(null, payload.id),
      swapChannels: bot.helpers.swapChannels.bind(null, payload.id),
      // emoji helpers
      createEmoji: bot.helpers.createEmoji.bind(null, payload.id),
      deleteEmoji: bot.helpers.deleteEmoji.bind(null, payload.id),
      editEmoji: bot.helpers.editEmoji.bind(null, payload.id),
      getEmoji: bot.helpers.getEmoji.bind(null, payload.id),
      getEmojis: bot.helpers.getEmojis.bind(null, payload.id),
      // emojiUrl: bot.helpers.emojiUrl,
    };

    return data as DiscordenoGuild & OasisGuild;
  };

  return bot;
}
