import type { Monitor } from "../../types/monitor.ts";
import { sendMessage } from "discordeno";

export default <Monitor<"messageCreate">> {
  name: "mentionMonitor",
  type: "messageCreate",
  ignoreDM: false,
  ignoreBots: true,
  async execute(bot, message) {
    const prefix = "!";
    const mention = new RegExp(`^<@!?${bot.id.toString()}>( |)$`);

    if (message.content.match(mention)) {
      await sendMessage(bot, message.channelId, { content: `Mi prefix es ${prefix}` });
    }
  },
};