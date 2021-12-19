import type { Command } from "../types/command.ts";
import type { Embed } from "../../deps.ts";

import { Category, randomHex } from "../utils/mod.ts";
import { ApplicationCommandOptionTypes } from "../../deps.ts";

export default <Command> {
  options: {
    guildOnly: false,
    adminOnly: false,
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

    if (option?.type === ApplicationCommandOptionTypes.Integer) {
      const users = bot.users
        .filter((u) => u.discriminator === <number>option.value)
        .map((u) => `${u.username}#${u.discriminator}`);

      return <Embed>{
        color: randomHex(),
        description: users.join(", ") ?? "Sin resultados",
        footer: {
          text: `${users.length} usuario(s) con el tag ${option.value}`,
        },
      };
    }
  },
};
