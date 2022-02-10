import { Api, Category, DiscordColors } from "../constants.ts";
import { translate } from "../i18next.ts";
import { CommandoCache, createCommand, createMessageCommand } from "oasis/commando";
import { MessageEmbed } from "oasis/builders";
import { ApplicationCommandOptionTypes, ApplicationCommandTypes, getUser } from "discordeno";

// modify the endpointActionPairs to change the actions
export function loadDynamicCommands() {
  setInteractionCommands(CommandoCache.slashCommands);
  setMessageCommands(CommandoCache.commands);
}

const endpoints = ["img/hug", "img/kiss", "img/poke", "img/tickle", "img/pat", "img/cuddle", "img/feed"];

function getDescription(action: string, target: bigint, author: bigint) {
  return `<@${author}> ${action} <@${target}>`;
}

function getCommandName(endpointString: string) {
  return endpointString.slice(4, endpointString.length);
}

function setInteractionCommands(cmds: Map<string, unknown>) {
  endpoints.forEach((endpoint) => {
    const commandName = getCommandName(endpoint);
    cmds.set(
      commandName,
      createCommand({
        meta: {
          descr: `commands:${commandName}:DESCRIPTION`,
          usage: `commands:${commandName}:USAGE`,
        },
        category: Category.Interaction,
        data: {
          type: ApplicationCommandTypes.ChatInput,
          name: commandName,
          description: `To ${commandName} a user`,
          options: [
            {
              type: ApplicationCommandOptionTypes.User,
              name: "user",
              required: true,
              description: `User to ${commandName}`,
            },
          ],
        },
        translated: true,
        async execute({ bot, interaction }) {
          type Image = { url: string };
          const data = (await fetch(Api.Nekos + endpoint).then((a) => a.json())) as Image | undefined;

          // options
          const option = interaction.data?.options?.[0];

          if (option?.type !== ApplicationCommandOptionTypes.User) {
            return;
          }

          const userId = BigInt(option.value as string);
          const user = bot.users.get(userId) ?? (await getUser(bot, userId));

          if (!data) {
            return `commands:${commandName}:ON_INVALID_DATA`;
          }

          if (userId === interaction.user.id) {
            return `commands:${commandName}:ON_SELF`;
          }

          if (!user) {
            return `commands:${commandName}:ON_INVALID_USER`;
          }

          const description = await translate(bot, `commands:${commandName}:ACTION`, interaction.guildId);

          const { embed } = new MessageEmbed()
            .color(DiscordColors.Blurple)
            .image(data.url)
            .description(getDescription(description, interaction.user.id, user.id));

          return embed;
        },
      })
    );
  });
}

function setMessageCommands(cmds: Map<string, unknown>) {
  endpoints.forEach((endpoint) => {
    const commandName = getCommandName(endpoint);
    cmds.set(
      commandName,
      createMessageCommand({
        meta: {
          descr: `commands:${commandName}:DESCRIPTION`,
          usage: `commands:${commandName}:USAGE`,
        },
        category: Category.Interaction,
        names: [commandName],
        translated: true,
        async execute({ bot, message, args: { args } }) {
          type Image = { url: string };
          const data = (await fetch(Api.Nekos + endpoint).then((a) => a.json())) as Image | undefined;

          // options
          const rawMention = args.join(" ");
          const search = rawMention?.match(/\d{18}/gi)?.[0];

          if (!search) {
            return `commands:${commandName}:ON_INVALID_USER`;
          }

          // get the user
          const userId = BigInt(search);
          const user = bot.users.get(userId) ?? (await getUser(bot, userId));

          if (!data) {
            return `commands:${commandName}:ON_INVALID_DATA`;
          }

          if (userId === message.authorId) {
            return `commands:${commandName}:ON_SELF`;
          }

          if (!user) {
            return `commands:${commandName}:ON_INVALID_USER`;
          }

          const description = await translate(bot, `commands:${commandName}:ACTION`, message.guildId);

          const { embed } = new MessageEmbed()
            .color(DiscordColors.Blurple)
            .image(data.url)
            .description(getDescription(description, message.authorId, user.id));

          return embed;
        },
      })
    );
  });
}
