import type { Embed } from "../../../deps.ts";
import { ApplicationCommandOptionTypes } from "../../../deps.ts";
import { cache } from "../Handlers/cache.ts";

import axiod from "https://deno.land/x/axiod@0.23.1/mod.ts";

const api = "https://nekos.life/api/v2/";
const endpoints = [
  "img/hug",
  "img/kiss",
  "img/poke",
  "img/tickle",
  "img/pat",
  "img/cuddle",
] as const;

endpoints.forEach(async (cmd) => {
  const commandName = cmd.slice(4, cmd.length);

  type Image = { url: string /*`https://cdn.nekos.life/${string}.gif`*/ };
  const { data } = await axiod.get<Image | undefined>(api + cmd);

  cache.slashCommands.set(commandName, {
    options: {
      guildOnly: false,
      adminOnly: false,
      information: {
        descr: `To ${commandName}`,
        usage: `[@User]`,
        short: `To ${commandName}`,
      },
    },
    // division: Division.INTERACTION,

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
      const getDescription = (
        action: string,
        target: bigint,
        author: bigint,
      ) => `<@${target}> received a ${action} from <@${author}>`;

      const option = i.data?.options?.[0];

      if (option?.type !== ApplicationCommandOptionTypes.User) return;

      const userId = BigInt(option.value as string);
      const user = await bot.cache.users.get(userId);

      if (!data?.url) {
        return "No encontré una imagen para mostrar";
      }

      if (!user) {
        return "Especifica correctamente el usuario";
      }

      return <Embed> {
        description: getDescription(commandName, i.user.id, user.id),
        color: 0x39F133,
        image: { url: data.url },
      };
    },
  });
});
