import { createCommand, ChatInputApplicationCommandBuilder } from "oasis";
import { Category } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

createCommand({
  meta: {
    descr: "Invierte un texto",
    short: "Invierte un texto",
    usage: "<Input>",
  },
  category: Category.Fun,
  execute({ interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type === ApplicationCommandOptionTypes.String) {
      return (option.value as string).split("").reverse().join("");
    }
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("reverse")
    .setDescription("Invierte un texto")
    .addStringOption((o) => o.setName("input").setDescription("Text to reverse 🔄").setRequired(true))
    .toJSON(),
});
