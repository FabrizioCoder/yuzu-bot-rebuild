import type { Monitor } from "../../types/monitor.ts";
import type { Embed, SelectMenuComponent } from "discordeno";
import { InteractionResponseTypes, InteractionTypes, sendInteractionResponse } from "discordeno";
import { cache, Category } from "../../../utils/mod.ts";

export default <Monitor<"interactionCreate">> {
  name: "onSelectMenu",
  type: "interactionCreate",
  ignoreDM: true,
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
          ({ data, options: opts }) =>
            `\`${"description" in data ? "/" : "!"}${data.name}\` -> ${"description" in data ? data.description : opts?.information?.descr ?? opts?.information?.short}`
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
};
