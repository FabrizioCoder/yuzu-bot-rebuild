import { createMessageCommand, MessageEmbed } from "oasis";
import * as Utils from "utils";

import * as Discordeno from "discordeno";

Discordeno;

createMessageCommand({
  names: ["eval"],
  isGuildOnly: false,
  isAdminOnly: true,
  category: Utils.Category.Owner,
  execute({ bot, message, args: { args } }) {
    const time = Date.now();
    const input = args.join(" ");

    if (!input) return "Escribe algo.";

    try {
      const output = Deno.inspect(eval(input));

      const { embed } = new MessageEmbed()
        .color(Utils.DiscordColors.Blurple)
        .field("Javascript 🖥", `\`\`\`js\n${output}\`\`\``, true)
        .field("Tiempo ⌛", `\`\`\`ts\n${Date.now() - time}ms\`\`\``, true)
        .field("Entrada 📥", `\`\`\`js\n${input}\`\`\``, true)
        .field("Salida 📤", `\`\`\`ts\n${output}\`\`\``, true)
        .field("Tipo 📋", `\`\`\`ts\n${typeof output}\`\`\``, true)
        .author(`Bot id:${bot.id}`)
        .footer(`Channel id: ${message.channelId}`);

      return embed;
    } catch (error) {
      if (error instanceof Error) {
        return new MessageEmbed({ description: "Error: " + error.message, color: Utils.DiscordColors.Red }).embed;
      }
    }
  },
});
