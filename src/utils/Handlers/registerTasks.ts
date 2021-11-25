import type { Bot } from "../../deps.ts";
import type { Payload } from "../../types/task.ts";
import { cache } from "../mod.ts";

// inspired by Discordeno template
export const registerTasks = (
  bot: Bot,
  payload: Payload,
  ...args: number[]
): void =>
  cache.tasks.forEach((task) => {
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

export const clearTasks = (): void => {
  for (const timeout of cache.runningTasks.initialTimeouts) {
    clearTimeout(timeout);
  }

  for (const task of cache.runningTasks.intervals) {
    clearInterval(task);
  }

  cache.tasks.clear();
  cache.runningTasks.initialTimeouts.clear();
};
