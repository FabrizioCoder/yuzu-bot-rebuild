import type { BotWithCache } from "cache_plugin";
import { CommandoCache, createMonitor } from "oasis/commando";
import { botMention, compareDistance, Configuration, translate } from "utils";
import { sendMessage } from "discordeno";
import { botHasGuildPermissions } from "permissions_plugin";
import { getCollection, getPrefix } from "database/controllers/prefix_controller.ts";
import { db } from "database/db";

// get a prefix from a given guildId
async function getPrefixFromId(database: typeof db, id?: bigint, prefix = Configuration.prefix) {
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
        await sendMessage(bot, message.channelId, {
          content: await translate(bot as BotWithCache, "strings:MY_PREFIX_IS", message.guildId, { prefix }),
        });
      }
      return;
    }

    if (!name) {
      return;
    }

    const command =
      CommandoCache.commands.get(name) ?? CommandoCache.commands.get(CommandoCache.aliases.get(name) ?? "None");

    // CHECKS

    // TODO: extract this in a function and make it faster
    if (!command) {
      const parsedName = name.replace(/[^a-zA-Z]/gm, "");

      if (parsedName.length < 3) {
        return;
      }

      const fxd = new Map<string, number>();

      for (const [key] of CommandoCache.commands) {
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
          content: await translate(bot as BotWithCache, "strings:DID_YOU_MEAN", message.guildId, { command: entry[0] }),
        });
        fxd.clear();
      }
      return;
    }

    if (!message.guildId && command.isGuildOnly) {
      await sendMessage(bot, message.channelId, {
        content: await translate(bot as BotWithCache, "strings:COMMAND_IS_GUILDONLY", message.guildId),
      });
      return;
    }

    if (message.authorId !== Configuration.misc.ownerId && command.isAdminOnly) {
      await sendMessage(bot, message.channelId, {
        content: await translate(bot as BotWithCache, "strings:COMMAND_IS_ADMINONLY", message.guildId),
      });
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
        await sendMessage(bot, message.channelId, {
          content: await translate(bot as BotWithCache, "strings:BOT_CANNOT_SEND_EMBEDS", message.guildId),
        });
        return;
      }
    }

    // END PERMISSIONS

    if (!output) {
      return;
    }

    if (typeof output !== "string") {
      await sendMessage(bot, message.channelId, { embeds: [output] });
    }

    if (typeof output === "string") {
      await sendMessage(bot, message.channelId, {
        content: command.translated ? await translate(bot as BotWithCache, output, message.guildId) : output,
        allowedMentions: { users: [], roles: [] },
      });
    }
  },
});
