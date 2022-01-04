import { Command, type Context, MessageEmbed, Option } from "oasis";
import { Category, DiscordColors, snowflakeToTimestamp } from "utils";
import { ApplicationCommandOptionTypes, avatarURL, getMember } from "discordeno";

@Command({
  name: "user",
  description: "Busca un usuario",
  meta: {
    descr: "Busca un usuario",
    short: "Busca un usuario",
    usage: "<User>",
  },
  category: Category.Info,
})
@Option({
  type: ApplicationCommandOptionTypes.User,
  required: true,
  name: "user",
  description: "Usuario 👥",
})
export default abstract class {
  static async execute({ bot, interaction }: Context) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.User) {
      return;
    }

    const user = bot.users.get(BigInt(option.value as string));

    if (!user) {
      return "No encontré al usuario";
    }

    const avatar = avatarURL(bot, user.id, user.discriminator, {
      avatar: user.avatar
    });

    const embed = MessageEmbed
      .new()
      .color(DiscordColors.Blurple)
      .footer(
        `${user.id}`,
        avatarURL(bot, user.id, user.discriminator, { avatar: user.avatar }),
      )
      .field(
        "¿Es bot?",
        user.bot ? "Sí" : "No",
      )
      .field(
        "Se unió a Discord en:",
        `<t:${snowflakeToTimestamp(user.id) / 1000n}> <- <t:${snowflakeToTimestamp(user.id) / 1000n}:R>`,
      )
      .thumbnail(avatar)
      .author(`${user.username}#${user.discriminator}`, avatar, avatar);

    if (interaction.guildId) {
      // get the same user as a member object
      const member = bot.members.get(user.id) ?? await getMember(bot, interaction.guildId, user.id);

      if (member.guildId === interaction.guildId) {
        // if is booster
        if (member.premiumSince) {
          embed.field(
            "Mejora el servidor desde:",
            `<t:${member.premiumSince / 1000}> <- <t:${member.premiumSince / 1000}:R>`,
          );
        }

        embed.field(
          "Se unió al servidor en:",
          `<t:${member.joinedAt / 1000}> <- <t:${member.joinedAt / 1000}:R>`,
        );

        embed.field(
          "Apodo",
          member.nick ?? user.username,
        );

        embed.field(
          `Roles: [${member.roles.length}]`,
          `@everyone ${member.roles.map((r) => `<@&${r}>`).join(" ")}`,
        );
      }
    }

    return embed.end();
  }
}
