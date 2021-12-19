import type { Command } from "../types/command.ts";
import { Category } from "../utils/mod.ts";

export default <Command<false>> {
  category: Category.Owner,
  data: {
    name: "ping",
  },
  async execute() {
    return "pong!";
  },
};
