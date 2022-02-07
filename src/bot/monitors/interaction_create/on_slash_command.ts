import type { BotWithCache } from "cache_plugin";
import { CommandoCache, createMonitor } from "oasis/commando";
import { InteractionResponseTypes, InteractionTypes, sendInteractionResponse } from "discordeno";
import { botHasGuildPermissions } from "permissions_plugin";
import { translate } from "utils";

createMonitor({
  name: "onSlashCommand",
  event: "interactionCreate",
  isGuildOnly: false,
  ignoreBots: true,
  async execute(bot, interaction) {
    if (interaction.type !== InteractionTypes.ApplicationCommand) return;

    const command = CommandoCache.slashCommands.get(interaction.data?.name!);

    if (!command) return;

    // defer the reply

    await sendInteractionResponse(bot, interaction.id, interaction.token, {
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    });

    // if the bot can't send messages
    if (interaction.guildId) {
      const canSendMessages = botHasGuildPermissions(bot as BotWithCache, interaction.guildId, ["SEND_MESSAGES"]);

      if (!canSendMessages) {
        return;
      }
    }

    // CHECKS

    if (!interaction.guildId && command.isGuildOnly) {
      await sendInteractionResponse(bot, interaction.id, interaction.token, {
        type: InteractionResponseTypes.DeferredChannelMessageWithSource,
        data: {
          content: await translate(bot as BotWithCache, "strings:COMMAND_IS_GUILDONLY", interaction.guildId),
        },
        private: true,
      });
      return;
    }

    // END CHECKS
    const output = await command.execute({
      bot: bot as BotWithCache,
      interaction,
    });

    // PERMISSIONS

    if (interaction.guildId) {
      const canSendEmbeds = botHasGuildPermissions(bot as BotWithCache, interaction.guildId, ["EMBED_LINKS"]);

      if (typeof output !== "string" && !canSendEmbeds) {
        await sendInteractionResponse(bot, interaction.id, interaction.token, {
          type: InteractionResponseTypes.DeferredChannelMessageWithSource,
          data: {
            content: await translate(bot as BotWithCache, "string:BOT_CANNOT_SEND_EMBEDS", interaction.guildId),
          },
          private: true,
        });
      }
    }

    // END PERMISSIONS

    if (!output) return;

    // response
    await sendInteractionResponse(bot, interaction.id, interaction.token, {
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
      data: {
        content:
          typeof output === "string"
            ? command.translated
              ? await translate(bot as BotWithCache, output, interaction.guildId)
              : output
            : "",
        embeds: typeof output !== "string" ? [output] : [],
        allowedMentions: { users: [], roles: [] },
      },
    });
  },
});
