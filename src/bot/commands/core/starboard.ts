import { createCommand } from "oasis/commando";
import { ChatInputApplicationCommandBuilder } from "oasis/builders";
import { Category, translate } from "utils";
import { ChannelTypes, getChannel, getGuild } from "discordeno";
import { hasPermission } from "oasis/permissions";
import { editStarboard, getCollection, getStarboard, setStarboard } from "database/controllers/starboard_controller.ts";
import { db } from "database/db";

createCommand({
  isGuildOnly: true,
  meta: {
    descr: "commands:starboard:DESCRIPTION",
    usage: "commands:starboard:USAGE",
  },
  category: Category.Config,
  translated: true,
  async execute({ bot, interaction }) {
    if (!db) return;

    const options = interaction.data?.options;

    if (!interaction.guildId) {
      return;
    }

    const guild = bot.guilds.get(interaction.guildId) ?? (await getGuild(bot, interaction.guildId));

    if (!guild) {
      return;
    }

    const channelId = options?.[0]?.value as string;

    const isStaff = hasPermission(toPermissionBitfield(guild, interaction.member), "MANAGE_GUILD");
    const channel = bot.channels.get(BigInt(channelId)) ?? (await getChannel(bot, BigInt(channelId)));

    if (!isStaff) {
      return "commands:starboard:ON_MISSING_PERMISSIONS";
    }

    if (channel?.guildId !== interaction.guildId!) {
      return "commands:starboard:ON_INVALID_CHANNEL";
    }

    const count = options?.[2]?.value ?? 5;

    // type guard
    if (typeof count !== "number") {
      return;
    }

    const emoji =
      guild.emojis.find((emoji) => emoji.name === (options?.[1].value as string | undefined)) ??
      bot.transformers.emoji(bot, { name: options?.[1].value as string });

    const starboard = await getStarboard(getCollection(db), guild.id);

    if (!starboard) {
      // set a new starboard
      await setStarboard(getCollection(db), guild.id, channel.id, emoji.name, count);

      const newStarboard = await getStarboard(getCollection(db), guild.id);

      return translate(bot, "commands:starboard:ON_STARBOARD_CREATED", interaction.guildId, {
        channelId: newStarboard?.channelId,
        emojiName: emoji.name,
      });
    } else {
      await editStarboard(getCollection(db), guild.id, {
        count,
        channelId: channel.id,
        emojiName: emoji.name,
      });

      const newStarboard = await getStarboard(getCollection(db), guild.id);

      return translate(bot, "commands:starboard:ON_STARBOARD_CREATED", interaction.guildId, {
        channelId: newStarboard?.channelId,
        emojiName: emoji.name,
      });
    }
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("starboard")
    .setDescription("Set up a channel to send starboard messages ⭐")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to set")
        .addChannelTypes(ChannelTypes.GuildText, ChannelTypes.GuildNews)
        .setRequired(true)
    )
    .addStringOption((o) => o.setName("emoji").setDescription("The emoji (⭐ by default)"))
    .addIntegerOption((o) => o.setName("count").setDescription("Min count of reactions").setMinValue(1).setMaxValue(15))
    .toJSON(),
});
