import { createMessageCommand, MessageEmbed } from "oasis";
import { Category, DiscordColors, snowflakeToTimestamp, toCapitalCase } from "utils";
import { avatarURL, getUser } from "discordeno";

createMessageCommand({
  names: ["info", "botinfo"],
  category: Category.Info,
  meta: {
    descr: "commands:info:DESCRIPTION",
    usage: "commands:info:USAGE",
  },
  translated: true,
  async execute({ bot }) {
    // utility
    const me = bot.users.get(bot.id) ?? (await getUser(bot, bot.id));
    const botCreatedAt = Math.floor(snowflakeToTimestamp(bot.id) /* toUnix -> */ / 1000);

    if (!me) {
      return;
    }

    // memory usage
    const memory = Object.entries(Deno.memoryUsage()).map(
      ([k, v]: [string, number]) => `${toCapitalCase(k)} -> ${(((v / 1024 / 1024) * 100) / 100) | 0} MB`
    );

    // avatar
    const avatar = avatarURL(bot, me.id, me.discriminator, { avatar: me.avatar });

    const { embed } = new MessageEmbed()
      .color(DiscordColors.Blurple)
      .thumbnail(avatar)
      .title(`Using ${bot.gateway.shards.size} shards`)
      .footer(`${bot.id}`)
      .field("Cached guilds", bot.guilds.size.toLocaleString(), true)
      .field("Cached users", bot.users.size.toLocaleString(), true)
      .field("Cached members", bot.members.size.toLocaleString(), true)
      .field("Cached channels", bot.channels.size.toLocaleString(), true)
      .field("Cached messages", bot.messages.size.toLocaleString(), true)
      .field("Memory", memory.join("\n"))
      .field("OS", toCapitalCase(Deno.build.os))
      .field("My Discord", "Yuzu#0956")
      .field("Repository", "\\🔒 [Get source code](https://github.com/Le-Val/yuzu-bot-rebuild)")
      .field("Since", `<t:${botCreatedAt}> <- <t:${botCreatedAt}:R>`)
      .field(
        "Desarrollo",
        `[Deno](https://deno.land/) \\🦕 \`${Deno.version.deno}\`\n` +
          `[Typescript](https://www.typescriptlang.org/) \`${Deno.version.typescript}\`\n` +
          `[Discordeno](https://github.com/discordeno/discordeno) \`${bot.constants.DISCORDENO_VERSION}\``
      );

    return embed;
  },
});
