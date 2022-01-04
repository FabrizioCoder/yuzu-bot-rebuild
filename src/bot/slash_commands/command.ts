import type { Command } from "../types/command.ts";
import type { Embed } from "discordeno";
import { cache, Category, DiscordColors } from "utils";
import { ApplicationCommandOptionTypes, avatarURL } from "discordeno";

export default <Command> {
  options: {
    isGuildOnly: true,
    information: {
      descr: "📗 Encuentra un comando del bot...",
      short: "📗 Encuentra un comando del bot...",
      usage: "<Command>",
    },
  },
  category: Category.Info,
  data: {
    name: "findcommand",
    description: "📗 Encuentra un comando del bot...",
    options: [
      {
        type: ApplicationCommandOptionTypes.String,
        name: "name",
        required: true,
        description: "El comando a buscar",
      },
    ],
  },
  async execute({ bot, interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) return;

    const command = cache.slashCommands.get(option.value as string) ?? cache.commands.get(option.value as string);

    if (!command) return "El comando no existe";

    return <Embed> {
      color: DiscordColors.Blurple,
      thumbnail: {
        url: avatarURL(bot, interaction.user.id, interaction.user.discriminator, {
          avatar: interaction.user.avatar,
          size: 512,
        }),
      },
      footer: {
        text: "Optional [] Required <>",
        iconUrl: avatarURL(bot, interaction.user.id, interaction.user.discriminator, {
          avatar: interaction.user.avatar,
          size: 512,
        }),
      },
      fields: [
        {
          name: "Nombre del comando:",
          value: command.data.name,
          inline: true,
        },
        {
          name: "Uso del comando:",
          value: `${"description" in command.data ? "/" : "!"}${command.data.name} ${command.options?.information?.usage}`,
          inline: true,
        },
        {
          name: "Información del comando:",
          value:
            "description" in command.data
              ? command.data.description
              : command.options?.information?.descr ?? command.options?.information?.short ?? "❓",

          inline: true,
        },
      ],
    };
  },
};
