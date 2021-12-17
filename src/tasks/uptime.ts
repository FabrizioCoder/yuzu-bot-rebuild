import type { Task } from "../types/task.ts";
import { Milliseconds, Options } from "../utils/mod.ts";
import { sendMessage } from "../../deps.ts";

export default <Task> {
  name: "uptime",
  interval: Milliseconds.HOUR,
  async execute(bot, _payload, uptime) {
    // time
    const now = Date.now();

    const uptimeMessage = `
    El bot ha estado encendido desde:
      <t:${(now - uptime) / 1000}:R>
      <t:${(now - uptime) / 1000}:F>
      <t:${(now - uptime) / 1000}:d>
    `;

    const channelId = Options.CHANNEL_ID;

    // log
    await sendMessage(
      bot,
      channelId,
      uptimeMessage,
    );
  },
};
