import type { CreateCommand, MessageCommandContext, SlashCommandContext } from "../types/command.ts";
import type { Embed } from "discordeno";
import { ApplicationCommandTypes } from "discordeno";

export type O1 = Omit<CreateCommand, "data" | "type" | "description">
  & { execute(ctx: MessageCommandContext): string | Embed | undefined | Promise<string | Embed | void> }

export function createMessageCommand(o: O1) {
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
  };
}

export type O2 = CreateCommand & { execute(ctx: SlashCommandContext): string | Embed | void }

export function createCommand(o: O2) {
  return {
    data: {
      name: o.name,
      description: o.description,
      type: o.type === undefined ?  ApplicationCommandTypes.ChatInput : o.type,
      ...o.data,
    },
    options: o.options ? o.options : {
      isGuildOnly: !!o.isGuildOnly,
      isAdminOnly: !!o.isAdminOnly,
      information: o.meta,
    },
    category: o.category,
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
      information: o.meta
    };
    (target as any).category = o.category;

    if (o.options) (target as any).options = o.options;

    return target;
  }
}
