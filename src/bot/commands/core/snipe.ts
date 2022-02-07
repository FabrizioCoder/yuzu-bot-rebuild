import { createCommand, createMessageCommand } from "oasis/commando";
import { ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis/builders";
import { cache, Category, randomHex } from "utils";
import { avatarURL, getUser, sendMessage } from "discordeno";

createCommand({
  meta: {
    descr: "commands:snipe:DESCRIPTION",
    usage: "commands:snipe:USAGE",
  },
  category: Category.Util,
  translated: true,
  async execute({ bot, interaction }) {
    if (!interaction.channelId) return;

    const snipedMessage = cache.lastMessages.get(interaction.channelId);

    if (!snipedMessage) {
      return "commands:snipe:ON_MISSING_MESSAGE";
    }

    if (snipedMessage.content.length >= 4096) {
      const file = new Blob([snipedMessage.content]);

      await sendMessage(bot, interaction.channelId, {
        file: [{ name: "Content.txt", blob: file }],
      });

      return "commands:snipe:ON_LARGE_MESSAGE";
    }

    const { embed } = new MessageEmbed()
      .author(
        snipedMessage.tag,
        avatarURL(bot, interaction.user.id, interaction.user.discriminator, {
          avatar: interaction.user.avatar,
        })
      )
      .color(randomHex())
      .description(snipedMessage.content)
      .footer(`${snipedMessage.id} • ${new Date(snipedMessage.timestamp).toLocaleString()}`);

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
    usage: "commands:snipe:USAGE",
  },
  translated: true,
  async execute({ bot, message }) {
    const snipedMessage = cache.lastMessages.get(message.channelId);

    if (!snipedMessage) {
      return "commands:snipe:ON_MISSING_MESSAGE";
    }

    if (snipedMessage.content.length >= 4096) {
      const file = new Blob([snipedMessage.content]);

      await sendMessage(bot, message.channelId, {
        file: [{ name: "Content.txt", blob: file }],
      });

      return "commands:snipe:ON_LARGE_MESSAGE";
    }

    const author = bot.users.get(snipedMessage.authorId) ?? (await getUser(bot, snipedMessage.authorId));

    const { embed } = new MessageEmbed()
      .author(
        snipedMessage.tag,
        avatarURL(bot, author.id, author.discriminator, {
          avatar: author.avatar,
        })
      )
      .color(randomHex())
      .description(snipedMessage.content)
      .footer(`${snipedMessage.id} • ${new Date(snipedMessage.timestamp).toLocaleString()}`);

    return embed;
  },
});
