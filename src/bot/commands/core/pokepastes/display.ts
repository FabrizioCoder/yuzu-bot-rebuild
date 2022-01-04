import { type Context, Command } from "oasis";
import { Category } from "utils";
import { sendMessage } from "discordeno";
import { getRawPaste } from "poke_deno";

@Command({
  name: "paste",
  category: Category.Info,
  meta: {
    descr: "pokepast.es wrapper",
    short: "pokepast.es wrapper",
    usage: "<Link>",
  },
})
export default class {
  static async execute({ bot, message, args: { args } }: Context<false>) {
    const [first, second] = args;

    const hasMobileFlag = first === "--mobile" || first === "-m";
    const link = hasMobileFlag ? second : first;
    const idRegex = new RegExp("(?:.es/)(.+)", "g");
    const pasteId = idRegex.exec(link)?.[1];

    if (!pasteId) {
      return "Link no encontrado";
    }

    const { paste } = await getRawPaste(pasteId);

    if (hasMobileFlag) {
      await sendMessage(bot, message.channelId, {
        content: `\`\`\`md\n${paste}\`\`\``,
      });
    } else {
      const file = new Blob([paste], { type: "text/plain" });

      await sendMessage(bot, message.channelId, {
        file: [{ blob: file, name: "Pokepaste.md" }],
      });
    }
  }
}
