import { cache, createMonitor } from "oasis";

createMonitor({
  name: "messageMonitor",
  event: "messageCreate",
  isGuildOnly: true,
  ignoreBots: true,
  execute(_bot, message) {
    const collector = cache.collectors.messages.get(message.authorId);
    if (!collector || message.channelId !== collector.channelId) return;
    if (!collector.filter(message)) return;

    if (collector.amount === 1 || collector.amount === collector.messages.length + 1) {
      cache.collectors.messages.delete(message.authorId);
      return collector.resolve([...collector.messages, message]);
    }

    collector.messages.push(message);
  },
});
