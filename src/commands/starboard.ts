import type { Command } from "../types/command.ts";
import { Category } from "../utils/mod.ts";
import { getChannel, getGuild } from "../../deps.ts";
import {
  editStarboard,
  getCollection,
  getStarboard,
  setStarboard,
} from "../database/controllers/starboard_controller.ts";
import { db } from "../database/db.ts";

export default <Command<false>>{
  options: {
    guildOnly: true,
    adminOnly: false,
    information: {
      descr: "Configura un canal para enviar mensajes starboard ⭐",
      short: "Configura un canal para enviar mensajes starboard ⭐",
      usage: "<Channel> [emoji] [count]",
    },
  },
  category: Category.Config,
  data: {
    name: "starboard",
  },
  async execute(bot, message, { args }) {
    if (!db) return;

    const guild = bot.guilds.get(message.guildId!) ?? (await getGuild(bot, message.guildId!));

    if (!guild) return;

    const channelId = message.mentionedChannelIds?.[0];

    if (!channelId) return;

    const channel = bot.channels.get(channelId) ?? (await getChannel(bot, channelId));

    if (channel.guildId !== message.guildId!) {
      return "El canal debe pertenecer al servidor...";
    }

    const count = parseInt(args[2] ?? "5");
    const emoji = guild.emojis.find((emoji) => emoji.name === args[1]);
    const starboard = await getStarboard(getCollection(db), guild.id);

    if (count < 1) return "El número debe ser mayor a 0";

    if (!starboard) {
      // set a new starboard
      await setStarboard(getCollection(db), guild.id, channel.id, emoji?.id, count);

      const newStarboard = await getStarboard(getCollection(db), guild.id);

      return `El canal del starboard será <#${newStarboard?.channelId}> y tendrá el emoji ${emoji?.name ?? "⭐"}`;
    } else {
      await editStarboard(
        getCollection(db),
        {
          guildId: guild.id.toString(),
        },
        {
          count,
          channelId: channel.id.toString(),
          emojiId: !emoji ? "⭐" : emoji.id ? emoji.id.toString() : emoji.name,
        }
      );

      const newStarboard = await getStarboard(getCollection(db), guild.id);

      return `El canal del starboard se editó a <#${newStarboard?.channelId}> y tendrá el emoji ${emoji?.name ?? "⭐"}`;
    }
  },
};
