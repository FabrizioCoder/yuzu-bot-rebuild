import type { Monitor } from "../../types/monitor.ts";
import type { BotWithCache } from "cache_plugin";
import { cache, Configuration } from "utils";
import {
  getChannel,
  getGuild,
  getMember,
  getMessage,
  getUser,
  InteractionResponseTypes,
  InteractionTypes,
  sendInteractionResponse,
  sendMessage,
} from "discordeno";
import { botHasGuildPermissions } from "permissions_plugin";

export default <Monitor<"interactionCreate">> {
  name: "onSlashCommand",
  type: "interactionCreate",
  isGuildOnly: false,
  ignoreBots: true,
  async execute(bot: BotWithCache, interaction) {
    if (interaction.type !== InteractionTypes.ApplicationCommand) return;

    const command = cache.slashCommands.get(interaction.data?.name!);

    if (!command) return;

    // TODO: make this more readable
    const structs = {
      channel: command.using?.includes("channel")
        ? interaction.channelId
          ? bot.channels.get(interaction.channelId) ?? await getChannel(bot, interaction.channelId)
          : undefined
        : undefined,

      guild: command.using?.includes("guild")
        ? interaction.guildId
          ? bot.guilds.get(interaction.guildId) ?? await getGuild(bot, interaction.guildId)
          : undefined
        : undefined,

      member: command.using?.includes("member")
        ? interaction.member && interaction.guildId
          ? bot.members.get(interaction.member.id) ?? await getMember(bot, interaction.guildId, interaction.member.id)
          : undefined
        : undefined,

      message: command.using?.includes("message")
        ? interaction.message && interaction.channelId
          ? bot.messages.get(interaction.message.id) ?? await getMessage(bot, interaction.channelId, interaction.message.id)
          : undefined
        : undefined,

      user: command.using?.includes("user")
        ? interaction.user
          ? bot.users.get(interaction.user.id) ?? await getUser(bot, interaction.user.id)
          : undefined
        : undefined
    };

    // defer the reply

    await sendInteractionResponse(bot, interaction.id, interaction.token, {
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    });

    // if the bot can't send messages
    if (interaction.guildId) {
      const canSendMessages = botHasGuildPermissions(bot as BotWithCache, interaction.guildId, ["SEND_MESSAGES"]);

      if (!canSendMessages) {
        return;
      }
    }

    // CHECKS

    if (!interaction.guildId && command.options?.isGuildOnly) {
      await sendInteractionResponse(bot, interaction.id, interaction.token, {
        type: InteractionResponseTypes.DeferredChannelMessageWithSource,
        data: {
          content: "Este comando solo está disponible en servidores",
        },
        private: true,
      });
      return;
    }

    // END CHECKS

    await sendMessage(bot, Configuration.CHANNEL_ID, {
      content:
        `Comando ${command.data.name} ejecutado por ${interaction.user.username}${interaction.user.discriminator} ` +
        `en el ${interaction.guildId ? "servidor" : "dm"} ${interaction.guildId ?? interaction.channelId}`,
    });

    const output = await command.execute(
      bot,
      interaction,
      structs,
    );

    // PERMISSIONS

    if (interaction.guildId) {
      const canSendEmbeds = botHasGuildPermissions(bot as BotWithCache, interaction.guildId, ["EMBED_LINKS"]);

      if (typeof output !== "string" && !canSendEmbeds) {
        await sendInteractionResponse(bot, interaction.id, interaction.token, {
          type: InteractionResponseTypes.DeferredChannelMessageWithSource,
          data: {
            content: "No puedo enviar embeds...",
          },
          private: true,
        });
      }
    }

    // END PERMISSIONS

    if (!output) return;

    // response
    await sendInteractionResponse(bot, interaction.id, interaction.token, {
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
      data: {
        content: typeof output === "string" ? output : "",
        embeds: typeof output !== "string" ? [output] : [],
        allowedMentions: { users: [], roles: [] },
      },
    });
  },
};
