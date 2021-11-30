import type { Event } from "../../types/event.ts";
import { cache, registerTasks } from "../../utils/mod.ts";

export default <Event<"ready">> {
  name: "ready",
  async execute(bot, payload) {
    const uptime = Date.now();

    registerTasks(bot, payload, uptime);

    // LOG
    console.group();
    console.log("Logged in", `${payload.user.username}`);
    console.log("Loaded ->", `${payload.guilds.length} guilds`);
    console.log("Loaded ->", `${cache.commands.size} regular commands`);
    console.log("Loaded ->", `${cache.slashCommands.size} slash commands`);
    console.log("Loaded ->", `${cache.events.size} events`);
    console.log("Loaded ->", `${cache.monitors.size} monitors`);
    console.log("Loaded ->", `${cache.tasks.size} tasks`);
    console.log("Session: %s", payload.sessionId);
    console.log("Shard: %s", payload.shardId);
    console.log("API version: %s", payload.v);
    console.groupEnd();
  },
};