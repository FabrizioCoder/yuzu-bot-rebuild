import { createCommand, createMessageCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
import { Category, randomHex, translate } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

createCommand({
  meta: {
    descr: "commands:discrim:DESCRIPTION",
    usage: "commands:discrim:USAGE",
  },
  category: Category.Util,
  translated: true,
  async execute({ bot, interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.Integer) {
      return;
    }

    const users = bot.users.map((u) => {
      if (u.discriminator === <number>option.value) return `${u.username}#${u.discriminator}`;
    });

    const { embed } = new MessageEmbed()
      .color(randomHex())
      .description(users.join(", ") ?? "commands:discrim:NO_RESULTS")
      .footer(
        await translate(bot, "commands:discrim:EMBED_FOOTER", interaction.guildId, {
          count: users.length,
          tag: option.value,
        })
      );

    return embed;
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("discrim")
    .setDescription("Finds users with the same tag")
    .addIntegerOption((o) => o.setName("tag").setDescription("#️⃣ Tag of the user").setRequired(true))
    .toJSON(),
});

createMessageCommand({
  names: ["discrim"],
  meta: {
    descr: "discrim:DESCRIPTION",
    usage: "discrim:USAGE",
  },
  category: Category.Util,
  translated: true,
  async execute({ bot, message, args: { args } }) {
    const discriminator = parseInt(args[0]);

    const users = bot.users.map((u) => {
      if (u.discriminator === discriminator) return `${u.username}#${u.discriminator}`;
    });

    const { embed } = new MessageEmbed()
      .color(randomHex())
      .description(users.join(", ") ?? "discrim:NO_RESULTS")
      .footer(
        await translate(bot, "discrim:EMBED_FOOTER", message.guildId, { count: users.length, tag: discriminator })
      );
    return embed;
  },
});
