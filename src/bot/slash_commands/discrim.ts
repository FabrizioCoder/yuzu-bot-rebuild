import type { Command } from "../types/command.ts";
import type { Embed } from "discordeno";
import { Category, randomHex } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

export default <Command> {
  options: {
    isGuildOnly: false,
    information: {
      descr: "Encuentra a usuarios con el mismo tag",
      short: "Encuentra a usuarios con el mismo tag",
      usage: "<Tag>",
    },
  },
  category: Category.Util,
  data: {
    name: "discrim",
    description: "Encuentra a usuarios con el mismo tag",
    options: [
      {
        type: ApplicationCommandOptionTypes.Integer,
        required: true,
        name: "discrim",
        description: "#️⃣ Tag",
      },
    ],
  },
  async execute(bot, interaction) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.Integer) return;

    const users = bot.users.map((u) => {
      if (u.discriminator === <number> option.value) return `${u.username}#${u.discriminator}`;
    });

    return <Embed>{
      color: randomHex(),
      description: users.join(", ") ?? "Sin resultados",
      footer: {
        text: `${users.length} usuario(s) con el tag ${option.value}`,
      },
    };
  },
};
