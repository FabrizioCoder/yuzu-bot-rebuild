import { createCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
import { Category, DiscordColors, snowflakeToTimestamp } from "utils";
import { ApplicationCommandOptionTypes, avatarURL, getMember } from "discordeno";

createCommand({
  meta: {
    descr: "Busca un usuario",
    short: "Busca un usuario",
    usage: "<User>",
  },
  category: Category.Info,
  async execute({ bot, interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.User) {
      return;
    }

    const user = bot.users.get(BigInt(option.value as string));

    if (!user) {
      return "No encontré al usuario";
    }

    const avatar = avatarURL(bot, user.id, user.discriminator, {
      avatar: user.avatar,
    });

    const embed = new MessageEmbed()
      .color(DiscordColors.Blurple)
      .footer(`${user.id}`, avatarURL(bot, user.id, user.discriminator, { avatar: user.avatar }))
      .field("¿Es bot?", user.bot ? "Sí" : "No")
      .field(
        "Se unió a Discord en:",
        `<t:${Math.floor(snowflakeToTimestamp(user.id) / 1000)}> <- <t:${Math.floor(
          snowflakeToTimestamp(user.id) / 1000
        )}:R>`
      )
      .thumbnail(avatar)
      .author(`${user.username}#${user.discriminator}`, avatar, avatar);

    if (interaction.guildId) {
      // get the same user as a member object
      const member = bot.members.get(user.id) ?? (await getMember(bot, interaction.guildId, user.id));

      if (member.guildId === interaction.guildId) {
        // if is booster
        if (member.premiumSince) {
          embed.field(
            "Mejora el servidor desde:",
            `<t:${Math.floor(member.premiumSince / 1000)})> <- <t:${Math.floor(member.premiumSince / 1000)}:R>`
          );
        }

        embed.field(
          "Se unió al servidor en:",
          `<t:${Math.floor(member.joinedAt / 1000)}> <- <t:${Math.floor(member.joinedAt / 1000)}:R>`
        );

        embed.field("Apodo", member.nick ?? user.username);

        embed.field(`Roles: [${member.roles.length}]`, `@everyone ${member.roles.map((r) => `<@&${r}>`).join(" ")}`);
      }
    }

    return embed.embed;
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("userinfo")
    .setDescription("Busca un usuario")
    .addUserOption((o) => o.setName("user").setDescription("User to search 👥").setRequired(true))
    .toJSON(),
});
