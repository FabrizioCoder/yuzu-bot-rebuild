import type {
  BotWithCache,
  DiscordenoInteraction,
  DiscordenoMessage,
  EditGlobalApplicationCommand,
  Embed,
  MakeRequired,
} from "../../deps.ts";

import type { Division } from "../utils/mod.ts";

// /commands and !commands
interface CommandOptions {
  guildOnly?: boolean; // if the command can be executed on dm
  adminOnly?: boolean;
  information?: {
    descr?: string; // description
    usage?: string; // duh
    short?: string; // short description
  };
}

type CommandArgs = {
  args: string[];
  prefix: string;
};

type CommandMessageContent =
  | string
  | Embed
  | undefined;

type CommandData<Slash> = Slash extends true
  ? MakeRequired<EditGlobalApplicationCommand, "name">
  : { name: string; description?: undefined; type?: undefined };

type CommandArgumentsPassed<Slash> = Slash extends true
  ? [BotWithCache, DiscordenoInteraction]
  : [BotWithCache, DiscordenoMessage, CommandArgs];

// now supports both slash commands and regular commands
export interface Command<Slash extends boolean = true> {
  // the data (todo)
  data: CommandData<Slash>;
  // if its disabled
  disabled?: boolean;
  options?: Slash extends true ? Omit<CommandOptions, "adminOnly"> : CommandOptions;

  division: Division;

  execute(
    ...args: CommandArgumentsPassed<Slash>
  ): CommandMessageContent | Promise<CommandMessageContent> | PromiseLike<CommandMessageContent>;
}
