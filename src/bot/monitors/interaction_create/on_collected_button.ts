import type { Monitor } from "../../types/monitor.ts";
import { processButtonCollectors } from "utils";
import { InteractionTypes, MessageComponentTypes } from "discordeno";

export default <Monitor> {
  name: "onButtonCollected",
  event: "interactionCreate",
  isGuildOnly: true,
  ignoreBots: true,
  execute(_bot, interaction) {
    const { type, data } = interaction;

    if (type !== InteractionTypes.MessageComponent) {
      return;
    } else if (data?.componentType === MessageComponentTypes.SelectMenu) {
      return;
    }

    processButtonCollectors(interaction);

    return;
  },
};
