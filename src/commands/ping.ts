import type { Command } from "../types/command.ts";

export default <Command<false>> {
  data: "ping",
  execute: () => "pong!",
};
