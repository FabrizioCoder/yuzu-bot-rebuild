// deno-lint-ignore-file ban-types

import type { Bot, CreateBotOptions } from "https://deno.land/x/discordeno@13.0.0-rc19/mod.ts";
import { createBot, startBot } from "https://deno.land/x/discordeno@13.0.0-rc19/mod.ts";

export interface OasisCreateBotOptions extends Omit<CreateBotOptions, "intents" | "token"> {
  plugins?: Array<Function>;
}

// classy class
declare class Oasis {
  public options: OasisCreateBotOptions;
  public bot: Bot;
  public constructor(options: OasisCreateBotOptions);
  public start(this: Oasis, token: string, intents: CreateBotOptions["intents"]): Promise<Bot>;
}

function Oasis(this: Oasis, options: OasisCreateBotOptions): Oasis {
  if (!new.target) {
    return new Oasis(options);
  }

  this.options = options;

  return this;
}

export function OasisMake(options: OasisCreateBotOptions) {
  return new Oasis(options);
}

export async function start<B extends Bot>(
  options: OasisCreateBotOptions,
  token: string,
  intents: CreateBotOptions["intents"]
) {
  const bot = createBot({ ...options, token, intents });

  options.plugins?.reduce((prev, cur) => Object.assign(bot, cur(prev)), bot);

  await startBot(bot);

  return bot as B;
}

Oasis.prototype.start = async function (this: Oasis, token: string, intents: CreateBotOptions["intents"]) {
  const bot = await start(this.options, token, intents);

  this.bot = bot;

  return bot;
};

export { Oasis };
