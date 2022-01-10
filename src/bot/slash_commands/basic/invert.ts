import { createCommand, ChatInputApplicationCommandBuilder } from "oasis";
import { Category } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

export default createCommand({
  meta: {
    descr: "Invierte un texto hacia arriba",
    short: "Invierte un texto hacia arriba",
    usage: "<Input>",
  },
  category: Category.Fun,
  execute({ interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return;
    }

    const mapping = "¡\"#$%⅋,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;<=>¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~";
    const offset = "!".charCodeAt(0); // Start with the character '!'

    if ((option.value as string).length < 1) {
      return "Escribe algo";
    }

    return (option.value as string)
      .split("")
      .map((c) => mapping[c.charCodeAt(0) - offset] ?? " ")
      .reverse()
      .join("");
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("invert")
    .setDescription("Invierte un texto")
    .addStringOption((o) => o.setName("input").setDescription("Text to invert 🔃").setRequired(true))
    .toJSON(),
});
