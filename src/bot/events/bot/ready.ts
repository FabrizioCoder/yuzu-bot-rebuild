import type { Event } from "../../types/event.ts";
import type { BotWithCache } from "cache_plugin";
import type { Payload } from "../../types/task.ts";
import { cache, logger, LogLevels } from "../../../utils/mod.ts";

export default <Event<"ready">> {
  name: "ready",
  execute(bot, payload) {
    const uptime = Date.now();
    registerTasks(bot as BotWithCache, payload, uptime);
    // LOG
    logger.info(`Loaded -> ${payload.guilds.length} guilds`);
    logger.info(`Loaded -> ${cache.commands.size} regular commands`);
    logger.info(`Loaded -> ${cache.slashCommands.size} slash commands`);
    logger.info(`Loaded -> ${cache.events.size} events`);
    logger.info(`Loaded -> ${cache.monitors.size} monitors`);
    logger.info(`Loaded -> ${cache.tasks.size} tasks`);
    logger.info(`Shard: ${payload.shardId + 1} of ${bot.botGatewayData?.shards} shards`);
    logger.info(`API version: ${payload.v}`);
    logger.info(`Running OS: ${Deno.build.env} ${Deno.build.os} ${Deno.build.arch}`);
    logger.info(`Logged in ${payload.user.username} ${payload.applicationId}`);
    logger.info(...Object.entries(Deno.version));
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
        } catch (err) {
          if (err instanceof Error) logger.error(err.message);
        }
        cache.runningTasks.initialTimeouts.add(
          setInterval(async () => {
            logger.log(LogLevels.Debug, `Started Task ${task.name}`);
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
