import type { Event } from "../../types/event.ts";
import { cache } from "../../utils/mod.ts";
import {
  InteractionResponseTypes,
  sendInteractionResponse,
  sendMessage,
} from "../../../deps.ts";

export default <Event<"interactionCreate">> {
  name: "interactionCreate",
  async execute(bot, interaction) {
    // this code is shit but it works
    const command = cache.slashCommands.get(
      interaction.data?.name as string,
    );

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
