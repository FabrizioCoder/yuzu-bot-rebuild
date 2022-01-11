import { Category, randomHex } from "utils";
import { createMessageCommand, MessageEmbed } from "oasis";
import { createEmoji, deleteEmoji, editEmoji, getGuild } from "discordeno";
import { botHasGuildPermissions, hasGuildPermissions } from "permissions_plugin";

createMessageCommand({
  name: "emotes",
  isGuildOnly: true,
  meta: {
    descr: "Muestra, añade y remueve emotes",
    usage: "emotes | add | remove | hide | display [name] [url]",
  },
  category: Category.Config,
  async execute({ bot, message, args }) {
    const [option, ...options] = args.args;

    if (!message.guildId) {
      return;
    }

    const guild = bot.guilds.get(message.guildId) ?? (await getGuild(bot, message.guildId));

    if (!guild || !message.member) {
      return;
    }

    if (option?.toLowerCase() === "hide" || option?.toLowerCase() === "remove" || option?.toLowerCase() === "add") {
      const canManageEmojis = hasGuildPermissions(bot, guild, message.member, ["MANAGE_EMOJIS"]);

      if (!canManageEmojis) {
        return "No posees permisos suficientes";
      }
      const botCanManageEmojis = botHasGuildPermissions(bot, guild, ["MANAGE_EMOJIS"]);

      if (!botCanManageEmojis) {
        return "No poseo suficientes permisos";
      }
    }

    switch (option?.toLowerCase()) {
      case "hide": {
        const [name, role] = options as [string | undefined, string | undefined];

        // enforce to add an emoji of 2 characters
        if (!name || name.length < 2) {
          return "El emoji debe tener al menos 2 caracteres";
        }

        if (!role) {
          return "Debes mencionar un rol";
        }

        const emoji = guild.emojis.find((emoji) => emoji.name === name);

        if (!emoji || !emoji.id) return "No se encontró el emoji";

        await editEmoji(bot, guild.id, emoji.id, {
          roles: emoji.roles ? [BigInt(role), ...emoji.roles] : [BigInt(role)],
        });

        return `Limité el emoji ${emoji.name} al rol <@&${role}>`;
      }
      case "remove": {
        const [name] = <[string | undefined]>options;

        // enforce to add an emoji of 2 characters
        if (!name || name.length < 2) {
          return "El emoji debe tener al menos 2 caracteres";
        }

        const emoji = guild.emojis.find((emoji) => emoji.name === name);

        if (!emoji || !emoji.id) return "No se encontró el emoji";

        await deleteEmoji(bot, guild.id, BigInt(emoji.id));

        return `Elminé el emoji ${emoji.name}`;
      }
      case "add": {
        const [name, image] = options as [string | undefined, string | undefined];

        // enforce to add an emoji of at least 2 characters
        if (!name || name.length < 2) {
          return "El emoji debe tener al menos 2 caracteres";
        }

        if (!image) return "Debes enviar un link con una imágen";

        const emoji = await createEmoji(bot, guild.id, {
          name,
          image,
        });

        if (!emoji) return "No se creó el emoji";

        return `Creé el emoji ${emoji.name} -> <:${emoji.name}:${emoji.id}>`;
      }
      default: {
        const emojis = guild.emojis.map((e) => `<${e.animated ? "a:" : ":"}${e.name}:${e.id}>`);

        const { embed } = new MessageEmbed()
          .color(randomHex())
          .description(`Emotes: ${emojis.join(" ")}`)
          .footer(`${guild.id}`);

        return embed;
      }
    }
  },
});
