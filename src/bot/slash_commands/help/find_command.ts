import type { Context } from "oasis";
import { Command, MessageEmbed, Option } from "oasis";
import { cache, Category, DiscordColors } from "utils";
import { ApplicationCommandOptionTypes, avatarURL } from "discordeno";

@Command({
  name: "findcommand",
  description: "📗 Encuentra un comando del bot...",
  isGuildOnly: true,
  meta: {
    descr: "📗 Encuentra un comando del bot...",
    short: "📗 Encuentra un comando del bot...",
    usage: "<Command>",
  },
  category: Category.Info,
})
@Option({
  type: ApplicationCommandOptionTypes.String,
  name: "name",
  required: true,
  description: "El comando a buscar",
})
export default class {
  static execute({ bot, interaction }: Context) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return;
    }

    const command = cache.slashCommands.get(option.value as string) ?? cache.commands.get(option.value as string);

    if (!command) {
      return "El comando no existe";
    }

    const avatar = avatarURL(bot, interaction.user.id, interaction.user.discriminator, {
      avatar: interaction.user.avatar,
    });

    const { name: commandName } = command.data;

    const prefix = "description" in command.data ? "/" : "!";
    const commandDescription = "description" in command.data ? command.data.description : undefined;
    const commandMetaData = command.options?.information;

    const embed = MessageEmbed
      .new()
      .color(DiscordColors.Blurple)
      .thumbnail(avatar)
      .footer("Optional [] Required <>", avatar)
      .field("Nombre del comando:", commandName, true)
      .field("Uso del comando:", `${prefix}${commandName} ${commandMetaData?.usage}`, true)
      .field("Info del comando:", commandDescription ?? commandMetaData?.descr ?? commandMetaData?.short ?? "❓", true)
      .end();

    return embed;
  }
}
