import { createCommand } from "oasis/commando";
import { ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis/builders";
import { Util } from "oasis/misc/Util.ts";
import { Category, DiscordColors, translate } from "utils";
import { ApplicationCommandOptionTypes, avatarURL, getMember } from "discordeno";

createCommand({
  meta: {
    descr: "commands:userinfo:DESCRIPTION",
    usage: "commands:userinfo:USAGE",
  },
  category: Category.Info,
  translated: true,
  async execute({ bot, interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.User) {
      return;
    }

    const user = bot.users.get(BigInt(option.value as string));

    if (!user) {
      return "commands:userinfo:USER_NOT_FOUND";
    }

    const avatar = avatarURL(bot, user.id, user.discriminator, {
      avatar: user.avatar,
    });

    const embed = new MessageEmbed()
      .color(DiscordColors.Blurple)
      .footer(`${user.id}`, avatarURL(bot, user.id, user.discriminator, { avatar: user.avatar }))
      .field(
        await translate(bot, "commands:userinfo:ON_DISCORD_SINCE", interaction.guildId),
        `<t:${Math.floor(Util.snowflakeToTimestamp(user.id) / 1000)}> <- <t:${Math.floor(
          Util.snowflakeToTimestamp(user.id) / 1000
        )}:R>`
      )
      .thumbnail(avatar)
      .author(`${user.username}#${user.discriminator}`, avatar, avatar);

    if (interaction.guildId) {
      // get the same user as a member object
      const member = bot.members.get(BigInt("" + user.id + interaction.guildId)) ?? (await getMember(bot, interaction.guildId, user.id));

      if (member.guildId === interaction.guildId) {
        // if is booster
        if (member.premiumSince) {
          embed.field(
            await translate(bot, "commands:userinfo:BOOSTING_SERVER_SINCE", interaction.guildId),
            `<t:${Math.floor(member.premiumSince / 1000)})> <- <t:${Math.floor(member.premiumSince / 1000)}:R>`
          );
        }

        embed.field(
          await translate(bot, "commands:userinfo:ON_SERVER_SINCE", interaction.guildId),
          `<t:${Math.floor(member.joinedAt / 1000)}> <- <t:${Math.floor(member.joinedAt / 1000)}:R>`
        );

        embed.field("Nick", member.nick ?? user.username);

        embed.field(`Roles: [${member.roles.length}]`, `@everyone ${member.roles.map((r) => `<@&${r}>`).join(" ")}`);
      }
    }

    return embed.embed;
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("userinfo")
    .setDescription("Searches for a user")
    .addUserOption((o) => o.setName("user").setDescription("User to search 👥").setRequired(true))
    .toJSON(),
});
