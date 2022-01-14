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

export interface Information {
  descr: string; // description
  usage: string; // duh
  short: string; // short description
}

export interface SlashCommandContext {
  bot: BotWithCache;
  interaction: DiscordenoInteraction;
}

export interface SlashCommand {
  data: EditGlobalApplicationCommand;
  category: number;
}

export interface MessageCommandContext {
  bot: BotWithCache;
  message: DiscordenoMessage;
  args: { args: string[]; prefix: string };
}

export interface MessageCommand {
  names: string[];
  category: number;
}

export type Context<T extends boolean = true> = T extends true ? SlashCommandContext : MessageCommandContext;

export interface CreateCommand {
  type?: ApplicationCommandTypes;
  name: string;
  description?: string;
  data?: Omit<EditGlobalApplicationCommand, "name" | "description" | "options">;
  meta?: Partial<Information>;
  isGuildOnly?: boolean;
  isAdminOnly?: boolean;
  category: number;
  options?: ApplicationCommandOption[];
}

export interface Command<Slash extends boolean = true> {
  data: Slash extends true ? MakeRequired<EditGlobalApplicationCommand, "name"> : { name: string };
  category: number;
  isGuildOnly: boolean;
  isAdminOnly: boolean;
  meta: Partial<Information>;
  execute(
    ctx: Slash extends true ? SlashCommandContext : MessageCommandContext
  ): string | Embed | void | Promise<string | Embed | void>;
}
