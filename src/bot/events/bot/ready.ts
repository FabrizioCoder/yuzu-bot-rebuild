import type { BotWithCache } from "cache_plugin";
import type { ReadyPayload } from "oasis";
import { cache, createEvent } from "oasis";
import { Configuration, logger } from "utils";
import { cyan } from "fmt/colors";

createEvent({
  name: "ready",
  execute(bot, payload) {
    const uptime = Date.now();
    registerTasks(bot as BotWithCache, payload, uptime);
    // LOG
    const log = logger.create({ name: "Gateaway" });

    log.info(`Loaded -> ${cyan(payload.guilds.length.toString())} guilds`);
    log.info(`Loaded -> ${cyan(cache.commands.size.toString())} regular commands`);
    log.info(`Loaded -> ${cyan(cache.slashCommands.size.toString())} slash commands`);
    log.info(`Loaded -> ${cyan(cache.events.size.toString())} events`);
    log.info(`Loaded -> ${cyan(cache.monitors.size.toString())} monitors`);
    log.info(`Loaded -> ${cyan(cache.tasks.size.toString())} tasks`);
    log.info(`Shard: ${payload.shardId + 1} of ${bot.botGatewayData?.shards} shards`);
    log.info(`API version: ${cyan(payload.v.toString())}`);
    log.info(`Running OS: ${Deno.build.env} ${Deno.build.os} ${Deno.build.arch}`);
    log.info(`Logged in ${payload.user.username} ${payload.applicationId}`);
    log.info(`Bot version: ${cyan(Configuration.VERSION)}`);
    log.info(`Discordeno version: ${cyan(bot.constants.DISCORDENO_VERSION)}`);
    log.info(...Object.entries(Deno.version).map(([a, b]) => `${a}: ${cyan(b)}`));
  },
});

// inspired by Discordeno template
function registerTasks(bot: BotWithCache, payload: ReadyPayload, ...args: number[]) {
  return cache.tasks.forEach((task) => {
    cache.runningTasks.initialTimeouts.add(
      setTimeout(async () => {
        logger.info(`Started Task ${task.name}`);
        try {
          await task.execute(bot, payload, ...args);
        } catch (err) {
          if (err instanceof Error) logger.error(err.message);
        }
        cache.runningTasks.initialTimeouts.add(
          setInterval(async () => {
            logger.info(`Started Task ${task.name}`);
            try {
              await task.execute(bot, payload, ...args);
            } catch (err) {
              if (err instanceof Error) logger.error(err.message);
            }
          }, task.interval)
        );
      }, task.interval - (Date.now() % task.interval))
    );
  });
}

// TODO: use this function to clear tasks
function _() {
  cache.runningTasks.initialTimeouts.forEach(clearTimeout);
  cache.runningTasks.intervals.forEach(clearInterval);
  cache.tasks.clear();
  cache.runningTasks.initialTimeouts.clear();
}
