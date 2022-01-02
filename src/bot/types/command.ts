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

interface Information {
  descr: string; // description
  usage: string; // duh
  short: string; // short description
}

/* /commands and !commands */
interface CommandOptions {
  isGuildOnly: boolean; // if the command can be executed on dm
  isAdminOnly: boolean;
  information?: Partial<Information>;
}

interface CommandArgs {
  args: string[];
  prefix: string;
}

type Content =
  | Embed
  | string
  | undefined;

type CommandData<Slash> = Slash extends true
  ? MakeRequired<EditGlobalApplicationCommand, "name">
  : Pick<MakeRequired<EditGlobalApplicationCommand, "name">, "name">;

/* the arguments of the callback function */
type CommandArguments<Slash> = Slash extends true
  ? [bot: BotWithCache, interaction: DiscordenoInteraction]
  : [bot: BotWithCache, message: DiscordenoMessage];

type ParsedCommandArguments<Slash> = Slash extends true
  ? [bot: BotWithCache, interaction: DiscordenoInteraction, structs: Structs]
  : [bot: BotWithCache, message: DiscordenoMessage, args: CommandArgs, structs: Structs]

interface Structs {
  channel?: DiscordenoChannel;
  guild?: DiscordenoGuild;
  member?: DiscordenoMember;
  message?: DiscordenoMessage;
  user?: DiscordenoUser;
}

type Using =
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

  execute(...args: ParsedCommandArguments<Slash>): Content | Promise<Content> | PromiseLike<Content>;
}
