import type { Command } from "../../types/command.ts";
// import type { Embed } from "discordeno";
import { Category } from "utils";
import { sendMessage } from "discordeno";
import { getPaste, parseTeamToString } from "poke_deno";

export default <Command<false>>{
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
    const [link] = args;

    const idRegex = new RegExp("(?:.es/)(.+)", "g");
    const pasteId = idRegex.exec(link)?.[1];

    if (pasteId) {
      const { paste } = await getPaste(pasteId);

      const pasteString = parseTeamToString(paste.pokes);

      const file = new Blob([pasteString], { type: "text/plain" });

      await sendMessage(bot, message.channelId, {
        file: [{ blob: file, name: "Pokepaste.ml" }],
      });
      return;
    }
    return "Link no encontrado";
  },
};
