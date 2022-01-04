import { type Context, Command, MessageEmbed, Stop } from "oasis";
import { Category, Configuration, DiscordColors } from "utils";

@Command({
  name: "eval",
  isGuildOnly: false,
  isAdminOnly: true,
  category: Category.Owner
})
export default class {
  @Stop<false>((ctx) => ctx.message.authorId !== Configuration.OWNER_ID)
  static execute({ bot, message, args: { args } }: Context<false>) {
    const time = Date.now();
    const input = args.join(" ");

    if (!input) return "Escribe algo.";

    try {
      const output = eval(input);

      return MessageEmbed
        .new()
        .color(DiscordColors.Blurple)
        .field("Javascript 🖥", `\`\`\`js\n${output}\`\`\``, true)
        .field("Tiempo ⌛", `\`\`\`ts\n${Date.now() - time}ms\`\`\``, true)
        .field("Entrada 📥", `\`\`\`js\n${input}\`\`\``, true)
        .field("Salida 📤", `\`\`\`ts\n${output}\`\`\``, true)
        .field("Tipo 📋", `\`\`\`ts\n${typeof output}\`\`\``, true)
        .author(`Bot id:${bot.id}`)
        .footer(`Channel id: ${message.channelId}`)
        .end();

    } catch (error: unknown) {
      if (error instanceof Error) {
        return MessageEmbed.new({ description: "Error: " + error.message, color: DiscordColors.Red }).end();
      }
    }
  }
}
