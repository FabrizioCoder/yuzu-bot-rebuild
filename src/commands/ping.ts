import type { Command } from "../types/command.ts";
import { Division } from "../utils/mod.ts";

export default <Command<false>> {
  division: Division.OWNER,
  data: {
    name: "ping",
  },
  execute() {
    return "pong!";
  },
};
