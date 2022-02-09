import { CommandoCache, createTask } from "oasis/commando";
import { Milliseconds } from "oasis/collectors";
import { Configuration } from "utils";
import { ActivityTypes, editBotStatus } from "discordeno";

createTask({
  name: "presences",
  interval: Milliseconds.Minute * 6,
  execute(bot, _payload) {
    const gCount = bot.guilds.size;
    const mCount = bot.guilds.reduce((a, b) => a + (b.memberCount || b.approximateMemberCount || 0), 0);

    const activities = [
      `${bot.gateway.shards.size} shards`,
      `${mCount.toLocaleString("de-CH")} users`,
      `${gCount.toLocaleString("de-CH")} servers`,
      `${CommandoCache.slashCommands.size} slash commands and ${CommandoCache.commands.size} commands`,
      `Bot using v${Configuration.version}`,
      "!help /help",
    ];

    editBotStatus(bot, {
      status: "online",
      activities: [
        {
          createdAt: Date.now() / 1000,
          name: activities[Math.floor(Math.random() * activities.length)],
          type: ActivityTypes.Listening,
        },
      ],
    });
  },
});
