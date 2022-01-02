import type { Task } from "../types/task.ts";
import { cache, Milliseconds, Configuration } from "utils";
import { ActivityTypes, editBotStatus } from "discordeno";

export default <Task> {
  name: "presences",
  interval: Milliseconds.Minute * 6,
  execute(bot, _payload) {
    const gCount = bot.guilds.size;
    const uCount = bot.guilds.reduce((a, b) => a + b.memberCount, 0);

    const activities = [
      `${bot.gateway.shards.size} shards`,
      `${uCount.toLocaleString("de-CH")} users`,
      `${gCount.toLocaleString("de-CH")} servers`,
      `${cache.slashCommands.size} slash commands and ${cache.commands.size} commands`,
      `Bot using v${Configuration.VERSION}`,
      "!help /help",
    ];

    editBotStatus(bot, {
      status: "online",
      activities: [
        {
          createdAt: Date.now(),
          name: activities[Math.floor(Math.random() * activities.length)],
          type: ActivityTypes.Listening,
        },
      ],
    });
  },
};
