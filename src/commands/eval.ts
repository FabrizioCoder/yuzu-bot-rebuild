import type { Command } from "../types/command.ts";
import type { Embed } from "../../deps.ts";
import { DiscordColors, Division, Options } from "../utils/mod.ts";

export default <Command<false>> {
  options: {
    guildOnly: true,
    adminOnly: true,
  },
  division: Division.OWNER,
  data: {
    name: "eval",
  },
  execute(bot, message, { args }) {
    // TODO: put this into a monitor
    if (message.authorId !== Options.OWNER_ID) return;

    const ms = Date.now();

    const input = args?.join(" ");

    if (!input) return "Escribe algo.";

    try {
      const output = eval(input);

      return <Embed> {
        author: {
          name: bot.id.toString(),
        },
        color: DiscordColors.Blurple,
        fields: [
          {
            name: "Javascript 🖥",
            value: `\`\`\`js\n${output}\`\`\``,
          },
          {
            name: "Latencia ⌛",
            value: `\`\`\`ts\n${Date.now() - ms}ms\`\`\``,
          },
          {
            name: "Entrada 📥",
            value: `\`\`\`js\n${input}\`\`\``,
          },
          {
            name: "Salida 📤",
            value: `\`\`\`ts\n${output}\`\`\``,
          },
          {
            name: "Tipo 📋",
            value: `\`\`\`ts\n${typeof output}\`\`\``,
          },
        ],
      };
    } catch (error) {
      if (error instanceof Error) {
        return "Error: " + error.message;
      }
    }
  },
};
