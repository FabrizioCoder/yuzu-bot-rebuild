import type { DiscordenoInteraction, DiscordenoMessage, EditGlobalApplicationCommand } from "discordeno";
import type { BotWithCache } from "cache_plugin";

export interface Information {
  descr: string; // description
  usage: string; // duh
  short: string; // short description
}

export interface SlashCommandContext {
  bot: BotWithCache,
  interaction: DiscordenoInteraction,
}

export interface SlashCommand {
  data: EditGlobalApplicationCommand,
  category: number;
}

export interface MessageCommandContext {
  bot: BotWithCache;
  message: DiscordenoMessage;
  args: { args: string[], prefix: string };
}

export interface MessageCommand {
  data: { name: string };
  category: number;
}

export type Context<T extends boolean = true> = T extends true
  ? SlashCommandContext
  : MessageCommandContext;
