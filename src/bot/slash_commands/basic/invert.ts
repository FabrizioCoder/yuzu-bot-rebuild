import { type Context, Command, Option } from "oasis";
import { Category } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

@Option({
  type: ApplicationCommandOptionTypes.String,
  required: true,
  name: "input",
  description: "Invert 🔃",
})
@Command({
  name: "invert",
  description: "Invierte un texto",
  meta: {
    descr: "Invierte un texto hacia arriba",
    short: "Invierte un texto hacia arriba",
    usage: "<Input>",
  },
  category: Category.Fun,
})
export default class {
  static execute({ interaction }: Context) {
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
  }
}
