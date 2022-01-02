import type { Command } from "../types/command.ts";
import type { Embed } from "discordeno";
import { Category, DiscordColors } from "utils";

export default <Command<false>> {
  options: {
    isGuildOnly: true,
    isAdminOnly: true,
  },
  category: Category.Owner,
  data: {
    name: "eval",
  },
  execute(bot, _message, { args }) {
    const time = Date.now();
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
            value: `\`\`\`ts\n${Date.now() - time}ms\`\`\``,
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
