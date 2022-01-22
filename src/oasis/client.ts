// deno-lint-ignore-file ban-types

import type { Bot, CreateBotOptions } from "discordeno";
import { createBot, startBot } from "discordeno";

import setupChannel from "./helpers/structures/channel.ts";
import setupGuild from "./helpers/structures/guild.ts";
import setupInteraction from "./helpers/structures/interaction.ts";
import setupMember from "./helpers/structures/member.ts";
import setupMessage from "./helpers/structures/message.ts";
import setupUser from "./helpers/structures/user.ts";

export interface OasisCreateBotOptions extends Omit<CreateBotOptions, "intents" | "token"> {
  plugins?: Array<Function>;
}

export type OasisBot<B extends Bot = Bot> = B;

// classy class
declare class Oasis {
  public options: OasisCreateBotOptions;
  public bot?: OasisBot;
  public constructor(options: OasisCreateBotOptions);
  public start(this: Oasis, token: string, intents: CreateBotOptions["intents"]): Promise<OasisBot>;
}

function Oasis(this: Oasis, options: OasisCreateBotOptions): Oasis {
  if (!new.target) {
    return new Oasis(options);
  }

  this.options = options;

  return this;
}

Oasis.start = async function <B extends Bot>(this: Oasis, token: string, intents: CreateBotOptions["intents"]) {
  const bot = createBot({ ...this.options, token, intents });

  setupChannel(bot);
  setupGuild(bot);
  setupInteraction(bot);
  setupMember(bot);
  setupMessage(bot);
  setupUser(bot);

  this.options.plugins?.reduce((prev, cur) => Object.assign(bot, cur(prev)), bot);

  this.bot = bot;

  await startBot(bot);

  return bot as OasisBot<B>;
};

export { Oasis };
