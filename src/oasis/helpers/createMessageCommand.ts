import type { CreateCommand, Command, MessageCommandContext } from "../types/command.ts";
import type { Embed } from "discordeno";

import { commands, aliases } from "../cache.ts";

export function createMessageCommand(
  o: Omit<CreateCommand, "data" | "type" | "description" | "name"> & {
    execute(ctx: MessageCommandContext): string | Embed | undefined | Promise<string | Embed | void>;
    names: string[];
  }
) {
  const created: Command<false> = {
    data: {
      name: o.names[0],
    },
    isGuildOnly: Boolean(o.isGuildOnly),
    isAdminOnly: Boolean(o.isAdminOnly),
    meta: { ...o.meta },
    category: o.category,
    execute: o.execute,
  };
  commands.set(o.names[0], created);

  for (const alias of o.names.slice(1)) {
    aliases.set(alias, o.names[0]);
  }

  return created;
}
