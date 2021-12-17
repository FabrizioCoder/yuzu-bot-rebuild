import type { Embed } from "../../../deps.ts";
import { ApplicationCommandOptionTypes, getUser } from "../../../deps.ts";
import { Division } from "../constants/division.ts";
import { DiscordColors } from "../constants/color.ts";
import { userMention } from "../std/mention.ts";
import * as cache from "../cache.ts";
import axiod from "https://deno.land/x/axiod@0.23.1/mod.ts";

const api = "https://nekos.life/api/v2/";
const endpointsActionPairs = {
  "img/hug": "hugs",
  "img/kiss": "kisses",
  "img/poke": "pokes",
  "img/tickle": "tickle",
  "img/pat": "pats",
  "img/cuddle": "cuddle",
  "img/feed": "feeds",
} as const;

try {
  const getDescription = (action: string, target: bigint, author: bigint) => `<@${author}> ${action} <@${target}>`;

  Object.keys(endpointsActionPairs).forEach(async (cmd) => {
    const commandName = cmd.slice(4, cmd.length);

    type Image = { url: string /*`https://cdn.nekos.life/${string}.gif`*/ };
    const { data } = await axiod.get<Image | undefined>(api + cmd);

    cache.slashCommands.set(commandName, {
      options: {
        guildOnly: false,
        adminOnly: false,
        information: {
          descr: `${endpointsActionPairs[`img/${commandName}` as keyof typeof endpointsActionPairs]}`,
          usage: `[@User]`,
          short: `${endpointsActionPairs[`img/${commandName}` as keyof typeof endpointsActionPairs]}`,
        },
      },
      division: Division.INTERACTION,
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

        const option = i.data?.options?.[0];

        if (option?.type !== ApplicationCommandOptionTypes.User) return;

        const userId = BigInt(option.value as string);
        const user = bot.users.get(userId) ?? await getUser(bot, userId);

        if (!data?.url) {
          return "No encontré una imagen para mostrar";
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
    cache.commands.set(commandName, {
      data: {
        name: commandName,
      },
      options: {
        guildOnly: false,
        adminOnly: false,
        information: {
          descr: `${endpointsActionPairs[`img/${commandName}` as keyof typeof endpointsActionPairs]}`,
          usage: `[@User]`,
          short: `${endpointsActionPairs[`img/${commandName}` as keyof typeof endpointsActionPairs]}`,
        },
      },
      division: Division.INTERACTION,
      execute(bot, msg, { args }) {
        // utilities
        const search = args.join(" ").match(userMention);

        if (!search) {
          return "Especifica correctamente el usuario";
        }

        const userId = BigInt(search?.[0]?.match(/\d{18}/gi)?.[0]!);

        if (!data?.url) {
          return "No encontré una imagen para mostrar";
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
} catch (error) {
  console.error(error);
}
