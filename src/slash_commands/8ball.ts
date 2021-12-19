import type { Command } from "../types/command.ts";
import type { Embed } from "../../deps.ts";

import { Category, randomHex } from "../utils/mod.ts";
import { ApplicationCommandOptionTypes, avatarURL } from "../../deps.ts";

const rpts = ["Sí", "No", "Tal vez", "No sé", "¡Claro!", "Podría ser", "Es poco probable", "Quizás"] as const;

export default <Command> {
  options: {
    guildOnly: false,
    information: {
      descr: "🎱 Responde al usuario una pregunta de sí/no",
      short: "🎱 Responde al usuario",
      usage: "<Input>",
    },
  },
  category: Category.Fun,
  data: {
    name: `${rpts.length}ball`,
    description: "Responde al usuario con una pregunta de sí/no",
    options: [
      {
        type: ApplicationCommandOptionTypes.String,
        required: true,
        name: "question",
        description: "🎱 Question ",
      },
    ],
  },
  async execute(bot, interaction) {
    const option = interaction.data?.options?.[0];

    if (option?.type === ApplicationCommandOptionTypes.String) {
      return <Embed>{
        color: randomHex(),
        thumbnail: {
          url: avatarURL(bot, interaction.user.id, interaction.user.discriminator, {
            avatar: interaction.user.avatar,
            size: 512,
          }),
        },
        fields: [
          {
            name: String.raw`\🎱 8ball`,
            value: "\u200b",
          },
          {
            name: "Tu pregunta fue:",
            value: option.value?.toString(),
          },
          {
            name: "Mi respuesta es:",
            value: rpts[Math.floor(Math.random() * rpts.length)],
          },
        ],
      };
    }
  },
};
