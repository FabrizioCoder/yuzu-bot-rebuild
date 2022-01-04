import type { Command } from "../../types/command.ts";
import { Category } from "utils";
import { sendMessage } from "discordeno";
import { getRawPaste } from "poke_deno";

export default <Command<false>> {
  options: {
    isGuildOnly: false,
    isAdminOnly: false,
    information: {
      descr: "pokepast.es wrapper",
      short: "pokepast.es wrapper",
      usage: "<Link>",
    },
  },
  category: Category.Info,
  data: {
    name: "paste",
  },
  async execute({ bot, message, args }) {
    const [first, second] = args.args;

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
        content: `\`\`\`ml\n${paste}\`\`\``,
      });
    } else {
      const file = new Blob([paste], { type: "text/plain" });

      await sendMessage(bot, message.channelId, {
        file: [{ blob: file, name: "Pokepaste.ml" }],
      });
    }
  },
};
