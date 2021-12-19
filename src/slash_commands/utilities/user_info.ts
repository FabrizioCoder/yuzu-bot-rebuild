import type { Command } from "../../types/command.ts";
import type { Embed } from "../../../deps.ts";

import { Category, DiscordColors, snowflakeToTimestamp } from "../../utils/mod.ts";
import { ApplicationCommandOptionTypes, avatarURL, getMember, getUser } from "../../../deps.ts";

export default <Command> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Busca un usuario",
      short: "Busca un usuario",
      usage: "<User>",
    },
  },
  category: Category.Info,
  data: {
    name: "user",
    description: "Busca un usuario",
    options: [
      {
        type: ApplicationCommandOptionTypes.User,
        required: true,
        name: "user",
        description: "Usuario 👥",
      },
    ],
  },
  async execute(bot, interaction) {
    const option = interaction.data?.options?.[0];

    if (option?.type === ApplicationCommandOptionTypes.User) {
      const user =
        bot.users.get(BigInt(option.value as string)) ??
        await getUser(bot, BigInt(option.value as string)) ??
        interaction.user;

      if (!user) return "No encontré al usuario";

      const embed: Embed = {
        author: {
          name: `${user.username}#${user.discriminator}`,
          iconUrl: avatarURL(bot, user.id, user.discriminator, {
            avatar: user.avatar,
            size: 512,
          }),
          url: avatarURL(bot, user.id, user.discriminator, {
            avatar: user.avatar,
            size: 2048, // Discord will resize this fyi
          }),
        },
        thumbnail: {
          url: avatarURL(bot, user.id, user.discriminator, {
            avatar: user.avatar,
            size: 512,
          }),
        },
        fields: [
          {
            name: "¿Es bot?",
            value: user.bot ? "Sí" : "No",
          },
          {
            name: "Se unió a Discord en:",
            value: `<t:${snowflakeToTimestamp(user.id) / 1000n}> <- <t:${snowflakeToTimestamp(user.id) / 1000n}:R>`,
          },
        ],
        color: DiscordColors.Blurple,
        footer: {
          text: user.id.toString(),
          iconUrl: avatarURL(bot, user.id, user.discriminator, {
            avatar: user.avatar,
            size: 512,
          }),
        },
      };

      if (interaction.guildId) {
        // get the same user as a member object
        const member = await getMember(bot, interaction.guildId, user.id);

        if (member.premiumSince) {
          embed.fields?.push({
            name: "Mejora el servidor desde:",
            value: `<t:${BigInt(member.premiumSince) / 1000n}> <- <t:${BigInt(member.premiumSince) / 1000n}:R>`,
          });
        }

        embed.fields?.push(
          {
            name: "Se unió al servidor en:",
            value: `<t:${BigInt(member.joinedAt) / 1000n}> <- <t:${BigInt(member.joinedAt) / 1000n}:R>`,
          },
          {
            name: "Apodo",
            value: member.nick ?? user.username,
          },
          {
            name: `Roles: [${member.roles.length}]`,
            value: `@everyone ${member.roles.map((r) => `<@&${r}>`).join(" ")}`,
          }
        );
      }

      return embed;
    }
  },
};
