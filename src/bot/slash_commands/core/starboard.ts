import { type Context, Command, Option } from "oasis";
import { Category } from "utils";
import { ApplicationCommandOptionTypes, getChannel, getGuild } from "discordeno";
import { hasGuildPermissions } from "permissions_plugin";
import {
  editStarboard,
  getCollection,
  getStarboard,
  setStarboard,
} from "../../../database/controllers/starboard_controller.ts";
import { db } from "../../../database/db.ts";

@Command({
  name: "starboard",
  description: "Configura un canal para enviar mensajes starboard ⭐",
  isGuildOnly: true,
  category: Category.Config,
  meta: {
    descr: "Configura un canal para enviar mensajes starboard ⭐",
    short: "Configura un canal para enviar mensajes starboard ⭐",
    usage: "<Channel> [emoji] [count]",
  },
})
@Option({
  type: ApplicationCommandOptionTypes.Channel,
  name: "channel",
  required: true,
  description: "The channel",
})
@Option({
  type: ApplicationCommandOptionTypes.String,
  name: "emoji",
  description: "The emoji",
})
@Option({
  type: ApplicationCommandOptionTypes.Integer,
  name: "count",
  description: "Min count of reactions",
})
export default class {
  static async execute({ bot, interaction }: Context) {
    if (!db) return;

    const options = interaction.data?.options;

    if (!interaction.guildId) {
      return;
    }

    const guild = bot.guilds.get(interaction.guildId) ?? await getGuild(bot, interaction.guildId);

    if (!guild) {
      return;
    }

    const channelId = options?.[0]?.value as string | undefined;

    if (!channelId) {
      return "Debes mencionar al menos la id de un canal";
    }

    const isStaff = interaction.member ? hasGuildPermissions(bot, guild, interaction.member, ["MANAGE_GUILD"]) : false;
    const channel = bot.channels.get(BigInt(channelId)) ?? await getChannel(bot, BigInt(channelId));

    if (!isStaff) {
      return "No posees suficientes permisos";
    }

    if (channel?.guildId !== interaction.guildId!) {
      return "El canal debe pertenecer al servidor...";
    }

    const count = (options?.[2]?.value) ?? 5;

    if (typeof count !== "number") return;

    const emoji = guild.emojis.find((emoji) => emoji.name === (typeof options?.[1]?.value !== "string" ? undefined : options[1].value));
    const starboard = await getStarboard(getCollection(db), guild.id);

    if (count < 1) {
      return "El número debe ser mayor a 0";
    }

    if (!starboard) {
      // set a new starboard
      await setStarboard(getCollection(db), guild.id, channel.id, emoji?.id, count);

      const newStarboard = await getStarboard(getCollection(db), guild.id);

      return `El canal del starboard será <#${newStarboard?.channelId}> y tendrá el emoji ${emoji?.name ?? "⭐"}`;
    } else {
      await editStarboard(getCollection(db), { guildId: guild.id.toString(), }, {
        count,
        channelId: channel.id.toString(),
        emojiId: !emoji ? "⭐" : emoji.id ? emoji.id.toString() : emoji.name,
      });

      const newStarboard = await getStarboard(getCollection(db), guild.id);

      return `El canal del starboard se editó a <#${newStarboard?.channelId}> y tendrá el emoji ${emoji?.name ?? "⭐"}`;
    }
  }
}
