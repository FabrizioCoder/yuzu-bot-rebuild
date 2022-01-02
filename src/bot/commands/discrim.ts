import type { Command } from "../types/command.ts";
import type { Embed } from "discordeno";
import { Category, randomHex } from "utils";

export default <Command<false>> {
  options: {
    isGuildOnly: false,
    isAdminOnly: false,
    information: {
      descr: "Encuentra a usuarios con el mismo tag",
      short: "Encuentra a usuarios con el mismo tag",
      usage: "<Tag>",
    },
  },
  category: Category.Util,
  data: {
    name: "discrim",
  },
  async execute(bot, _message, { args }) {
    const discriminator = parseInt(args[0]);

    if (args[0].length !== 4) {
      return "El tag debe tener 4 dígitos";
    }

    const users = bot.users.map((u) => {
      if (u.discriminator === discriminator) return `${u.username}#${u.discriminator}`;
    });

    return <Embed> {
      color: randomHex(),
      description: users.join("\n") ?? "Sin resultados",
      footer: {
        text: `${users.length} usuario(s) con el tag ${args[0]}`,
      },
    };
  },
};
