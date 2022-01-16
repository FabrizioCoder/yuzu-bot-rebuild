import { createCommand, ChatInputApplicationCommandBuilder } from "oasis";
import { Category } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

createCommand({
  meta: {
    descr: "commands:invert:DESCRIPTION",
    usage: "commands:invert:USAGE",
  },
  category: Category.Fun,
  translated: true,
  execute({ interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return;
    }

    const offset = "!".charCodeAt(0); // Start with the character '!'
    const mapping =
      "¡\"#$%⅋,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;<=>¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~";

    return (option.value as string)
      .split("")
      .map((c) => mapping[c.charCodeAt(0) - offset] ?? " ")
      .reverse()
      .join("");
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("invert")
    .setDescription("Make a text upside down")
    .addStringOption((o) => o.setName("input").setDescription("Text to invert upside down 🔃").setRequired(true))
    .toJSON(),
});
