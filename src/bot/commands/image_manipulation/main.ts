import { createMessageCommand, MessageEmbed } from "oasis";
import { cache, Category, DiscordColors } from "utils";
import { avatarURL, getUser, sendMessage } from "discordeno";
import { Image } from "imagescript";

enum Overlay {
  Lgbt = "https://media.discordapp.net/attachments/895959965469134858/932053795184197652/lgbt-flag-2.png?width=676&height=427",
  Trans = "https://media.discordapp.net/attachments/895959965469134858/932064828246335518/m0ab83l4m94y.png?width=853&height=427",
  Ussr = "https://media.discordapp.net/attachments/895959965469134858/932062453943132232/New_USSR.png?width=641&height=427",
  Israel = "https://media.discordapp.net/attachments/895959965469134858/932060629248929852/israel-flag.png?width=712&height=427",
}

function decodeFromUrl(url: string, fn: (i: Image) => Promise<Uint8Array>) {
  return fetch(url)
    .then((a) => a.arrayBuffer())
    .then(Image.decode)
    .then(fn);
}

createMessageCommand({
  names: ["israel"],
  meta: {
    descr: "Overlay an Israel flag",
    usage: "israel [last attachment on the channel]",
  },
  category: Category.Image,
  async execute({ bot, message }) {
    const attachmentUrl = cache.lastAttachments.get(message.channelId)?.[0];

    const overlay = await fetch(Overlay.Israel)
      .then((i) => i.arrayBuffer())
      .then(Image.decode);

    let user: Awaited<ReturnType<typeof getUser>> | undefined;

    if (message.mentionedUserIds.length > 0) {
      user = bot.users.get(message.mentionedUserIds[0]) ?? (await getUser(bot, message.mentionedUserIds[0]));
    }

    if (!user && !attachmentUrl) {
      return "Image not found in channel! try to mention a user";
    }

    const attachmentOrAvatar = user
      ? avatarURL(bot, user.id, user.discriminator, { avatar: user.avatar, size: 512 })
      : attachmentUrl!;

    const compressed = await decodeFromUrl(attachmentOrAvatar, (i) => {
      i.composite(overlay.opacity(0.5).cover(i.width, i.height));
      return i.encode();
    });

    await sendMessage(bot, message.channelId, {
      file: [{ blob: new Blob([compressed]), name: "img.png" }],
      content: `<@${message.authorId}>`,
    });
  },
});

createMessageCommand({
  names: ["trans"],
  meta: {
    descr: "Overlay a transexual flag",
    usage: "Trans [last attachment on the channel]",
  },
  category: Category.Image,
  async execute({ bot, message }) {
    const attachmentUrl = cache.lastAttachments.get(message.channelId)?.[0];

    const overlay = await fetch(Overlay.Trans)
      .then((i) => i.arrayBuffer())
      .then(Image.decode);

    let user: Awaited<ReturnType<typeof getUser>> | undefined;

    if (message.mentionedUserIds.length > 0) {
      user = bot.users.get(message.mentionedUserIds[0]) ?? (await getUser(bot, message.mentionedUserIds[0]));
    }

    if (!user && !attachmentUrl) {
      return "Image not found in channel! try to mention a user";
    }

    const attachmentOrAvatar = user
      ? avatarURL(bot, user.id, user.discriminator, { avatar: user.avatar, size: 512 })
      : attachmentUrl!;

    const compressed = await decodeFromUrl(attachmentOrAvatar, (i) => {
      i.composite(overlay.opacity(0.5).cover(i.width, i.height));
      return i.encode();
    });

    await sendMessage(bot, message.channelId, {
      file: [{ blob: new Blob([compressed]), name: "img.png" }],
      content: `<@${message.authorId}>`,
    });
  },
});

