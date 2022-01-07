import type { Context } from "oasis";
import { Command, MessageEmbed, Option } from "oasis";
import { Category, randomHex } from "utils";
import { ApplicationCommandOptionTypes, avatarURL } from "discordeno";

const rpts = <const> [
  "Sí",
  "No",
  "Tal vez",
  "No sé",
  "¡Claro!",
  "Podría ser",
  "Es poco probable",
  "Quizás",
];

@Option({
  type: ApplicationCommandOptionTypes.String,
  required: true,
  name: "question",
  description: "🎱 Question ",
})
@Command({
  name: `${rpts.length}ball`,
  description: "Responde al usuario con una pregunta de sí/no",
  meta: {
    descr: "🎱 Responde al usuario una pregunta de sí/no",
    short: "🎱 Responde al usuario",
    usage: "<Input>",
  },
  category: Category.Fun,
})
export default class {
  static execute({ bot, interaction }: Context) {
    const option = interaction.data?.options?.[0];

    if (option?.type === ApplicationCommandOptionTypes.String) {
      const embed = MessageEmbed
        .new()
        .color(randomHex())
        .field(String.raw`\🎱 8ball`, "\u200b")
        .field("Tu pregunta fue:", `${option.value}`)
        .field("Mi respuesta es:", rpts[Math.floor(Math.random() * rpts.length)])
        .thumbnail(avatarURL(bot, interaction.user.id, interaction.user.discriminator, { avatar: interaction.user.avatar }))
        .end();

      return embed;
    }
  }
}
