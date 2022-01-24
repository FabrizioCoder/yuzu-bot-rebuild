// deno-lint-ignore-file ban-types

import type { Bot, CreateBotOptions } from "discordeno";
import { createBot, startBot } from "discordeno";

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

export async function start<B extends Bot>(
  options: OasisCreateBotOptions,
  token: string,
  intents: CreateBotOptions["intents"]
) {
  const bot = createBot({ ...options, token, intents });

  options.plugins?.reduce((prev, cur) => Object.assign(bot, cur(prev)), bot);

  await startBot(bot);

  return bot as OasisBot<B>;
}

Oasis.prototype.start = async function (this: Oasis, token: string, intents: CreateBotOptions["intents"]) {
  const bot = await start(this.options, token, intents);

  this.bot = bot;

  return bot;
};

export { Oasis };
