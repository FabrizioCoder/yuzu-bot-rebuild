import { Api, Category, DiscordColors } from "../constants.ts";
import { cache } from "oasis";
import { createCommand, createMessageCommand, MessageEmbed } from "oasis";
import { ApplicationCommandTypes, ApplicationCommandOptionTypes, getUser } from "discordeno";

// modify the endpointActionPairs to change the actions
export function loadDynamicCommands() {
  setInteractionCommands(cache.slashCommands);
  setMessageCommands(cache.commands);
}

const endpointsActionPairs = new Map([
  ["img/hug", "hugs"],
  ["img/kiss", "kisses"],
  ["img/poke", "pokes"],
  ["img/tickle", "tickle"],
  ["img/pat", "pats"],
  ["img/cuddle", "cuddle"],
  ["img/feed", "feeds"],
] as const);

function getDescription(action: string, target: bigint, author: bigint) {
  return `<@${author}> ${action} <@${target}>`;
}

function getCommandName(endpointString: string) {
  return endpointString.slice(4, endpointString.length);
}

function getActionFromCommandName(commandName: string) {
  return endpointsActionPairs.get(`img/${commandName}` as any);
}

function setInteractionCommands(cmds: Map<string, unknown>) {
  Array.from(endpointsActionPairs.keys()).forEach((endpoint) => {
    const commandName = getCommandName(endpoint);
    cmds.set(
      commandName,
      createCommand({
        isGuildOnly: false,
        meta: {
          descr: getActionFromCommandName(commandName),
          short: getActionFromCommandName(commandName),
          usage: "[@User]",
        },
        category: Category.Interaction,
        data: {
          type: ApplicationCommandTypes.ChatInput,
          name: commandName,
          description: `${commandName} a user`,
          options: [
            {
              type: ApplicationCommandOptionTypes.User,
              name: "user",
              required: true,
              description: `User to ${commandName}`,
            },
          ],
        },
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
            return "No encontré una imagen para mostrar";
          }

          if (userId === interaction.user.id) {
            return "No debes hacerlo contigo mismo";
          }

          if (!user) {
            return "Especifica correctamente el usuario";
          }

          const description = String(getActionFromCommandName(commandName));

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
  Array.from(endpointsActionPairs.keys()).forEach((endpoint) => {
    const commandName = getCommandName(endpoint);
    cmds.set(
      commandName,
      createMessageCommand({
        isGuildOnly: false,
        meta: {
          descr: getActionFromCommandName(commandName),
          short: getActionFromCommandName(commandName),
          usage: "[@User]",
        },
        category: Category.Interaction,
        name: commandName,
        async execute({ bot, message, args: { args } }) {
          type Image = { url: string };
          const data = (await fetch(Api.Nekos + endpoint).then((a) => a.json())) as Image | undefined;

          // options
          const rawMention = args.join(" ");
          const search = rawMention?.match(/\d{18}/gi)?.[0];

          if (!search) {
            return "Menciona a alguien";
          }

          // get the user
          const userId = BigInt(search);
          const user = bot.users.get(userId) ?? (await getUser(bot, userId));

          if (!data) {
            return "No encontré una imagen para mostrar";
          }

          if (userId === message.authorId) {
            return "No debes hacerlo contigo mismo";
          }

          if (!user) {
            return "Especifica correctamente el usuario";
          }

          const description = String(getActionFromCommandName(commandName));

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
