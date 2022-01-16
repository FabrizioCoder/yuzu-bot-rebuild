import { createCommand, createMessageCommand, ChatInputApplicationCommandBuilder } from "oasis";
import { Category } from "utils";
import { sendMessage } from "discordeno";
import { getRawPaste } from "poke_deno";

createCommand({
  meta: {
    descr: "commands:display:DESCRIPTION",
    usage: "commands:display:USAGE",
  },
  category: Category.Info,
  async execute({ bot, interaction }) {
    if (!interaction.channelId) return;

    const link = interaction.data?.options?.[0];
    const flag = interaction.data?.options?.[1];

    const idRegex = new RegExp("(?:.es/)(.+)", "g");
    const pasteId = idRegex.exec(link?.value as string)?.[1];

    if (!pasteId) {
      return "commands:display:ON_MISSING_LINK";
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
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("paste")
    .setDescription("pokepast.es wrapper!")
    .addStringOption((o) => o.setName("link").setDescription("Link from https://pokepast.es/").setRequired(true))
    .addBooleanOption((o) => o.setName("plaintext").setDescription("To send in plain text or inside a file"))
    .toJSON(),
});

createMessageCommand({
  names: ["paste"],
  category: Category.Info,
  meta: {
    descr: "commands:display:DESCRIPTION",
    usage: "commands:display:USAGE",
  },
  async execute({ bot, message, args: { args } }) {
    const [first, second] = args;

    const hasMobileFlag = first === "--mobile" || first === "-m";
    const link = hasMobileFlag ? second : first;
    const idRegex = new RegExp("(?:.es/)(.+)", "g");
    const pasteId = idRegex.exec(link)?.[1];

    if (!pasteId) {
      return "commands:display:ON_MISSING_LINK";
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
  },
});
