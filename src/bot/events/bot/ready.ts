import type { Event } from "../../types/event.ts";
import type { Payload } from "../../types/task.ts";
import type { BotWithCache } from "cache_plugin";
import { cache, Configuration, logger, LogLevels } from "utils";
import { cyan } from "fmt/colors";

export default <Event<"ready">> {
  name: "ready",
  execute(bot, payload) {
    const uptime = Date.now();
    registerTasks(bot as BotWithCache, payload, uptime);
    // LOG
    logger.info(`Loaded -> ${cyan(payload.guilds.length.toString())} guilds`);
    logger.info(`Loaded -> ${cyan(cache.commands.size.toString())} regular commands`);
    logger.info(`Loaded -> ${cyan(cache.slashCommands.size.toString())} slash commands`);
    logger.info(`Loaded -> ${cyan(cache.events.size.toString())} events`);
    logger.info(`Loaded -> ${cyan(cache.monitors.size.toString())} monitors`);
    logger.info(`Loaded -> ${cyan(cache.tasks.size.toString())} tasks`);
    logger.info(`Shard: ${payload.shardId + 1} of ${bot.botGatewayData?.shards} shards`);
    logger.info(`API version: ${cyan(payload.v.toString())}`);
    logger.info(`Running OS: ${Deno.build.env} ${Deno.build.os} ${Deno.build.arch}`);
    logger.info(`Logged in ${payload.user.username} ${payload.applicationId}`);
    logger.info(`Bot version: ${cyan(Configuration.VERSION)}`);
    logger.info(`Discordeno version: ${cyan(bot.constants.DISCORDENO_VERSION)}`);
    logger.info(...Object.entries(Deno.version).map((a, b) => `${a}: ${b}`));
  },
};

// inspired by Discordeno template
function registerTasks(bot: BotWithCache, payload: Payload, ...args: number[]) {
  return cache.tasks.forEach((task) => {
    cache.runningTasks.initialTimeouts.add(
      setTimeout(async () => {
        logger.log(LogLevels.Debug, `Started Task ${task.name}`);
        try {
          await task.execute(bot, payload, ...args);
        } catch (err: unknown) {
          if (err instanceof Error) logger.error(err.message);
        }
        cache.runningTasks.initialTimeouts.add(
          setInterval(async () => {
            logger.log(LogLevels.Debug, `Started Task ${task.name}`);
            try {
              await task.execute(bot, payload, ...args);
            } catch (err: unknown) {
              if (err instanceof Error) logger.error(err.message);
            }
          }, task.interval)
        );
      }, task.interval - (Date.now() % task.interval))
    );
  });
}

function clearTasks() {
  for (const timeout of cache.runningTasks.initialTimeouts) {
    clearTimeout(timeout);
  }

  for (const task of cache.runningTasks.intervals) {
    clearInterval(task);
  }

  cache.tasks.clear();
  cache.runningTasks.initialTimeouts.clear();
}
