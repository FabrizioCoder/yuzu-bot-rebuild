import type { Task } from "../types/task.ts";
import { Milliseconds, Options } from "../utils/mod.ts";
import { sendMessage } from "../../deps.ts";

export default <Task>{
  name: "uptime",
  interval: Milliseconds.HOUR,
  async execute(bot, _payload, uptime) {
    const uptimeMessage =
      "El bot ha estado encendido desde:\n" +
      `-> <t:${Math.floor(uptime / 1000)}:R>\n` +
      `-> <t:${Math.floor(uptime / 1000)}:F>`;

    // log
    await sendMessage(bot, Options.CHANNEL_ID, uptimeMessage);
  },
};
