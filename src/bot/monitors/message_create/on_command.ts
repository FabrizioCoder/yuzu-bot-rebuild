import type { BotWithCache } from "cache_plugin";
import { cache, createMonitor } from "oasis";
import { botMention, Configuration, compareDistance } from "utils";
import { sendMessage } from "discordeno";
import { botHasGuildPermissions } from "permissions_plugin";
import { getCollection, getPrefix } from "../../../database/controllers/prefix_controller.ts";
import { db } from "../../../database/db.ts";

// get a prefix from a given guildId
async function getPrefixFromId(database: typeof db, id?: bigint, prefix = Configuration.PREFIX) {
  if (!id || !database) return prefix;

  const { prefix: customPrefix } = (await getPrefix(getCollection(database), id)) ?? { prefix };

  return customPrefix;
}

createMonitor({
  name: "commandMonitor",
  event: "messageCreate",
  isGuildOnly: false,
  ignoreBots: true,
  async execute(bot, message) {
    if (message.guildId) {
      const canSendMessages = botHasGuildPermissions(bot as BotWithCache, message.guildId, ["SEND_MESSAGES"]);

      if (!canSendMessages) return;
    }

    const prefix = await getPrefixFromId(db, message.guildId);

    const args = message.content.slice(prefix.length).trim().split(/\s+/gm);
    const name = args.shift()?.toLowerCase();

    if (!message.content.startsWith(prefix)) {
      if (message.content.match(botMention(bot.id))) {
        await sendMessage(bot, message.channelId, { content: `Mi prefix es ${prefix}` });
      }
      return;
    }

    if (!name) {
      return;
    }

    const command = cache.commands.get(name);

    // CHECKS

    // TODO: extract this in a function and make it faster
    if (!command) {
      const parsedName = name.replace(/[^a-zA-Z]/gm, "");

      if (parsedName.length < 3) {
        return;
      }

      const fxd = new Map<string, number>();

      for (const [key] of cache.commands) {
        const ratio = compareDistance(key, name);
        fxd.set(key, ratio);
      }

      let entry: [string, number] | undefined;

      for (const [key, val] of fxd) {
        if (!entry || entry[1] > val) {
          entry = [key, val];
        }
      }

      if (entry) {
        await sendMessage(bot, message.channelId, {
          content: `That command doesn't exist! 🔒 did you mean \`${entry[0]}\`?`,
        });
        fxd.clear();
      }
      return;
    }

    if (!message.guildId && command.isGuildOnly) {
      await sendMessage(bot, message.channelId, { content: "Este comando solo funciona en servidores..." });
      return;
    }

    if (message.authorId !== Configuration.OWNER_ID && command.isAdminOnly) {
      await sendMessage(bot, message.channelId, { content: "Debes ser dev para usar el comando..." });
      return;
    }

    // END CHECKS

    const output = await command.execute({
      bot: bot as BotWithCache,
      message,
      args: { args, prefix },
    });

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
});
