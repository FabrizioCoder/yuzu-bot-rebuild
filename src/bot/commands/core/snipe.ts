import { createCommand, createMessageCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
import { cache, Category, randomHex } from "utils";
import { avatarURL, getUser, sendMessage } from "discordeno";

createCommand({
  meta: {
    descr: "commands:snipe:DESCRIPTION",
  },
  category: Category.Util,
  async execute({ bot, interaction }) {
    if (!interaction.channelId) return;

    const message = cache.lastMessages.get(interaction.channelId);

    if (!message) {
      return "commands:snipe:ON_MISSING_MESSAGE";
    }

    if (message.content.length >= 4096) {
      const file = new Blob([message.content]);

      await sendMessage(bot, interaction.channelId, { file: [{ name: "Content.txt", blob: file }] });

      return "commands:snipe:ON_LARGE_MESSAGE";
    }

    const { embed } = new MessageEmbed()
      .author(
        message.tag,
        avatarURL(bot, interaction.user.id, interaction.user.discriminator, { avatar: interaction.user.avatar })
      )
      .color(randomHex())
      .description(message.content)
      .footer(`${message.id} • ${new Date(message.timestamp).toLocaleString()}`);

    return embed;
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("snipe")
    .setDescription("Searches for the last deleted message on the current channel")
    .toJSON(),
});

createMessageCommand({
  names: ["snipe"],
  category: Category.Util,
  meta: {
    descr: "commands:snipe:DESCRIPTION",
  },
  async execute({ bot, message }) {
    const sniped = cache.lastMessages.get(message.channelId);

    if (!sniped) {
      return "commands:snipe:ON_MISSING_MESSAGE";
    }

    if (sniped.content.length >= 4096) {
      const file = new Blob([sniped.content]);

      await sendMessage(bot, message.channelId, { file: [{ name: "Content.txt", blob: file }] });

      return "commands:snipe:ON_LARGE_MESSAGE";
    }

    const author = bot.users.get(message.authorId) ?? (await getUser(bot, message.authorId));

    const { embed } = new MessageEmbed()
      .author(message.tag, avatarURL(bot, author.id, author.discriminator, { avatar: author.avatar }))
      .color(randomHex())
      .description(message.content)
      .footer(`${message.id} • ${new Date(message.timestamp).toLocaleString()}`);

    return embed;
  },
});
