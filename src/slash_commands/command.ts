import type { Command } from "../types/command.ts";
import type { Embed } from "../../deps.ts";

import { cache, DiscordColors, Division } from "../utils/mod.ts";
import { ApplicationCommandOptionTypes, avatarURL } from "../../deps.ts";

export default <Command> {
  options: {
    guildOnly: true,
    adminOnly: false,
    information: {
      descr: "📗 Encuentra un comando del bot...",
      short: "📗 Encuentra un comando del bot...",
      usage: "<Command>",
    },
  },
  division: Division.INFO,
  data: {
    name: "commands",
    description: "📗 Encuentra un comando del bot...",
    options: [
      {
        type: ApplicationCommandOptionTypes.String,
        name: "command",
        required: true,
        description: "El comando a buscar",
      },
    ],
  },
  async execute(bot, interaction) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) return;

    const command = cache.slashCommands.get(option.value as string) ??
      cache.commands.get(option.value as string);

    if (!command) return "El comando no existe";

    return <Embed> {
      color: DiscordColors.Blurple,
      thumbnail: {
        url: avatarURL(
          bot,
          interaction.user.id,
          interaction.user.discriminator,
          {
            avatar: interaction.user.avatar,
            size: 512,
          },
        ),
      },
      footer: {
        text: "Optional [] Required <>",
        iconUrl: avatarURL(
          bot,
          interaction.user.id,
          interaction.user.discriminator,
          {
            avatar: interaction.user.avatar,
            size: 512,
          },
        ),
      },
      fields: [
        {
          name: "Nombre del comando:",
          value: command.data.name,
          inline: true,
        },
        {
          name: "Uso del comando:",
          value: `${
            command.data.description ? "/" : "!"
          }${command.data.name} ${command.options?.information?.usage}`,
          inline: true,
        },
        {
          name: "Información del comando:",
          value: command.data.description ??
            command.options?.information?.descr ??
            command.options?.information?.short ?? "❓",

          inline: true,
        },
      ],
    };
  },
};
