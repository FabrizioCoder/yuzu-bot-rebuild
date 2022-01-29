import { createMonitor, processButtonCollectors } from "oasis";
import { InteractionTypes, MessageComponentTypes } from "discordeno";

createMonitor({
  name: "onButtonCollected",
  event: "interactionCreate",
  isGuildOnly: true,
  ignoreBots: true,
  execute(_bot, interaction) {
    const { type, data } = interaction;

    if (type !== InteractionTypes.MessageComponent) {
      return;
    } else if (data?.componentType !== MessageComponentTypes.Button) {
      return;
    }

    processButtonCollectors(interaction);

    return;
  },
});
