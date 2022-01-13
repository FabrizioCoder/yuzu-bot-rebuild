import type { CreateCommand } from "../types/command.ts";
import { ApplicationCommandTypes } from "discordeno";

export function SetCommand(o: CreateCommand) {
  return function (target: Function) {
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
  };
}
