import type { Event } from "../../types/event.ts";
import type { BotWithCache } from "../../../deps.ts";
import type { Payload } from "../../types/task.ts";
import { cache } from "../../utils/mod.ts";

export default <Event<"ready">> {
  name: "ready",
  execute(bot, payload) {
    const uptime = Date.now();

    registerTasks(bot as BotWithCache, payload, uptime);

    // LOG
    console.group();
    console.log("Logged in", `${payload.user.username} ${payload.applicationId}`);
    console.log("Loaded ->", `${payload.guilds.length} guilds`);
    console.log("Loaded ->", `${cache.commands.size} regular commands`);
    console.log("Loaded ->", `${cache.slashCommands.size} slash commands`);
    console.log("Loaded ->", `${cache.events.size} events`);
    console.log("Loaded ->", `${cache.monitors.size} monitors`);
    console.log("Loaded ->", `${cache.tasks.size} tasks`);
    console.log("Shard: %s of %d shards", payload.shardId + 1, bot.botGatewayData?.shards);
    console.log("API version: %s", payload.v);
    console.log("Deno: %s, V8: %s, TS: %s", ...Object.values(Deno.version));
    console.log("Running OS: %s %s %s", Deno.build.env, Deno.build.os, Deno.build.arch);
    console.groupEnd();
  },
};

// inspired by Discordeno template
function registerTasks(bot: BotWithCache, payload: Payload, ...args: number[]) {
  return cache.tasks.forEach((task) => {
    cache.runningTasks.initialTimeouts.add(
      setTimeout(async () => {
        console.log("Started Task %s", task.name);
        try {
          await task.execute(bot, payload, ...args);
        } catch (err) {
          if (err instanceof Error) console.error(err.message);
        }
        cache.runningTasks.initialTimeouts.add(
          setInterval(async () => {
            console.log("Started Task %s", task.name);
            try {
              await task.execute(bot, payload, ...args);
            } catch (err) {
              if (err instanceof Error) console.error(err.message);
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
