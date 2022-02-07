import type {
  ApplicationCommandOption,
  ApplicationCommandTypes,
  DiscordenoInteraction,
  DiscordenoMessage,
  EditGlobalApplicationCommand,
  Embed,
  MakeRequired,
} from "discordeno";
import type { BotWithCache } from "cache_plugin";

import { aliases, commands, slashCommands } from "../cache.ts";

export function createCommand(
  o: Omit<CreateCommand, "data" | "type" | "description" | "name"> & {
    execute(ctx: Context<true>): string | Embed | void | Promise<string | Embed | void>;
    data: MakeRequired<EditGlobalApplicationCommand, "name">;
  }
) {
  const created: Command = {
    data: o.data,
    isGuildOnly: !!o.isGuildOnly,
    isAdminOnly: !!o.isAdminOnly,
    meta: o.meta ? { ...o.meta } : undefined,
    category: o.category,
    execute: o.execute,
    translated: o.translated,
  };
  slashCommands.set(created.data.name!, created);
  return created;
}

export function createMessageCommand(
  o: Omit<CreateCommand, "data" | "type" | "description" | "name"> & {
    execute(ctx: Context<false>): string | Embed | undefined | Promise<string | Embed | void>;
    names: string[];
  }
) {
  const created: Command<false> = {
    data: {
      name: o.names[0],
    },
    isGuildOnly: Boolean(o.isGuildOnly),
    isAdminOnly: Boolean(o.isAdminOnly),
    meta: o.meta ? { ...o.meta } : undefined,
    category: o.category,
    execute: o.execute,
    translated: o.translated,
  };
  commands.set(o.names[0], created);

  for (const alias of o.names.slice(1)) {
    aliases.set(alias, o.names[0]);
  }

  return created;
}

export type Context<T extends boolean = true> = T extends true
  ? {
      bot: BotWithCache;
      interaction: DiscordenoInteraction;
    }
  : {
      bot: BotWithCache;
      message: DiscordenoMessage;
      args: { args: string[]; prefix: string };
    };

export interface CreateCommand {
  type?: ApplicationCommandTypes;
  name: string;
  description?: string;
  data?: Omit<EditGlobalApplicationCommand, "name" | "description" | "options">;
  meta?: {
    descr: string; // description
    usage: string; // duh
  };
  isGuildOnly?: boolean;
  isAdminOnly?: boolean;
  category: number;
  options?: ApplicationCommandOption[];
  translated?: boolean;
}

export interface Command<Slash extends boolean = true> {
  data: Slash extends true ? MakeRequired<EditGlobalApplicationCommand, "name"> : { name: string };
  category: number;
  isGuildOnly: boolean;
  isAdminOnly: boolean;
  meta?: {
    descr: string;
    usage: string;
  };
  execute(ctx: Context<Slash>): string | Embed | void | Promise<string | Embed | void>;
  translated?: boolean;
}
