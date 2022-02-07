import { createMonitor } from "oasis/commando";
import { messages } from "oasis/collectors";

createMonitor({
  name: "messageMonitor",
  event: "messageCreate",
  isGuildOnly: true,
  ignoreBots: true,
  execute(_bot, message) {
    const collector = messages.get(message.authorId);
    if (!collector || message.channelId !== collector.channelId) return;
    if (!collector.filter(message)) return;

    if (collector.amount === 1 || collector.amount === collector.messages.length + 1) {
      messages.delete(message.authorId);
      return collector.resolve([...collector.messages, message]);
    }

    collector.messages.push(message);
  },
});
