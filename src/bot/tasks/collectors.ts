import { cache, createTask, Milliseconds } from "oasis";

createTask({
  name: "collectors",
  interval: Milliseconds.Minute,
  execute() {
    const now = Date.now();
    cache.collectors.buttons.forEach((collector, key) => {
      // This collector has not finished yet.
      if (collector.createdAt + Number(collector?.duration) > now) return;

      // Remove the collector
      cache.collectors.buttons.delete(key);

      // Reject the promise so code can continue in commands.
      return collector.reject("The button was not pressed in time.");
    });
  },
});
