import { createTask } from "oasis/commando";
import { buttons, Milliseconds } from "oasis/collectors";

createTask({
  name: "collectors",
  interval: Milliseconds.Minute,
  execute() {
    const now = Date.now();
    buttons.forEach((collector, key) => {
      // This collector has not finished yet.
      if (collector.createdAt + Number(collector?.duration) > now) return;

      // Remove the collector
      buttons.delete(key);

      // Reject the promise so code can continue in commands.
      return collector.reject("The button was not pressed in time.");
    });
  },
});
