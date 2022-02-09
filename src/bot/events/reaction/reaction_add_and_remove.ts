import type { EventHandlers } from "discordeno";
import type { BotWithCache } from "cache_plugin";
import { createEvent } from "oasis/commando";
import { MessageEmbed } from "oasis/builders";
import { cache, DiscordColors } from "utils";
import { addReaction, avatarURL, deleteMessage, editMessage, getMessage, getUser, sendMessage } from "discordeno";
import { getCollection, getStarboard } from "database/controllers/starboard_controller.ts";
import { db } from "database/db";

type Execute = EventHandlers["reactionAdd"] & EventHandlers["reactionRemove"];
const execute: Execute = async function (bot, { channelId, guildId, messageId }) {
  if (!db || !guildId) return;

  const starboard = await getStarboard(getCollection(db), guildId);

  if (!starboard) return;

  // use this rather than the cache!
  const message = (bot as BotWithCache).messages.get(messageId) ?? (await getMessage(bot, channelId, messageId));
  const user = (bot as BotWithCache).users.get(message.authorId) ?? (await getUser(bot, message.authorId));

  // get the reaction
  const reaction = message.reactions?.find((r) => r.emoji.name === starboard.emojiName);

  // delete the message if it reaches 0 reactions and theres a message already
  if ((!reaction || reaction.count < 1) && cache.alreadySendedInStarboard.has(messageId)) {
    const response = cache.alreadySendedInStarboard.get(messageId);

    if (response) {
      await deleteMessage(bot, response.channelId, response.id);
      cache.alreadySendedInStarboard.delete(messageId);
      return;
    }
  }

  // if the emoji didn't reach enough reactions just ignore
  if (starboard.count > (reaction?.count ?? 0)) {
    return;
  }

  // if the emojis aren't equal
  const areEqual = starboard.emojiName === reaction?.emoji.name;

  if (!areEqual) {
    return;
  }

  // if the channel is the starboard channel
  if (starboard.channelId.toBigInt() === channelId) {
    return;
  }

  const avatar = avatarURL(bot, user.id, user.discriminator, {
    avatar: user.avatar,
    size: 512,
  });

  const embed = new MessageEmbed()
    .color(DiscordColors.Yellow)
    .author(`${user.username}#${user.discriminator}`, avatar)
    .thumbnail(avatar)
    .field("Total", reaction?.count.toString() ?? "Sin resultados")
    .field(
      "Emoji",
      reaction?.emoji.id
        ? `<${reaction?.emoji.animated ? "a" : ""}:${reaction?.emoji.name}:${reaction?.emoji.id}>`
        : `${reaction?.emoji.name}` // NOTE: emoji.name and emoji.id can't be undefined at the same time
    )
    .field(
      "Info",
      `<t:${Math.floor(message.timestamp / 1000)}:R>\n` +
        `\n[Jump to!](https://discord.com/channels/${guildId}/${channelId}/${messageId})\n`
    )
    .footer(
      `${message.isBot ? "Sended by a bot" : "Sended by a user"} ⭐ ` +
        `${message.attachments.length || message.embeds.filter((e) => e.image).length} attachments`
    )
    .description(message.content);

  // add an image!
  if (message.attachments.length > 0) embed.image(message.attachments[0].url);
  if (message.embeds[0]?.image?.url) embed.image(message.embeds[0].image.url);

  // if we already sended a message, edit the message with the new count!
  if (cache.alreadySendedInStarboard.has(messageId)) {
    const response = cache.alreadySendedInStarboard.get(messageId);

    if (response) {
      await editMessage(bot, response.channelId, response.id, {
        embeds: [embed.embed],
      }).catch(() => {});
    }

    return;
  }

  // otherwise send a new message
  sendMessage(bot, starboard.channelId.toBigInt(), { embeds: [embed.embed] })
    .then((msg) => {
      cache.alreadySendedInStarboard.set(messageId, msg);
      return msg;
    })
    .then((msg) => {
      if (reaction?.emoji.id && reaction.emoji.name) {
        return addReaction(bot, msg.channelId, msg.id, `${reaction.emoji.name}:${reaction.emoji.id}`);
      }
      if (!reaction?.emoji.id && reaction?.emoji.name) {
        return addReaction(bot, msg.channelId, msg.id, reaction.emoji.name);
      }
    })
    .catch(() => {});
};

createEvent({
  name: "reactionAdd",
  execute,
});

createEvent({
  name: "reactionRemove",
  execute,
});
