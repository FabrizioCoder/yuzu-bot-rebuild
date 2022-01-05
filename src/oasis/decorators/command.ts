import type { Information } from "../types/command.ts";
import type { ApplicationCommandOption, EditGlobalApplicationCommand } from "discordeno";

export interface CreateCommand {
  name: string;
  description?: string;
  data?: Omit<EditGlobalApplicationCommand, "name" | "description" | "options">;
  meta?: Partial<Information>;
  isGuildOnly?: boolean;
  isAdminOnly?: boolean;
  category: number;
  options?: ApplicationCommandOption[];
}

export function Command(o: CreateCommand) {
  return function(target: any) {
    (target as any).data = { ...o.data };
    (target as any).data.name = o.name;

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
