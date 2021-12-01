import type { Monitor } from "../../types/monitor.ts";
import { processButtonCollectors } from "../../utils/mod.ts";
import { InteractionTypes } from "../../../deps.ts";

export default <Monitor<"interactionCreate">> {
  name: "onButtonCollected",
  kind: "interactionCreate",
  ignoreDM: true,
  ignoreBots: true,
  async execute(_bot, interaction) {
    if (interaction.type === InteractionTypes.MessageComponent) {
      if (interaction.member) {
        processButtonCollectors(interaction, interaction.member);
      }
      return;
    }
  },
};
