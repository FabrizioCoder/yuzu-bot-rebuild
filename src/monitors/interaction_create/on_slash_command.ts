import type { Monitor } from "../../types/monitor.ts";
import { cache } from "../../utils/mod.ts";
import {
  CachePlugin,
  InteractionResponseTypes,
  InteractionTypes,
  sendInteractionResponse,
} from "../../../deps.ts";

export default <Monitor<"interactionCreate">> {
  name: "onSlashCommand",
  type: "interactionCreate",
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

    const output = await command.execute(
      bot as CachePlugin.BotWithCache,
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
  },
};
