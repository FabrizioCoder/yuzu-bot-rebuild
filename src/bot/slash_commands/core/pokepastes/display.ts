import type { Context } from "oasis";
import { Command, Option } from "oasis";
import { Category } from "utils";
import { ApplicationCommandOptionTypes, sendMessage } from "discordeno";
import { getRawPaste } from "poke_deno";

@Option({
  type: ApplicationCommandOptionTypes.Boolean,
  name: "plaintext",
  description: "To send in plain text or a file",
})
@Option({
  type: ApplicationCommandOptionTypes.String,
  name: "link",
  required: true,
  description: "Link from pokepast.es"
})
@Command({
  name: "paste",
  description: "pokepast.es wrapper",
  category: Category.Info,
  meta: {
    descr: "pokepast.es wrapper",
    short: "pokepast.es wrapper",
    usage: "<Link>",
  },
})

export default class {
  static async execute({ bot, interaction }: Context) {
    if (!interaction.channelId) return;

    const link = interaction.data?.options?.[0];
    const flag = interaction.data?.options?.[1];

    const idRegex = new RegExp("(?:.es/)(.+)", "g");
    const pasteId = idRegex.exec(link?.value as string)?.[1];

    if (!pasteId) {
      return "Link no encontrado";
    }

    const { paste } = await getRawPaste(pasteId);

    if (flag) {
      await sendMessage(bot, interaction.channelId, {
        content: `\`\`\`md\n${paste}\`\`\``,
      });
    } else {
      const file = new Blob([paste], { type: "text/plain" });

      await sendMessage(bot, interaction.channelId, {
        file: [{ blob: file, name: "Pokepaste.md" }],
      });
    }
  }
}
