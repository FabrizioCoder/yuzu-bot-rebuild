import type { Monitor } from "../../types/monitor.ts";
import { processButtonCollectors } from "../../utils/mod.ts";
import { InteractionTypes, MessageComponentTypes } from "../../../deps.ts";

export default <Monitor<"interactionCreate">> {
  name: "onButtonCollected",
  type: "interactionCreate",
  ignoreDM: true,
  ignoreBots: true,
  async execute(_bot, interaction) {
    if (interaction.type === InteractionTypes.MessageComponent) {
      if (
        interaction.data?.componentType === MessageComponentTypes.SelectMenu
      ) {
        return;
      }
      if (interaction.member) {
        processButtonCollectors(interaction);
      }
      return;
    }
  },
};
