import type { CreateCommand, Command, MessageCommandContext } from "../types/command.ts";
import type { Embed } from "discordeno";

import { commands } from "../cache.ts";

export function createMessageCommand(
  o: Omit<CreateCommand, "data" | "type" | "description"> & {
    execute(ctx: MessageCommandContext): string | Embed | undefined | Promise<string | Embed | void>;
  }
) {
  const created: Command<false> = {
    data: {
      name: o.name,
    },
    isGuildOnly: Boolean(o.isGuildOnly),
    isAdminOnly: Boolean(o.isAdminOnly),
    meta: { ...o.meta },
    category: o.category,
    execute: o.execute,
  };
  commands.set(o.name, created);
  return created;
}