createMessageCommand({
  names: ["ussr", "urss" /* spanish translation btw */],
  meta: {
    descr: "Overlay an Ussr flag",
    usage: "ussr [last attachment on the channel]",
  },
  category: Category.Image,
  async execute({ bot, message }) {
    const attachmentUrl = cache.lastAttachments.get(message.channelId)?.[0];

    const overlay = await fetch(Overlay.Ussr)
      .then((i) => i.arrayBuffer())
      .then(Image.decode);

    let user: Awaited<ReturnType<typeof getUser>> | undefined;

    if (message.mentionedUserIds.length > 0) {
      user = bot.users.get(message.mentionedUserIds[0]) ?? (await getUser(bot, message.mentionedUserIds[0]));
    }

    if (!user && !attachmentUrl) {
      return "Image not found in channel! try to mention a user";
    }

    const attachmentOrAvatar = user
      ? avatarURL(bot, user.id, user.discriminator, { avatar: user.avatar, size: 512 })
      : attachmentUrl!;

    const compressed = await decodeFromUrl(attachmentOrAvatar, (i) => {
      i.composite(overlay.opacity(0.5).cover(i.width, i.height));
      return i.encode();
    });

    await sendMessage(bot, message.channelId, {
      file: [{ blob: new Blob([compressed]), name: "img.png" }],
      content: `<@${message.authorId}>`,
    });
  },
});

createMessageCommand({
  names: ["lgbt", "gay"],
  meta: {
    descr: "Overlay an lgbt flag",
    usage: "lgbt [last attachment on the channel]",
  },
  category: Category.Image,
  async execute({ bot, message }) {
    const attachmentUrl = cache.lastAttachments.get(message.channelId)?.[0];

    const overlay = await fetch(Overlay.Lgbt)
      .then((i) => i.arrayBuffer())
      .then(Image.decode);

    let user: Awaited<ReturnType<typeof getUser>> | undefined;

    if (message.mentionedUserIds.length > 0) {
      user = bot.users.get(message.mentionedUserIds[0]) ?? (await getUser(bot, message.mentionedUserIds[0]));
    }

    if (!user && !attachmentUrl) {
      return "Image not found in channel! try to mention a user";
    }

    const attachmentOrAvatar = user
      ? avatarURL(bot, user.id, user.discriminator, { avatar: user.avatar, size: 512 })
      : attachmentUrl!;

    const compressed = await decodeFromUrl(attachmentOrAvatar, (i) => {
      i.composite(overlay.opacity(0.5).cover(i.width, i.height));
      return i.encode();
    });

    await sendMessage(bot, message.channelId, {
      file: [{ blob: new Blob([compressed]), name: "img.png" }],
      content: `<@${message.authorId}>`,
    });
  },
});

createMessageCommand({
  names: ["rotate"],
  category: Category.Image,
  meta: {
    descr: "Rotates 90 degrees",
    usage: "rotate [last attachment on the channel]",
  },
  async execute({ bot, message }) {
    const attachmentUrl = cache.lastAttachments.get(message.channelId)?.[0];

    if (!attachmentUrl) return "Image not found in channel!";

    const compressed = await decodeFromUrl(attachmentUrl, (i) => {
      i.rotate(90);
      return i.encode();
    });

    await sendMessage(bot, message.channelId, {
      file: [{ blob: new Blob([compressed]), name: "img.png" }],
      content: `<@${message.authorId}>`,
    });
  },
});

createMessageCommand({
  names: ["blur", "blurify"],
  category: Category.Image,
  meta: {
    descr: "Blurs an image",
    usage: "blur [last attachment on the channel]",
  },
  async execute({ bot, message }) {
    const attachmentUrl = cache.lastAttachments.get(message.channelId)?.[0];

    if (!attachmentUrl) return "Image not found in channel!";

    const strength = 2;

    const compressed = await decodeFromUrl(attachmentUrl, (i) => {
      i.opacity(1 / (2 * strength), true);
      for (let y = -strength; y <= strength; y += 2) {
        for (let x = -strength; x <= strength; x += 2) {
          i.composite(i, x, y);
          if (x >= 0 && y >= 0) {
            i.composite(i, -(x - 1), -(y - 1));
          }
        }
      }
      i.opacity(1, true);

      return i.encode();
    });

    await sendMessage(bot, message.channelId, {
      file: [{ blob: new Blob([compressed]), name: "img.png" }],
      content: `<@${message.authorId}>`,
    });
  },
});

