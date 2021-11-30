import type { Monitor } from "../../types/monitor.ts";
import { cache } from "../../utils/mod.ts";
import {
  InteractionResponseTypes,
  InteractionTypes,
  sendInteractionResponse,
} from "../../../deps.ts";

export default <Monitor<"interactionCreate">> {
  name: "onSlashCommand",
  kind: "interactionCreate",
  ignoreDM: true,
  ignoreBots: true,
  async execute(bot, interaction) {
    if (interaction.type !== InteractionTypes.ApplicationCommand) return;

    const command = cache.slashCommands.get(interaction.data?.name!);

    if (!command) return;

    if (!interaction.guildId && command.options?.guildOnly === true) return;

    // defer the reply
    await sendInteractionResponse(bot, interaction.id, interaction.token, {
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    });

    if (command.onBefore && command.onCancel) {
      const rejection = command.onBefore(bot, interaction);
      if (rejection) {
        const cancel = command.onCancel(bot, interaction);
        await sendInteractionResponse(
          bot,
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.DeferredChannelMessageWithSource,
            data: {
              content: typeof cancel === "string" ? cancel : "",
              embeds: typeof cancel !== "string" ? [cancel] : [],
            },
          },
        );
        return;
      }
    }

    const output = await command.execute(bot, interaction);

    if (!output) return;

    // response
    await sendInteractionResponse(bot, interaction.id, interaction.token, {
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
      data: {
        content: typeof output === "string" ? output : "",
        embeds: typeof output !== "string" ? [output] : [],
      },
    });
  },
};
