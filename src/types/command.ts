import type {
  Bot,
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
  // if is disabled
  disabled?: boolean;
  information?: {
    descr?: string; // description
    usage?: string; // duh
    short?: string; // short description
  };
}

const enum CommandTypes {
  Slash,
  Normal,
}

type CommandArgs = {
  args: string[];
};

type CommandMessageContent =
  | string
  | Embed
  | undefined;

type CommandData<Slash> = Slash extends true
  ? MakeRequired<EditGlobalApplicationCommand, "name">
  : string;

type CommandArgumentsPassed<Slash> = Slash extends true
  ? [Bot, DiscordenoInteraction]
  : [Bot, DiscordenoMessage, CommandArgs];

// now supports both slash commands and regular commands

export interface Pipelines {
  onBefore?(bot: Bot, interaction: DiscordenoInteraction): boolean;
  onCancel?(
    bot: Bot,
    interaction: DiscordenoInteraction,
  ): Embed | string;
}

export interface Command<Slash extends boolean = true> extends Pipelines {
  // the data (todo)
  data: CommandData<Slash>;
  // if its disabled
  disabled?: boolean;
  options?: CommandOptions;

  division?: Division;

  type?: CommandTypes;

  execute(
    ...args: CommandArgumentsPassed<Slash>
  ): CommandMessageContent | Promise<CommandMessageContent>;
}

export type NonSlashCommand = Command<false> & {
  type: CommandTypes.Normal;
};

export type SlashCommand = Command<true> & {
  type: CommandTypes.Slash;
};
