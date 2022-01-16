import type { Embed, SelectMenuComponent } from "discordeno";
import type { BotWithCache } from "cache_plugin";
import { cache, createMonitor } from "oasis";
import { Category, translate } from "utils";
import { InteractionResponseTypes, InteractionTypes, sendInteractionResponse } from "discordeno";

createMonitor({
  name: "onSelectMenu",
  event: "interactionCreate",
  isGuildOnly: false,
  ignoreBots: true,
  async execute(bot, interaction) {
    if (interaction.type !== InteractionTypes.MessageComponent) return;
    if (interaction.data?.customId === "menu") {
      const baseEmbed = interaction.message?.embeds[0];

      if (!baseEmbed) {
        return;
      }

      const category = interaction.data?.values?.[0];
      const row = interaction.message?.components;

      if (row && category) {
        const commands = [...cache.slashCommands, ...cache.commands]
          .filter(([_, cmd]) => cmd.category === Category[category as keyof typeof Category])
          .map(([_, cmd]) => cmd);

        const commandPairs = commands.map(async ({ data, meta, translated }) => {
          const resolvedPrefix = "description" in data ? "/" : "!";
          const resolvedDescription = "description" in data ? meta?.descr ?? data.description : meta.descr;

          const translatedDescription = await translate(bot as BotWithCache, resolvedDescription!, interaction.guildId);

          return `\`${resolvedPrefix}${data.name}\` -> ${translated ? translatedDescription : resolvedDescription}`;
        });

        baseEmbed.title = String.raw`${await translate(
          bot as BotWithCache,
          "strings:HELP_COMMAND:EMBED_TITLE",
          interaction.guildId
        )}`;
        baseEmbed.fields = [
          {
            name: await translate(bot as BotWithCache, "strings:HELP_COMMAND:CATEGORY", interaction.guildId),
            value: await translate(bot as BotWithCache, "strings:HELP_COMMAND:COMMANDS_LENGTH", interaction.guildId, {
              count: commands.length,
            }),
          },
          {
            name: await translate(bot as BotWithCache, "strings:HELP_COMMAND:COMMANDS", interaction.guildId),
            value: (await Promise.all(commandPairs)).join("\n"),
          },
        ];

        await sendInteractionResponse(bot, interaction.id, interaction.token, {
          type: InteractionResponseTypes.UpdateMessage,
          data: {
            embeds: [baseEmbed as Embed],
            components: [
              {
                type: 1,
                components: row[0].components as [SelectMenuComponent],
              },
            ],
          },
        });
      }
    }
  },
});
