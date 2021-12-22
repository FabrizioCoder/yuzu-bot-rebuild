import type { Event } from "../../types/event.ts";
import type { Embed, BotWithCache } from "../../../deps.ts";
import { cache, DiscordColors } from "../../utils/mod.ts";
import { avatarURL, editMessage, sendMessage, getMessage, getUser } from "../../../deps.ts";
import { getCollection, getStarboard } from "../../database/controllers/starboard_controller.ts";
import { db } from "../../database/db.ts";

export default <Event<"reactionAdd">>{
  name: "reactionAdd",
  async execute(bot: BotWithCache, { channelId, guildId, messageId, emoji }) {
    if (!db || !guildId) return;

    const starboard = await getStarboard(getCollection(db), guildId);

    if (!starboard) return;

    // use this rather than the cache!
    const message = await getMessage(bot, channelId, messageId);
    const user = bot.users.get(message.authorId) ?? await getUser(bot, message.authorId);

    // debug for now
    const reaction = message.reactions?.find(
      (r) => (r.emoji.id === BigInt(starboard.emojiId)) || (r.emoji.name === "⭐")
    );

    // if the emoji didn't reach enough reactions just ignore
    if (reaction && starboard.count > reaction.count) return;

    const embed: Embed = {
      color: DiscordColors.Yellow,
      author: {
        name: `${user.username}#${user.discriminator}`,
        iconUrl: avatarURL(bot, user.id, user.discriminator, {
          avatar: user.avatar,
          size: 512,
        }),
      },
      fields: [
        {
          name: "Total:",
          value: Number.prototype.toString.call(message.reactions?.length ?? 0),
        },
        {
          name: "Emoji:",
          value: `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`,
        },
      ],
      description:
        `<t:${Math.floor(message.timestamp / 1000)}:R>\n` +
        `[Jump to!](https://discord.com/channels/${guildId}/${channelId}/${messageId})\n` +
        `${message.content}\n`
    };

    // if we already sended a message, edit the message with the new count!
    if (cache.alreadySendedInStarboard.has(messageId)) {
      const response = cache.alreadySendedInStarboard.get(messageId);

      if (response) {
        await editMessage(bot, response.channelId, response.id, { embeds: [embed] })
          .catch(() => {});
      }

      return;
    }

    // otherwise send a new message
    sendMessage(bot, BigInt(starboard.channelId), { embeds: [embed] })
      .then((msg) => cache.alreadySendedInStarboard.set(messageId, msg))
      .catch(console.error);
  },
};
