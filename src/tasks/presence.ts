import type { Task } from "../types/task.ts";
import { cache, Milliseconds, VERSION } from "../utils/mod.ts";
import { ActivityTypes, editBotStatus } from "../../deps.ts";

export default <Task> {
  name: "presences",
  interval: Milliseconds.MINUTE * 10,
  execute(bot, _payload) {
    const gCount = bot.guilds.size;
    const uCount = bot.guilds
      .map((guild) => guild.memberCount)
      .reduce((a, b) => a + b, 0);

    // TODO: make this more readable
    const presences = [
      "🎶🎶🎶",
      "!help /help",
      `${bot.gateway.shards.size} shards`,
      `${uCount.toLocaleString("de-CH")} users`,
      `${gCount.toLocaleString("de-CH")} servers`,
      `${cache.slashCommands.size} slash commands and ${cache.commands.size} commands`,
      `Bot using v${VERSION}`,
    ];

    editBotStatus(bot, {
      status: "online",
      activities: [{
        createdAt: Date.now(),
        name: presences[Math.floor(Math.random() * presences.length - 1) + 1],
        type: ActivityTypes.Listening,
      }],
    });
  },
};
