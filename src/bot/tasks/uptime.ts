import { createTask, Milliseconds } from "oasis";
import { Configuration, logger } from "utils";
import { sendMessage } from "discordeno";

createTask({
  name: "uptime",
  interval: Milliseconds.Hour * 12,
  async execute(bot, _payload, uptime) {
    const uptimeMessage =
      "El bot ha estado encendido desde:\n" +
      `-> <t:${Math.floor(uptime / 1000)}:R>\n` +
      `-> <t:${Math.floor(uptime / 1000)}:F>`;

    // log
    await sendMessage(bot, Configuration.CHANNEL_ID, { content: uptimeMessage }).catch(logger.error);
  },
});
