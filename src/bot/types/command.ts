import type {
  DiscordenoInteraction,
  DiscordenoMessage,
  EditGlobalApplicationCommand,
  Embed,
  MakeRequired,
} from "discordeno";
import type { BotWithCache } from "cache_plugin";
import type { Category } from "utils";

interface Information {
  descr: string; // description
  usage: string; // duh
  short: string; // short description
}

// /commands and !commands
interface CommandOptions {
  guildOnly: boolean; // if the command can be executed on dm
  adminOnly: boolean;
  information?: Partial<Information>;
}

interface CommandArgs {
  args: string[];
  prefix: string;
}

type CommandMessageContent =
  | string
  | Embed
  | undefined;

type CommandData<Slash> = Slash extends true
  ? MakeRequired<EditGlobalApplicationCommand, "name" | "description">
  : Pick<MakeRequired<EditGlobalApplicationCommand, "name">, "name">;

type CommandArguments<Slash> = Slash extends true
  ? [bot: BotWithCache, interaction: DiscordenoInteraction]
  : [bot: BotWithCache, message: DiscordenoMessage, args: CommandArgs];

// now supports both slash commands and regular commands
export interface Command<Slash extends boolean = true> {
  data: CommandData<Slash>;
  disabled?: "on" | "off";
  options?: CommandOptions
  category?: Category;
  execute(
    ...args: CommandArguments<Slash>
  ): CommandMessageContent | Promise<CommandMessageContent> | PromiseLike<CommandMessageContent>;
}
