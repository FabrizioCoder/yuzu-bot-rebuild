import { createCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
import { Category, randomHex } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

export default createCommand({
  meta: {
    descr: "Encuentra a usuarios con el mismo tag",
    short: "Encuentra a usuarios con el mismo tag",
    usage: "<Tag>",
  },
  category: Category.Util,
  execute({ bot, interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.Integer) {
      return;
    }

    const users = bot.users.map((u) => {
      if (u.discriminator === <number> option.value) return `${u.username}#${u.discriminator}`;
    });

    const { embed } = new MessageEmbed()
      .color(randomHex())
      .description(users.join(", ") ?? "Sin resultados")
      .footer(`${users.length} usuario(s) con el tag ${option.value}`);

    return embed;
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("discrim")
    .setDescription("Encuentra a usuarios con el mismo tag")
    .addIntegerOption((o) => o.setName("tag").setDescription("#️⃣ Tag of the user").setRequired(true))
    .toJSON(),
});
