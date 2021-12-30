import type { Command } from "../../types/command.ts";
import { Category } from "utils";
import { sendMessage } from "discordeno";
import { getPaste, parseTeamToString } from "poke_deno";

export default <Command<false>> {
  options: {
    guildOnly: false,
    adminOnly: false,
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
  async execute(bot, message, { args }) {
    const [head, ...tail] = args;

    const isMobileVersion = head === "--mobile" || head === "-m";
    const link = isMobileVersion ? tail[0] : head;
    const idRegex = new RegExp("(?:.es/)(.+)", "g");
    const pasteId = idRegex.exec(link)?.[1];

    if (!pasteId) {
      return "Link no encontrado";
    }

    const { paste } = await getPaste(pasteId);

    const pasteString = parseTeamToString(paste.pokes);

    if (isMobileVersion) {
      await sendMessage(bot, message.channelId, {
        content: `\`\`\`ml\n${pasteString}\`\`\``,
      });
      // end
    } else {
      const file = new Blob([pasteString], { type: "text/plain" });

      await sendMessage(bot, message.channelId, {
        file: [{ blob: file, name: "Pokepaste.ml" }],
      });
      // end
    }
  },
};
