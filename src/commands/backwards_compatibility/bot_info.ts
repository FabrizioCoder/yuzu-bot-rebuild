import type { Command } from "../../types/command.ts";
import type { Embed } from "../../../deps.ts";
import {
  DiscordColors,
  Division,
  snowflakeToTimestamp,
  toCapitalCase,
} from "../../utils/mod.ts";
import { avatarURL } from "../../../deps.ts";

export default <Command<false>> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Estadísticas para nerds",
      short: "Estadísticas para nerds",
      usage: "lol",
    },
  },
  division: Division.INFO,
  data: {
    name: "botinfo",
  },
  execute(bot) {
    const me = bot.users.get(bot.id);

    if (!me) return;

    return <Embed> {
      color: DiscordColors.Blurple,
      title: `Using ${bot.gateway.shards.size} shards`,
      thumbnail: {
        url: avatarURL(
          bot,
          me.id,
          me.discriminator,
          {
            avatar: me.avatar,
            size: 512,
          },
        ),
      },
      fields: [
        {
          name: "Memory",
          value: Object.entries(Deno.memoryUsage()).map(([k, v]) =>
            `${toCapitalCase(k)} |> ${(((v / 1024 / 1024) * 100) / 100) | 0} MB`
          ).join("\n"),
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
            `[Deno](https://deno.land/) \\🦕 \`${Deno.version.deno}\`\n [Typescript](https://www.typescriptlang.org/) \`${Deno.version.typescript}\`\n [Discordeno](https://github.com/discordeno/discordeno) \`${bot.constants.DISCORDENO_VERSION}\``,
          inline: true,
        },
        {
          name: "Repository",
          value:
            "\\🔒 [Get source code](https://github.com/Le-Val/yuzu-bot-rebuild)",
        },
        {
          name: "Guilds",
          value: bot.guilds.size.toLocaleString(),
          inline: true,
        },
        {
          name: "Users",
          value: bot.users.size.toLocaleString(),
          inline: true,
        },
        {
          name: "Members",
          value: bot.members.size.toLocaleString(),
          inline: true,
        },
        {
          name: "Since",
          value: `<t:${snowflakeToTimestamp(bot.id) / 1000n}> <- <t:${
            snowflakeToTimestamp(bot.id) / 1000n
          }:R>`,
        },
      ],
      footer: {
        text: bot.id.toString(),
      },
    };
  },
};
