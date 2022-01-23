import type { Bot, DiscordenoGuild } from "discordeno";
import type { Helper, Tail } from "../../types/utility.ts";

export interface OasisGuild extends DiscordenoGuild {
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

export function makeGuild(bot: Bot, guild: DiscordenoGuild): OasisGuild {
  return {
    ...guild,
    // helpers
    edit: bot.helpers.editGuild.bind(null, guild.id),
    editWelcomeScreen: bot.helpers.editWelcomeScreen.bind(null, guild.id),
    editWidget: bot.helpers.editWidget.bind(null, guild.id),
    getAuditLogs: bot.helpers.getAuditLogs.bind(null, guild.id),
    getBan: bot.helpers.getBan.bind(null, guild.id),
    getBans: bot.helpers.getBans.bind(null, guild.id),
    getGuildPreview: bot.helpers.getGuildPreview.bind(null, guild.id),
    getPruneCount: bot.helpers.getPruneCount.bind(null, guild.id),
    getVanityUrl: bot.helpers.getVanityUrl.bind(null, guild.id),
    getVoiceRegions: bot.helpers.getVoiceRegions.bind(null, guild.id),
    getWelcomeScreen: bot.helpers.getWelcomeScreen.bind(null, guild.id),
    getWidget: bot.helpers.getWidget.bind(null, guild.id),
    getWidgetImageURL: bot.helpers.getWidgetImageURL.bind(null, guild.id),
    guildBannerURL: bot.helpers.guildBannerURL.bind(null, guild.id),
    guildSplashURL: bot.helpers.guildSplashURL.bind(null, guild.id),
    leave: bot.helpers.leaveGuild.bind(null, guild.id),
    // scheduled events
    createScheduledEvent: bot.helpers.createScheduledEvent.bind(null, guild.id),
    deleteScheduledEvent: bot.helpers.deleteScheduledEvent.bind(null, guild.id),
    editScheduledEvent: bot.helpers.editScheduledEvent.bind(null, guild.id),
    getScheduledEvent: bot.helpers.getScheduledEvent.bind(null, guild.id),
    getScheduledEventUsers: bot.helpers.getScheduledEventUsers.bind(null, guild.id),
    getScheduledEvents: bot.helpers.getScheduledEvents.bind(null, guild.id),
    // channel helpers
    createChannel: bot.helpers.createChannel.bind(null, guild.id),
    deleteChannel: bot.helpers.deleteChannel,
    getChannel: bot.helpers.getChannel,
    getChannels: bot.helpers.getChannels.bind(null, guild.id),
    swapChannels: bot.helpers.swapChannels.bind(null, guild.id),
    // emoji helpers
    createEmoji: bot.helpers.createEmoji.bind(null, guild.id),
    deleteEmoji: bot.helpers.deleteEmoji.bind(null, guild.id),
    editEmoji: bot.helpers.editEmoji.bind(null, guild.id),
    getEmoji: bot.helpers.getEmoji.bind(null, guild.id),
    getEmojis: bot.helpers.getEmojis.bind(null, guild.id),
    // emojiUrl: bot.helpers.emojiUrl,
  };
}

export default function (bot: Bot) {
  bot.transformers.guild = (bot, payload) => makeGuild(bot, bot.transformers.guild(bot, payload));

  return bot;
}
