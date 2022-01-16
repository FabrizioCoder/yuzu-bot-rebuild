import { cache, createCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
import { Category, DiscordColors } from "utils";
import { ApplicationCommandOptionTypes, avatarURL } from "discordeno";

createCommand({
  isGuildOnly: true,
  meta: {
    descr: "📗 Encuentra un comando del bot...",
    usage: "<Command>",
  },
  category: Category.Info,
  execute({ bot, interaction }) {
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
    const commandMetaData = command.meta;

    const { embed } = new MessageEmbed()
      .color(DiscordColors.Blurple)
      .thumbnail(avatar)
      .footer("Optional [] Required <>", avatar)
      .field("Nombre del comando:", commandName, true)
      .field("Uso del comando:", `${prefix}${commandName} ${commandMetaData?.usage}`, true)
      .field("Info del comando:", commandDescription ?? commandMetaData?.descr ?? "❓", true);

    return embed;
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("findcommand")
    .setDescription("📗 Encuentra un comando del bot...")
    .addStringOption((o) => o.setName("name").setDescription("Command's name to search for").setRequired(true))
    .toJSON(),
});
