import type { Monitor } from "../../types/monitor.ts";
import type { BotWithCache } from "../../../deps.ts";
import { cache, Options } from "../../utils/mod.ts";
import {
  InteractionResponseTypes,
  InteractionTypes,
  sendInteractionResponse,
  sendMessage,
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

    await sendMessage(
      bot,
      Options.CHANNEL_ID,
      `Comando ${command.data.name} ejecutado por ${interaction.user.username}${interaction.user.discriminator}`,
    );

    const output = await command.execute(bot as BotWithCache, interaction);

    if (!output) return;

    // response
    await sendInteractionResponse(bot, interaction.id, interaction.token, {
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
      data: {
        content: typeof output === "string" ? output : "",
        embeds: typeof output !== "string" ? [output] : [],
        allowedMentions: { users: [], roles: [] },
      },
    });
  },
};