createMessageCommand({
  names: ["circleblur", "circle"],
  category: Category.Image,
  meta: {
    descr: "Circular-blurs an image",
    usage: "circleblur [last attachment on the channel]",
  },
  async execute({ bot, message }) {
    const attachmentUrl = cache.lastAttachments.get(message.channelId)?.[0];

    if (!attachmentUrl) return "Image not found in channel!";

    const strength = 1;

    const compressed = await decodeFromUrl(attachmentUrl, (i) => {
      i.opacity(1 / (2 * strength), true);

      i.composite(i.clone().opacity(0.3).rotate(5, false) as Image);
      i.composite(i.clone().opacity(0.3).rotate(6, false) as Image);
      i.composite(i.clone().opacity(0.3).rotate(7, false) as Image);
      i.composite(i.clone().opacity(0.3).rotate(4, false) as Image);
      i.composite(i.clone().opacity(0.3).rotate(3, false) as Image);
      i.composite(i.clone().opacity(0.3).rotate(2, false) as Image);

      i.opacity(1, true);

      return i.encode();
    });

    await sendMessage(bot, message.channelId, {
      file: [{ blob: new Blob([compressed]), name: "img.png" }],
      content: `<@${message.authorId}>`,
    });
  },
});

createMessageCommand({
  names: ["invertvalue", "iv"],
  category: Category.Image,
  meta: {
    descr: "Invert colors",
    usage: "invertvalue [last attachment on the channel]",
  },
  async execute({ bot, message }) {
    const attachmentUrl = cache.lastAttachments.get(message.channelId)?.[0];

    if (!attachmentUrl) return "Image not found in channel!";

    const compressed = await decodeFromUrl(attachmentUrl, (i) => {
      i.invertValue();
      return i.encode();
    });

    await sendMessage(bot, message.channelId, {
      file: [{ blob: new Blob([compressed]), name: "img.png" }],
      content: `<@${message.authorId}>`,
    });
  },
});

createMessageCommand({
  names: ["invertcolor", "ic"],
  category: Category.Image,
  meta: {
    descr: "Invert colors",
    usage: "invert [last attachment on the channel]",
  },
  async execute({ bot, message }) {
    const attachmentUrl = cache.lastAttachments.get(message.channelId)?.[0];

    if (!attachmentUrl) return "Image not found in channel!";

    const compressed = await decodeFromUrl(attachmentUrl, (i) => {
      i.invert();
      return i.encode();
    });

    await sendMessage(bot, message.channelId, {
      file: [{ blob: new Blob([compressed]), name: "img.png" }],
      content: `<@${message.authorId}>`,
    });
  },
});

createMessageCommand({
  names: ["size", "exif"],
  category: Category.Image,
  meta: {
    descr: "Get the size of an image",
    usage: "size [last attachment on the channel]",
  },
  async execute({ bot, message }) {
    const attachmentUrl = cache.lastAttachments.get(message.channelId)?.[0];

    if (!attachmentUrl) return "Image not found in channel!";

    const image = await Image.decode(await fetch(attachmentUrl).then((i) => i.arrayBuffer()));

    const { embed } = new MessageEmbed()
      .thumbnail("attachment://img.png")
      .color(DiscordColors.Blurple)
      .field("Width:", image.width.toLocaleString())
      .field("Height", image.height.toLocaleString())
      .field("Compressed file size (in bytes)", await image.encode().then((i) => i.byteLength.toLocaleString()));

    await sendMessage(bot, message.channelId, {
      file: [{ blob: new Blob([await image.encode()]), name: "img.png" }],
      embeds: [embed],
      content: `<@${message.authorId}>`,
    });
  },
});
