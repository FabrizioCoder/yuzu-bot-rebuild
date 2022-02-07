import type { BotWithCache } from "cache_plugin";
import type { ReadyPayload } from "oasis/commando";
import { CommandoCache, createEvent } from "oasis/commando";
import { Configuration } from "utils";
import { cyan } from "fmt/colors";
import * as log from "logger";

createEvent({
  name: "ready",
  execute(bot, payload) {
    const uptime = Date.now();
    registerTasks(bot as BotWithCache, payload, uptime);

    // LOG
    log.info("Loaded -> {} guilds", cyan(payload.guilds.length.toString()));
    log.info("Loaded -> {} regular commands", cyan(CommandoCache.commands.size.toString()));
    log.info("Loaded -> {} slash commands", cyan(CommandoCache.slashCommands.size.toString()));
    log.info("Loaded -> {} events", cyan(CommandoCache.events.size.toString()));
    log.info("Loaded -> {} monitors", cyan(CommandoCache.monitors.size.toString()));
    log.info("Loaded -> {} tasks", cyan(CommandoCache.tasks.size.toString()));
    log.info(`Shard: {} of {} shards`, payload.shardId + 1, bot.botGatewayData?.shards ?? 1);
    log.info(`API version: {}`, cyan(payload.v.toString()));
    log.info("Running OS: {}", cyan(`${Deno.build.env} ${Deno.build.os} ${Deno.build.arch}`));
    log.info(`Logged in {} as {}`, payload.user.username, payload.applicationId);
    log.info(`Bot version: {}`, cyan(Configuration.version));
    log.info("Discordeno version: {}", cyan(bot.constants.DISCORDENO_VERSION));
    log.info("", ...Object.entries(Deno.version).map(([a, b]) => `${a}: ${cyan(b)}`));
  },
});

// inspired by Discordeno template
function registerTasks(bot: BotWithCache, payload: ReadyPayload, ...args: number[]) {
  return CommandoCache.tasks.forEach((task) => {
    CommandoCache.runningTasks.initialTimeouts.add(
      setTimeout(async () => {
        log.info(`Started Task ${task.name}`);
        try {
          await task.execute(bot, payload, ...args);
        } catch (err) {
          if (err instanceof Error) log.error(err.message);
        }
        CommandoCache.runningTasks.initialTimeouts.add(
          setInterval(async () => {
            log.info(`Started Task ${task.name}`);
            try {
              await task.execute(bot, payload, ...args);
            } catch (err) {
              if (err instanceof Error) log.error(err.message);
            }
          }, task.interval)
        );
      }, task.interval - (Date.now() % task.interval))
    );
  });
}

// TODO: use this function to clear tasks
function _clearTasks() {
  CommandoCache.runningTasks.initialTimeouts.forEach(clearTimeout);
  CommandoCache.runningTasks.intervals.forEach(clearInterval);
  CommandoCache.tasks.clear();
  CommandoCache.runningTasks.initialTimeouts.clear();
}
