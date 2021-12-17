import type { Command } from "../types/command.ts";
import type { Embed } from "../../deps.ts";

import { Division, randomHex } from "../utils/mod.ts";

export default <Command<false>> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Encuentra a usuarios con el mismo tag",
      short: "Encuentra a usuarios con el mismo tag",
      usage: "<Tag>",
    },
  },
  division: Division.FUN,
  data: {
    name: "discrim",
  },
  async execute(bot, _message, { args }) {
    const tag = parseInt(args[0]);

    if (args[0].length !== 4) {
      return "El tag debe tener 4 dígitos";
    }

    const users = bot.users.filter((u) => u.discriminator === tag).map((u) => `${u.username}#${u.discriminator}`);

    return <Embed> {
      color: randomHex(),
      description: users.join("\n") ?? "Sin resultados",
      footer: {
        text: `${users.length} usuario(s) con el tag ${args[0]}`,
      },
    };
  },
};
