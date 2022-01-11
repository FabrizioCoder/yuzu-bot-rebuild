import type { Embed } from "discordeno";
import type { BotWithCache } from "cache_plugin";
import { createEvent } from "oasis";
import { cache, DiscordColors } from "utils";
import { avatarURL, editMessage, sendMessage, getMessage, getUser } from "discordeno";
import { getCollection, getStarboard } from "../../../database/controllers/starboard_controller.ts";
import { db } from "../../../database/db.ts";

createEvent({
  name: "reactionAdd",
  async execute(bot, { channelId, guildId, messageId }) {
    if (!db || !guildId) return;

    const starboard = await getStarboard(getCollection(db), guildId);

    if (!starboard) return;

    // use this rather than the cache!
    const message = (bot as BotWithCache).messages.get(messageId) ?? (await getMessage(bot, channelId, messageId));
    const user = (bot as BotWithCache).users.get(message.authorId) ?? (await getUser(bot, message.authorId));

    // get the reaction
    const reaction = message.reactions?.find(
      (r) => r.emoji.id?.toString() === starboard.emojiId || r.emoji.name === starboard.emojiId || r.emoji.name === "⭐"
    );

    // if the emoji didn't reach enough reactions just ignore
    if (starboard.count > (reaction?.count ?? 0)) {
      return;
    }

    // if the emojis aren't equal
    // convert to bigint first then compare
    try {
      const emojisAreEqual =
        starboard.emojiId === reaction?.emoji.name || BigInt(starboard.emojiId) === reaction?.emoji.id;

      if (!emojisAreEqual) return;
    } catch {
      return;
    }

    const embed: Embed = {
      // usually the starboard color
      color: DiscordColors.Yellow,
      author: {
        name: `${user.username}#${user.discriminator}`,
        iconUrl: avatarURL(bot, user.id, user.discriminator, { avatar: user.avatar, size: 512 }),
      },
      thumbnail: {
        url: avatarURL(bot, user.id, user.discriminator, { avatar: user.avatar, size: 512 }),
      },
      fields: [
        {
          name: "Total:",
          value: reaction?.count.toString() ?? "Sin resultados",
        },
        {
          name: "Emoji:",
          value: reaction.emoji.id
            ? `<${reaction.emoji.animated ? "a" : ""}:${reaction.emoji.name}:${reaction.emoji.id}>`
            : reaction.emoji.name!,
        }, // NOTE: emoji.name and emoji.id can't be undefined at the same time
        {
          name: "Info:",
          value:
            `<t:${Math.floor(message.timestamp / 1000)}:R>\n` +
            `[Jump to!](https://discord.com/channels/${guildId}/${channelId}/${messageId})\n`,
        },
      ],
      footer: {
        text:
          `${message.isBot ? "Sended by a bot" : "Sended by a user"} ⭐ ` +
          `${message.attachments.length ?? message.embeds.filter((e) => e.image).length} attachments`,
      },
      description: message.content,
    };

    // add an image!
    if (message.attachments.length > 0) {
      embed.image = { url: message.attachments[0].url };
    } else if (message.embeds[0]?.image?.url) {
      embed.image = { url: message.embeds[0].image.url };
    }

    // if we already sended a message, edit the message with the new count!
    if (cache.alreadySendedInStarboard.has(messageId)) {
      const response = cache.alreadySendedInStarboard.get(messageId);

      if (response) {
        await editMessage(bot, response.channelId, response.id, { embeds: [embed] }).catch(() => {});
      }

      return;
    }

    // otherwise send a new message
    sendMessage(bot, BigInt(starboard.channelId), { embeds: [embed] })
      .then((msg) => cache.alreadySendedInStarboard.set(messageId, msg))
      .catch(() => cache.alreadySendedInStarboard.delete(messageId));
  },
});
