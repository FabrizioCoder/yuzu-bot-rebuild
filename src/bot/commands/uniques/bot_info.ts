import type { Context } from "oasis";
import { Command, MessageEmbed, Stop } from "oasis";
import { Category, DiscordColors, snowflakeToTimestamp, toCapitalCase } from "utils";
import { avatarURL, getUser } from "discordeno";

@Command({
  name: "botinfo",
  category: Category.Info,
  meta: {
    descr: "Estadísticas para nerds",
    short: "Estadísticas para nerds",
    usage: "lol",
  },
})
export default abstract class {
  @Stop<false>((ctx) => ctx.message.guildId === 882096686334345216n)
  @Stop<false>((ctx) => ctx.message.guildId === 916940037176836096n)
  static async execute({ bot }: Context<false>) {
    // utility
    const me = bot.users.get(bot.id) ?? await getUser(bot, bot.id);
    const botCreatedAt = snowflakeToTimestamp(bot.id) /* toUnix -> */ / 1000;

    if (!me) {
      return;
    }

    // memory usage
    const memory = Object.entries(Deno.memoryUsage()).map(
      ([k, v]: [string, number]) => `${toCapitalCase(k)} -> ${(((v / 1024 / 1024) * 100) / 100) | 0} MB`
    );

    // avatar
    const avatar = avatarURL(bot, me.id, me.discriminator, { avatar: me.avatar });

    return MessageEmbed
      .new()
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
      .field("My Discord", "Yuzu#1401")
      .field("Repository", "\\🔒 [Get source code](https://github.com/Le-Val/yuzu-bot-rebuild)")
      .field("Since", `<t:${botCreatedAt}> <- <t:${botCreatedAt}:R>`)
      .field(
        "Desarrollo",
        `[Deno](https://deno.land/) \\🦕 \`${Deno.version.deno}\`\n` +
        `[Typescript](https://www.typescriptlang.org/) \`${Deno.version.typescript}\`\n` +
        `[Discordeno](https://github.com/discordeno/discordeno) \`${bot.constants.DISCORDENO_VERSION}\``,
      )
      .end();
  }
}
