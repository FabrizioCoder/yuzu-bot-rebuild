import { createCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
import { Category, randomHex } from "utils";
import { ApplicationCommandOptionTypes, avatarURL } from "discordeno";

const rpts = <const> ["Sí", "No", "Tal vez", "No sé", "¡Claro!", "Podría ser", "Es poco probable", "Quizás"];

export default createCommand({
  meta: {
    descr: "🎱 Responde al usuario una pregunta de sí/no",
    short: "🎱 Responde al usuario",
    usage: "<Input>",
  },
  category: Category.Fun,
  execute({ bot, interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type === ApplicationCommandOptionTypes.String) {
      const { embed } = new MessageEmbed()
        .color(randomHex())
        .field(String.raw`\🎱 8ball`, "\u200b")
        .field("Tu pregunta fue:", `${option.value}`)
        .field("Mi respuesta es:", rpts[Math.floor(Math.random() * rpts.length)])
        .thumbnail(avatarURL(bot, interaction.user.id, interaction.user.discriminator, { avatar: interaction.user.avatar }));

      return embed;
    }
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName(`${rpts.length}ball`)
    .setDescription("Responde al usuario con una pregunta de sí/no")
    .addStringOption((o) => o.setName("question").setDescription("🎱 Question ").setRequired(true))
    .toJSON(),
});
