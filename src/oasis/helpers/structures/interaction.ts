// deno-lint-ignore-file no-empty-interface

import type {
  Bot,
  DiscordenoInteraction,
  InteractionResponseTypes,
  InteractionApplicationCommandCallbackData,
} from "discordeno";
import type { Helper, Tail } from "../../types/utility.ts";

export interface OasisInteraction {
  sendResponse(
    type: InteractionResponseTypes,
    data?: InteractionApplicationCommandCallbackData,
    priv?: boolean
  ): ReturnType<Helper<"sendInteractionResponse">>;
  deleteFollowupMessage(
    ...[messageId]: Tail<Parameters<Helper<"deleteFollowupMessage">>>
  ): ReturnType<Helper<"deleteFollowupMessage">>;
  editFollowupMessage(
    ...[messageId, options]: Tail<Parameters<Helper<"editFollowupMessage">>>
  ): ReturnType<Helper<"editFollowupMessage">>;
  getFollowupMessage(
    ...[messageId]: Tail<Parameters<Helper<"getFollowupMessage">>>
  ): ReturnType<Helper<"getFollowupMessage">>;
}

declare module "discordeno" {
  interface DiscordenoInteraction extends OasisInteraction {
    // pass
  }
}

export default function (bot: Bot) {
  const { interaction } = bot.transformers;

  bot.transformers.interaction = function (bot, { ...rest }) {
    const payload = interaction(bot, rest);

    const data = {
      ...payload,
      sendResponse(type: InteractionResponseTypes, data?: InteractionApplicationCommandCallbackData, priv = false) {
        return bot.helpers.sendInteractionResponse(this.id, this.token, { type, data, private: priv });
      },
      getOriginalInteractionResponse: bot.helpers.getOriginalInteractionResponse.bind(null, payload.token),
      deleteFollowupMessage: bot.helpers.deleteFollowupMessage.bind(null, payload.token),
      editFollowupMessage: bot.helpers.editFollowupMessage.bind(null, payload.token),
      getFollowupMessage: bot.helpers.getFollowupMessage.bind(null, payload.token),
    };

    return data as DiscordenoInteraction & OasisInteraction;
  };

  return bot;
}
