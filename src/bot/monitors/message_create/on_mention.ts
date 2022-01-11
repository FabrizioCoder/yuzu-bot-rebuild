import { createMonitor } from "oasis";
import { sendMessage } from "discordeno";

createMonitor({
  name: "mentionMonitor",
  event: "messageCreate",
  isGuildOnly: false,
  ignoreBots: true,
  async execute(bot, message) {
    const prefix = "!";
    const mention = new RegExp(`^<@!?${bot.id.toString()}>( |)$`);

    if (message.content.match(mention)) {
      await sendMessage(bot, message.channelId, { content: `Mi prefix es ${prefix}` });
    }
  },
});
