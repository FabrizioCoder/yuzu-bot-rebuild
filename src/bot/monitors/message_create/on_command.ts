import type { Monitor } from "../../types/monitor.ts";
import type { BotWithCache } from "cache_plugin";
import { cache, Configuration } from "utils";
import {
  getChannel,
  getGuild,
  getMember,
  getMessage,
  getUser,
  sendMessage,
} from "discordeno";
import { botHasGuildPermissions } from "permissions_plugin";
import { getCollection, getPrefix } from "../../../database/controllers/prefix_controller.ts";
import { db } from "../../../database/db.ts";

// get a prefix from a given guildId
async function getPrefixFromId(database: typeof db, id?: bigint, prefix = Configuration.PREFIX) {
  if (!id || !database) return prefix;

  const { prefix: customPrefix } = await getPrefix(getCollection(database), id) ?? { prefix };

  return customPrefix;
}

export default <Monitor<"messageCreate">> {
  name: "commandMonitor",
  type: "messageCreate",
  isGuildOnly: false,
  ignoreBots: true,
  async execute(bot: BotWithCache, message) {
    if (message.guildId) {
      const canSendMessages = botHasGuildPermissions(bot as BotWithCache, message.guildId, ["SEND_MESSAGES"]);

      if (!canSendMessages) return;
    }

    const prefix = await getPrefixFromId(db, message.guildId);

    const args = message.content.slice(prefix.length).trim().split(/\s+/gm);
    const name = args.shift()?.toLowerCase();

    if (!message.content.startsWith(prefix)) {
      return;
    }

    if (!name) {
      return;
    }

    const command = cache.commands.get(name);

    // CHECKS

    if (!command) {
      await sendMessage(bot, message.channelId, { content: "Ese comando no existe! 🔒" });
      return;
    }

    // TODO: make this more readable
    const structs = {
      channel: command.using?.includes("channel")
        ? message.channelId
          ? bot.channels.get(message.channelId) ?? await getChannel(bot, message.channelId)
          : undefined
        : undefined,

      guild: command.using?.includes("guild")
        ? message.guildId
          ? bot.guilds.get(message.guildId) ?? await getGuild(bot, message.guildId)
          : undefined
        : undefined,

      member: command.using?.includes("member")
        ? message.member && message.guildId
          ? bot.members.get(message.member.id) ?? await getMember(bot, message.guildId, message.member.id)
          : undefined
        : undefined,

      message: command.using?.includes("message")
        ? bot.messages.get(message.id) ?? await getMessage(bot, message.channelId, message.id)
        : undefined,

      user: command.using?.includes("user")
        ? bot.users.get(message.authorId) ?? await getUser(bot, message.authorId)
        : undefined,
    };


    if (!message.guildId && command.options?.isGuildOnly) {
      await sendMessage(bot, message.channelId, { content: "Este comando solo funciona en servidores..." });
      return;
    }

    if (message.authorId !== Configuration.OWNER_ID && command.options?.isAdminOnly) {
      await sendMessage(bot, message.channelId, { content: "Debes ser dev para usar el comando..." });
      return;
    }

    // END CHECKS

    await sendMessage(bot, Configuration.CHANNEL_ID, {
      content:
        `Comando ${command.data.name} ejecutado por ${message.tag} ` +
        `en el ${message.guildId ? "servidor" : "dm"} ${message.guildId ?? message.channelId}`,
    });

    const output = await command.execute(bot as BotWithCache, message, { args, prefix }, structs);

    // PERMISSIONS

    if (message.guildId) {
      const canSendEmbeds = botHasGuildPermissions(bot as BotWithCache, message.guildId, ["EMBED_LINKS"]);

      if (typeof output !== "string" && !canSendEmbeds) {
        await sendMessage(bot, message.channelId, { content: "No puedo enviar embeds..." });
        return;
      }
    }

    // END PERMISSIONS

    if (!output) return;

    if (typeof output !== "string") {
      await sendMessage(bot, message.channelId, { embeds: [output] });
    }

    if (typeof output === "string") {
      await sendMessage(bot, message.channelId, { content: output, allowedMentions: { users: [], roles: [] } });
    }

  },
};
