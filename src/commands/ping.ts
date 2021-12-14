import type { Command } from "../types/command.ts";

import { Division } from "../utils/mod.ts";

export default <Command<false>> {
  data: { name: "ping" },
  division: Division.OWNER,
  execute: () => "pong!",
};
