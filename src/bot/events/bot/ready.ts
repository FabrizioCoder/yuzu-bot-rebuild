import type { BotWithCache } from "cache_plugin";
import type { ReadyPayload } from "oasis";
import { cache, createEvent } from "oasis";
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
    log.info("Loaded -> {} regular commands", cyan(cache.commands.size.toString()));
    log.info("Loaded -> {} slash commands", cyan(cache.slashCommands.size.toString()));
    log.info("Loaded -> {} events", cyan(cache.events.size.toString()));
    log.info("Loaded -> {} monitors", cyan(cache.monitors.size.toString()));
    log.info("Loaded -> {} tasks", cyan(cache.tasks.size.toString()));
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
  return cache.tasks.forEach((task) => {
    cache.runningTasks.initialTimeouts.add(
      setTimeout(async () => {
        log.info(`Started Task ${task.name}`);
        try {
          await task.execute(bot, payload, ...args);
        } catch (err) {
          if (err instanceof Error) log.error(err.message);
        }
        cache.runningTasks.initialTimeouts.add(
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
  cache.runningTasks.initialTimeouts.forEach(clearTimeout);
  cache.runningTasks.intervals.forEach(clearInterval);
  cache.tasks.clear();
  cache.runningTasks.initialTimeouts.clear();
}
