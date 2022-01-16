import type { CreateCommand, SlashCommandContext, Command } from "../types/command.ts";
import type { Embed, EditGlobalApplicationCommand, MakeRequired } from "discordeno";

import { slashCommands } from "../cache.ts";

export function createCommand(
  o: Omit<CreateCommand, "data" | "type" | "description" | "name"> & {
    execute(ctx: SlashCommandContext): string | Embed | void | Promise<string | Embed | void>;
    data: MakeRequired<EditGlobalApplicationCommand, "name">;
  }
) {
  const created: Command = {
    data: o.data,
    isGuildOnly: Boolean(o.isGuildOnly),
    isAdminOnly: Boolean(o.isAdminOnly),
    meta: { ...o.meta },
    category: o.category,
    execute: o.execute,
    translated: o.translated,
  };
  slashCommands.set(created.data.name!, created);
  return created;
}
