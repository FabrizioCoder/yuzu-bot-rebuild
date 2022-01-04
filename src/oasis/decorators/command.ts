import type { Information, MessageCommand, SlashCommand } from "../types/command.ts";
import type { ApplicationCommandOption, EditGlobalApplicationCommand } from "discordeno";

export interface CreateCommand {
  name: string;
  description?: string;
  data?: Omit<EditGlobalApplicationCommand, "name" | "description" | "options">;
  meta?: Partial<Information>;
  isGuildOnly?: boolean;
  isAdminOnly?: boolean;
  category: number;
  options: ApplicationCommandOption[];
}

export function Command(o: CreateCommand) {
  return function(target: Function) {
    (target as any).data = {
      name: o.name,
      description: o.description,
      options: o.options,
      ...o.data
    };
    (target as any).options = {
      isGuildOnly: !!o.isGuildOnly,
      isAdminOnly: !!o.isAdminOnly,
      information: o.meta
    };
    (target as any).category = o.category;
  }
}

export function CacheCommand(cache: Map<string, SlashCommand | MessageCommand>, o: CreateCommand) {
  return function(target: Function) {
    const toCache = {
      data: {
        name: o.name,
        description: o.description,
        options: o.options,
        ...o.data,
      },
      options: {
        isGuildOnly: !!o.isGuildOnly,
        isAdminOnly: !!o.isAdminOnly,
        information: o.meta
      },
      category: o.category,
      execute: (target as any).execute as Function,
    }
    cache.set(toCache.data.name, toCache);
  }
}
