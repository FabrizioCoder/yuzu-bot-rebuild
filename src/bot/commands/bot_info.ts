import type { Command } from "../types/command.ts";
import type { Embed } from "discordeno";
import { Category, DiscordColors, snowflakeToTimestamp, toCapitalCase } from "utils";
import { avatarURL, getUser } from "discordeno";

export default <Command<false>> {
  options: {
    isGuildOnly: false,
    isAdminOnly: false,
    information: {
      descr: "Estadísticas para nerds",
      short: "Estadísticas para nerds",
      usage: "lol",
    },
  },
  category: Category.Info,
  data: {
    name: "botinfo",
  },
  async execute({ bot, message }) {
    // test guilds
    if (message.guildId === 882096686334345216n) return;
    if (message.guildId === 916940037176836096n) return;

    // utility
    const me = bot.users.get(bot.id) ?? await getUser(bot, bot.id);
    const botCreatedAt = snowflakeToTimestamp(bot.id) /* toUnix -> */ / 1000n;

    // memory usage
    const memory = Object.entries(Deno.memoryUsage()).map(
      ([k, v]: [string, number]) => `${toCapitalCase(k)} -> ${(((v / 1024 / 1024) * 100) / 100) | 0} MB`
    );

    if (!me) return;

    return <Embed> {
      color: DiscordColors.Blurple,
      title: `Using ${bot.gateway.shards.size} shards`,
      thumbnail: {
        url: avatarURL(bot, me.id, me.discriminator, {
          avatar: me.avatar,
          size: 512,
        }),
      },
      fields: [
        {
          name: "Memory",
          value: memory.join("\n"),
          inline: true,
        },
        {
          name: "OS",
          value: toCapitalCase(Deno.build.os),
          inline: true,
        },
        {
          name: "My Discord",
          value: "Yuzuru#1401",
          inline: true,
        },
        {
          name: "Desarrollo",
          value:
            `[Deno](https://deno.land/) \\🦕 \`${Deno.version.deno}\`\n` +
            `[Typescript](https://www.typescriptlang.org/) \`${Deno.version.typescript}\`\n` +
            `[Discordeno](https://github.com/discordeno/discordeno) \`${bot.constants.DISCORDENO_VERSION}\``,
          inline: true,
        },
        {
          name: "Repository",
          value: "\\🔒 [Get source code](https://github.com/Le-Val/yuzu-bot-rebuild)",
        },
        {
          name: "Cached guilds",
          value: bot.guilds.size.toLocaleString(),
          inline: true,
        },
        {
          name: "Cached users",
          value: bot.users.size.toLocaleString(),
          inline: true,
        },
        {
          name: "Cached members",
          value: bot.members.size.toLocaleString(),
          inline: true,
        },
        {
          name: "Since",
          value: `<t:${botCreatedAt}> <- <t:${botCreatedAt}:R>`,
        },
      ],
      footer: {
        text: bot.id.toString(),
      },
    };
  },
};
