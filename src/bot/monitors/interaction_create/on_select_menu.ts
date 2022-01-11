import type { Embed, SelectMenuComponent } from "discordeno";
import { cache, createMonitor } from "oasis";
import { Category } from "utils";
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

      if (!baseEmbed) return;

      const category = interaction.data?.values?.[0];
      const row = interaction.message?.components;

      if (row && category) {
        const commands = [...cache.slashCommands, ...cache.commands]
          .filter(([_, cmd]) => cmd.category === Category[category as keyof typeof Category])
          .map(([_, cmd]) => cmd);

        const commandPairs = commands.map(
          ({ data, meta }) =>
            `\`${"description" in data ? "/" : "!"}${data.name}\` -> ${
              "description" in data ? data.description : meta?.descr ?? meta?.short
            }`
        );

        baseEmbed.title = String.raw`Información del comando 💣`;
        baseEmbed.fields = [
          {
            name: "Categoría",
            value: `${commands.length} Comandos`,
          },
          {
            name: "Comandos",
            value: `${commandPairs.join("\n")}`,
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
