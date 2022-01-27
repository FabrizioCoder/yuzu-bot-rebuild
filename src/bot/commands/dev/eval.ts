import * as Oasis from "oasis";
import * as Utils from "utils";
import * as Discord from "discordeno";

Oasis.createMessageCommand({
  names: ["eval"],
  isGuildOnly: false,
  isAdminOnly: true,
  category: Utils.Category.Owner,
  async execute({ bot, message, args: { args } }) {
    const input = args.join(" ");

    if (!input) {
      return "Escribe algo.";
    }

    const offset = (str: string) => {
      return `\`\`\`js\n${str}\n\`\`\``;
    };

    const asyncEval = (code: string, returns = false) => {
      return `(async()=>{\n${!returns ? `return ${code.trim()}` : `${code.trim()}`}\n})()`;
    };

    try {
      const parsed = input.startsWith("```js") && input.endsWith("```") ? input.substring(5, input.length - 3) : input;
      const startedAt = Date.now();
      const evaluated = await eval(asyncEval(parsed, parsed.includes("return")));
      const result = typeof evaluated === "string" ? evaluated : Deno.inspect(evaluated);

      if (result.length >= Oasis.Limits.Description - offset("").length) {
        await Discord.sendMessage(bot, message.channelId, {
          file: [{ name: "Content.js", blob: new Blob([result]) }],
          content: `<@${message.authorId}>`,
        });
        return;
      }

      const { embed } = new Oasis.MessageEmbed()
        .author(message.tag)
        .color(Utils.DiscordColors.Blurple)
        .description(offset(result))
        .field("Type", typeof evaluated)
        .footer(`Execution time: ${Math.ceil((Date.now() - startedAt) / 2)}ms`);

      return embed;
    } catch (error) {
      if (error instanceof Error) {
        return new Oasis.MessageEmbed({
          description: `Error: ${error.cause} ${error.message}`,
          color: Utils.DiscordColors.Red,
        }).embed;
      }
    }
  },
});
