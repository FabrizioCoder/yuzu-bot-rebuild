import { CommandoCache, createTask } from "oasis/commando";
import { Milliseconds } from "oasis/collectors";
import { Configuration } from "utils";
import { ActivityTypes, editBotStatus } from "discordeno";

createTask({
  name: "presences",
  interval: Milliseconds.Minute * 6,
  execute(bot, _payload) {
    const gCount = bot.guilds.size;
    const uCount = bot.guilds.reduce((a, b) => a + b.memberCount, 0);

    const activities = [
      `${bot.gateway.shards.size} shards`,
      `${uCount.toLocaleString("de-CH")} users`,
      `${gCount.toLocaleString("de-CH")} servers`,
      `${CommandoCache.slashCommands.size} slash commands and ${CommandoCache.commands.size} commands`,
      `Bot using v${Configuration.version}`,
      "!help /help",
    ] as const;

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
});
