import type { Command } from "../types/command.ts";
import { Division } from "../utils/mod.ts";
import { ApplicationCommandOptionTypes } from "../../deps.ts";

export default <Command> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Invierte un texto hacia arriba",
      short: "Invierte un texto hacia arriba",
      usage: "<Input>",
    },
  },
  division: Division.FUN,
  data: {
    name: "invert",
    description: "Invierte un texto",
    options: [
      {
        type: ApplicationCommandOptionTypes.String,
        required: true,
        name: "input",
        description: "Invert 🔃",
      },
    ],
  },
  async execute(_, interaction) {
    const option = interaction.data?.options?.[0];

    if (option?.type === ApplicationCommandOptionTypes.String) {
      const MAPPING =
        "¡\"#$%⅋,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;<=>¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~";
      const OFFSET = "!".charCodeAt(0); // Start with the character '!'

      if ((option.value as string).length < 1) {
        return "Escribe algo";
      }

      return (option.value as string)
        .split("")
        .map((c) => c.charCodeAt(0) - OFFSET)
        .map((c) => MAPPING[c] ?? " ")
        .reverse()
        .join("");
    }
  },
};
