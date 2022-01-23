import type {
  Bot,
  DiscordenoInteraction,
  InteractionResponseTypes,
  InteractionApplicationCommandCallbackData,
} from "discordeno";
import type { Helper, Tail } from "../../types/utility.ts";

export interface OasisInteraction extends DiscordenoInteraction {
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
  getOriginalInteractionResponse(): ReturnType<Helper<"getOriginalInteractionResponse">>;
}

export function makeInteraction(bot: Bot, interaction: DiscordenoInteraction): OasisInteraction {
  return {
    ...interaction,
    sendResponse(type: InteractionResponseTypes, data?: InteractionApplicationCommandCallbackData, priv = false) {
      return bot.helpers.sendInteractionResponse(this.id, this.token, { type, data, private: priv });
    },
    getOriginalInteractionResponse: bot.helpers.getOriginalInteractionResponse.bind(null, interaction.token),
    deleteFollowupMessage: bot.helpers.deleteFollowupMessage.bind(null, interaction.token),
    editFollowupMessage: bot.helpers.editFollowupMessage.bind(null, interaction.token),
    getFollowupMessage: bot.helpers.getFollowupMessage.bind(null, interaction.token),
  };
}

export default function (bot: Bot) {
  bot.transformers.interaction = (bot, payload) => makeInteraction(bot, bot.transformers.interaction(bot, payload));
  return bot;
}
