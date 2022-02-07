import { createTask } from "oasis/commando";
import { Milliseconds } from "oasis/collectors";
import { Configuration } from "utils";
import { sendMessage } from "discordeno";
import { error } from "logger";

createTask({
  name: "uptime",
  interval: Milliseconds.Hour * 12,
  async execute(bot, _payload, uptime) {
    const uptimeMessage =
      "El bot ha estado encendido desde:\n" +
      `-> <t:${Math.floor(uptime / 1000)}:R>\n` +
      `-> <t:${Math.floor(uptime / 1000)}:F>`;

    // log
    await sendMessage(bot, Configuration.logs.channelId, {
      content: uptimeMessage,
    }).catch(error);
  },
});
