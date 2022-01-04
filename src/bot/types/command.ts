import type { Category } from "utils";
import type {
  DiscordenoChannel,
  DiscordenoGuild,
  DiscordenoInteraction,
  DiscordenoMember,
  DiscordenoMessage,
  DiscordenoUser,
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

/* /commands and !commands */
export interface CommandOptions {
  isGuildOnly: boolean; // if the command can be executed on dm
  isAdminOnly: boolean;
  information?: Partial<Information>;
}

export interface CommandArgs {
  args: string[];
  prefix: string;
}

export type Content =
  | Embed
  | string
  | undefined;

export type CommandData<Slash> = Slash extends true
  ? MakeRequired<EditGlobalApplicationCommand, "name">
  : Pick<MakeRequired<EditGlobalApplicationCommand, "name">, "name">;

/* the arguments of the callback function */
export type CommandArguments<Slash> = Slash extends true
  ? { bot: BotWithCache, interaction: DiscordenoInteraction }
  : { bot: BotWithCache, message: DiscordenoMessage };

export type ParsedCommandArguments<Slash> = Slash extends true
  ? { bot: BotWithCache, interaction: DiscordenoInteraction }
  : { bot: BotWithCache, message: DiscordenoMessage, args: CommandArgs, structs: Structs };

export interface Structs {
  channel?: DiscordenoChannel;
  guild?: DiscordenoGuild;
  member?: DiscordenoMember;
  message?: DiscordenoMessage;
  user?: DiscordenoUser;
}

export type Using =
  | "channel"
  | "guild"
  | "member"
  | "message"
  | "user";

// now supports both slash commands and regular commands
export interface Command<Slash extends boolean = true> {
  data: CommandData<Slash>;
  options?: Slash extends true ? Omit<CommandOptions, "isAdminOnly"> : CommandOptions;
  category?: Category;
  using?: Using[];

  execute(ctx: ParsedCommandArguments<Slash>): Content | Promise<Content> | PromiseLike<Content>;
}
