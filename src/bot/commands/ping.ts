import type { Command } from "../types/command.ts";
import { Category } from "utils";

export default <Command<false>> {
  category: Category.Owner,
  data: {
    name: "ping",
  },
  using: ["user"],
  async execute(_bot, _message, _args, { user }) {
    if (user) {
      return `Ping ${user.username}#${user.discriminator}!`;
    }
  },
};
