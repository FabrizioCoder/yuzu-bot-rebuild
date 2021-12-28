import type { Task } from "../types/task.ts";
import { Milliseconds, Configuration, logger } from "utils";
import { sendMessage } from "discordeno";

export default <Task> {
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
};
