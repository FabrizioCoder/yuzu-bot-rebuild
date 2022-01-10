import type { CreateCommand, MessageCommandContext, SlashCommandContext } from "../types/command.ts";
import type { Embed, EditGlobalApplicationCommand } from "discordeno";
import { ApplicationCommandTypes } from "discordeno";

export function createMessageCommand(o: Omit<CreateCommand, "data" | "type" | "description"> & {
  execute(ctx: MessageCommandContext): string | Embed | undefined | Promise<string | Embed | void>,
}) {
  return {
    data: {
      name: o.name,
    },
    options: o.options ? o.options : {
      isGuildOnly: !!o.isGuildOnly,
      isAdminOnly: !!o.isAdminOnly,
      information: o.meta,
    },
    category: o.category,
    execute: o.execute,
  };
}

export function createCommand(o: Omit<CreateCommand, "data" | "type" | "description" | "name"> & {
  execute(ctx: SlashCommandContext): string | Embed | void | Promise<string | Embed | void>,
  data: EditGlobalApplicationCommand,
}) {
  return {
    data: o.data,
    options: o.options ? o.options : {
      isGuildOnly: !!o.isGuildOnly,
      isAdminOnly: !!o.isAdminOnly,
      information: o.meta,
    },
    category: o.category,
    execute: o.execute,
  };
}

export function Command(o: CreateCommand) {
  return function(target: any) {
    (target as any).data = { ...o.data };
    (target as any).data.name = o.name;
    (target as any).data.type = o.type === undefined ? ApplicationCommandTypes.ChatInput : o.type;

    if (o.description) {
      (target as any).data.description = o.description;
    }

    (target as any).options = {
      isGuildOnly: !!o.isGuildOnly,
      isAdminOnly: !!o.isAdminOnly,
      information: o.meta,
    };
    (target as any).category = o.category;

    if (o.options) (target as any).options = o.options;

    return target;
  }
}
