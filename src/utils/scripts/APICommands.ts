import type { Embed } from "discordeno";
import { Api, Category, DiscordColors, userMention } from "../constants.ts";
import { commands, slashCommands } from "../cache.ts";
import { logger, LogLevels } from "../std/logger.ts";
import { ApplicationCommandOptionTypes, getUser } from "discordeno";
import { default as f } from "axiod";

const endpointsActionPairs = {
  "img/hug": "hugs",
  "img/kiss": "kisses",
  "img/poke": "pokes",
  "img/tickle": "tickle",
  "img/pat": "pats",
  "img/cuddle": "cuddle",
  "img/feed": "feeds",
};

try {
  const getDescription = (action: string, target: bigint, author: bigint) => `<@${author}> ${action} <@${target}>`;

  Object.keys(endpointsActionPairs).forEach((cmd) => {
    const commandName = cmd.slice(4, cmd.length);

    slashCommands.set(commandName, {
      options: {
        isGuildOnly: false,
        isAdminOnly: false,
        information: {
          descr: `${endpointsActionPairs[`img/${commandName}` as keyof typeof endpointsActionPairs]}`,
          usage: `[@User]`,
          short: `${endpointsActionPairs[`img/${commandName}` as keyof typeof endpointsActionPairs]}`,
        },
      },
      category: Category.Interaction,
      data: {
        name: commandName,
        description: `${commandName} a user`,
        options: [
          {
            type: ApplicationCommandOptionTypes.User,
            name: "target",
            required: true,
            description: `The user to ${commandName}`,
          },
        ],
      },

      async execute(bot, i) {
        // utilities
        type Image = { url: string /*`https://cdn.nekos.life/${string}.gif`*/ };
        const { data } = await f.get<Image | undefined>(Api.Nekos + cmd);

        const option = i.data?.options?.[0];

        if (option?.type !== ApplicationCommandOptionTypes.User) return;

        const userId = BigInt(option.value as string);
        const user = bot.users.get(userId) ?? await getUser(bot, userId);

        if (!data?.url) {
          return "No encontré una imagen para mostrar";
        }

        if (userId === i.user.id) {
          return "¿?";
        }

        if (!user) {
          return "Especifica correctamente el usuario";
        }

        return <Embed> {
          description: getDescription(
            endpointsActionPairs[`img/${commandName}` as keyof typeof endpointsActionPairs],
            i.user.id,
            user.id
          ),
          color: DiscordColors.Blurple,
          image: { url: data.url },
        };
      },
    });
    commands.set(commandName, {
      data: {
        name: commandName,
      },
      options: {
        isGuildOnly: false,
        isAdminOnly: false,
        information: {
          descr: `${endpointsActionPairs[`img/${commandName}` as keyof typeof endpointsActionPairs]}`,
          usage: `[@User]`,
          short: `${endpointsActionPairs[`img/${commandName}` as keyof typeof endpointsActionPairs]}`,
        },
      },
      category: Category.Interaction,
      async execute(bot, msg, { args }) {
        // utilities
        type Image = { url: string /*`https://cdn.nekos.life/${string}.gif`*/ };
        const { data } = await f.get<Image | undefined>(Api.Nekos + cmd);

        const search = args.join(" ").match(userMention);

        if (!search) {
          return "Especifica correctamente el usuario";
        }

        const userId = BigInt(search?.[0]?.match(/\d{18}/gi)?.[0]!);

        if (!data?.url) {
          return "No encontré una imagen para mostrar";
        }

        if (userId === msg.authorId) {
          return "¿?";
        }

        return <Embed> {
          description: getDescription(
            endpointsActionPairs[`img/${commandName}` as keyof typeof endpointsActionPairs],
            userId,
            userId === msg.authorId ? bot.id : msg.authorId
          ),
          color: DiscordColors.Blurple,
          image: { url: data.url },
        };
      },
    });
  });
} catch (error: unknown) {
  logger.error(error);
} finally {
  logger.log.call({ name: "Nekos API" }, LogLevels.Info, "Loaded API commands!");
}
