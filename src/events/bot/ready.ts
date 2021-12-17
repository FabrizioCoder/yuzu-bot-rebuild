import type { Event } from "../../types/event.ts";
import type { BotWithCache } from "../../../deps.ts";
import type { Payload } from "../../types/task.ts";
import { cache } from "../../utils/mod.ts";

export default <Event<"ready">> {
  name: "ready",
  execute(bot, payload) {
    const uptime = Date.now();

    registerTasks(bot as BotWithCache, payload, uptime);

    const { log: printLog, group, groupEnd } = console;

    // LOG
    group();
    printLog("Logged in", `${payload.user.username} ${payload.applicationId}`);
    printLog("Loaded ->", `${payload.guilds.length} guilds`);
    printLog("Loaded ->", `${cache.commands.size} regular commands`);
    printLog("Loaded ->", `${cache.slashCommands.size} slash commands`);
    printLog("Loaded ->", `${cache.events.size} events`);
    printLog("Loaded ->", `${cache.monitors.size} monitors`);
    printLog("Loaded ->", `${cache.tasks.size} tasks`);
    printLog("Shard: %s of %d shards", payload.shardId + 1, bot.botGatewayData?.shards);
    printLog("API version: %s", payload.v);
    printLog("Deno: %s, V8: %s, TS: %s", ...Object.values(Deno.version));
    printLog("Running OS: %s %s %s", Deno.build.env, Deno.build.os, Deno.build.arch);
    groupEnd();
  },
};

// inspired by Discordeno template
function registerTasks(
  bot: BotWithCache,
  payload: Payload,
  ...args: number[]
): void {
  return cache.tasks.forEach((task) => {
    cache.runningTasks.initialTimeouts.add(
      setTimeout(async () => {
        console.log("Started Task %s", task.name);
        try {
          await task.execute(bot, payload, ...args);
        } catch (err: unknown) {
          if (err instanceof Error) console.error(err.message);
        }
        cache.runningTasks.initialTimeouts.add(
          setInterval(async () => {
            console.log("Started Task %s", task.name);
            try {
              await task.execute(bot, payload, ...args);
            } catch (err: unknown) {
              if (err instanceof Error) console.error(err.message);
            }
          }, task.interval),
        );
      }, task.interval - Date.now() % task.interval),
    );
  });
}

function clearTasks(): void {
  for (const timeout of cache.runningTasks.initialTimeouts) {
    clearTimeout(timeout);
  }

  for (const task of cache.runningTasks.intervals) {
    clearInterval(task);
  }

  cache.tasks.clear();
  cache.runningTasks.initialTimeouts.clear();
}
