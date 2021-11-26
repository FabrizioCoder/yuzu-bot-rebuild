import type { Event } from "../../types/event.ts";
import { cache, processButtonCollectors } from "../../utils/mod.ts";
import {
  InteractionResponseTypes,
  InteractionTypes,
  sendInteractionResponse,
  sendMessage,
} from "../../../deps.ts";

export default <Event<"interactionCreate">> {
  name: "interactionCreate",
  async execute(bot, interaction) {
    if (interaction.type === InteractionTypes.MessageComponent) {
      if (interaction.member) {
        processButtonCollectors(interaction, interaction.member);
      }
      return;
    }

    const command = cache.slashCommands.get(interaction.data?.name!);

    if (!command) return;

    if (!interaction.guildId && command.options?.guildOnly === true) return;

    try {
      // defer the reply
      await sendInteractionResponse(bot, interaction.id, interaction.token, {
        type: InteractionResponseTypes.DeferredChannelMessageWithSource,
      });

      const output = await command.execute(
        bot,
        interaction,
      );

      if (!output) return;

      // response
      await sendInteractionResponse(bot, interaction.id, interaction.token, {
        type: InteractionResponseTypes.DeferredChannelMessageWithSource,
        data: {
          content: typeof output === "string" ? output : "",
          embeds: typeof output !== "string" ? [output] : [],
        },
      });
    } catch (err: unknown) {
      if (!(err instanceof Error)) return;
      sendMessage(bot, interaction.channelId!, err.message).catch(() => {});
    }
  },
};
