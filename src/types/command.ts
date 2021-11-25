import type {
  Bot,
  DiscordenoInteraction,
  DiscordenoMessage,
  EditGlobalApplicationCommand,
  Embed,
  MakeRequired,
} from "../deps.ts";

type CommandMessageContent =
  | string
  | Embed
  | undefined;

// /commands and !commands
interface CommandOptions {
  guildOnly?: boolean; // if the command can be executed on dm
  adminOnly?: boolean;
  // if is disabled
  disabled?: boolean;
  information?: {
    descr?: string; // description
    usage?: string; // duh
    short?: string; // short description
  };
}

type CommandData<T> = T extends true
  ? MakeRequired<EditGlobalApplicationCommand, "name">
  : string;

type CommandArguments<T> = T extends true ? [Bot, DiscordenoInteraction]
  : [Bot, DiscordenoMessage, string[]];

// now supports both slash commands and regular commands
export interface Command<Slash extends boolean = true> {
  // the data (todo)
  data: CommandData<Slash>;
  // if its disabled
  disabled?: boolean;
  options?: CommandOptions;
  // both slash and regular commands!
  execute(
    ...args: CommandArguments<Slash>
  ): CommandMessageContent | Promise<CommandMessageContent>;
}
