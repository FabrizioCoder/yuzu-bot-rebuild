import type { Task } from "../types/task.ts";
import { Milliseconds, Options } from "../utils/mod.ts";
import { sendMessage } from "../../deps.ts";

export default <Task> {
  name: "uptime",
  interval: Milliseconds.HOUR,
  async execute(bot, _payload, uptime) {
    // time
    const weeks = ((Date.now() - uptime) / Milliseconds.WEEK).toFixed();
    const hours = ((Date.now() - uptime) / Milliseconds.HOUR).toFixed();
    const days = ((Date.now() - uptime) / Milliseconds.DAY).toFixed();
    const minutes = ((Date.now() - uptime) / Milliseconds.MINUTE).toFixed();

    const uptimeMessage =
      `El bot ha estado encendido ${weeks} semanas ${days} días ${hours} horas ${minutes} minutos`;

    const channelId = Options.CHANNEL_ID;

    // log
    await sendMessage(
      bot,
      channelId,
      uptimeMessage,
    );
  },
};
