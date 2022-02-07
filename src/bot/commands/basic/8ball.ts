import { createCommand } from "oasis/commando";
import { ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis/builders";
import { Category, randomHex } from "utils";
import { ApplicationCommandOptionTypes, avatarURL } from "discordeno";

const rpts = ["Sí", "No", "Tal vez", "No sé", "¡Claro!", "Podría ser", "Es poco probable", "Quizás"] as const;
const name = `${rpts.length}ball` as const;

createCommand({
  meta: {
    descr: "commands:8ball:DESCRIPTION",
    usage: "commands:8ball:USAGE",
  },
  category: Category.Fun,
  translated: true,
  execute({ bot, interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type === ApplicationCommandOptionTypes.String) {
      const { embed } = new MessageEmbed()
        .color(randomHex())
        .field(String.raw`\🎱 8ball`, "\u200b")
        .field("Tu pregunta fue:", `${option.value}`)
        .field("Mi respuesta es:", rpts[Math.floor(Math.random() * rpts.length)])
        .thumbnail(
          avatarURL(bot, interaction.user.id, interaction.user.discriminator, {
            avatar: interaction.user.avatar,
          })
        );

      return embed;
    }
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName(name)
    .setDescription("🎱 Answers a yes/no question")
    .addStringOption((o) => o.setName("question").setDescription("🎱 Question ").setRequired(true))
    .toJSON(),
});
