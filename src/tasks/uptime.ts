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
    <t:${(now - uptime)}:R>
    <t:${(now - uptime)}:F>
    <t:${(now - uptime)}:d>
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
