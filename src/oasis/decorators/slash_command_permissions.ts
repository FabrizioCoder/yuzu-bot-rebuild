import type { SlashContext } from "../types/command.ts";
import type { PermissionStrings } from "discordeno";
import { hasGuildPermissions, botHasGuildPermissions } from "permissions_plugin";

export function Permissions(permissions: PermissionStrings[]) {
  return function(_target: object, _key: string, descriptor: PropertyDescriptor) {
    const origin = descriptor.value;

    descriptor.value = async function(...args: [SlashContext, any[]]) {
      if (!args[0].interaction.guildId) return;
      const guild = args[0].bot.guilds.get(args[0].interaction.guildId) ?? await args[0].bot.helpers.getGuild(args[0].interaction.guildId);
      const member = args[0].interaction.member;

      if (!guild || !member) {
        return;
      }

      if (hasGuildPermissions(args[0].bot, guild, member, permissions)) return origin.apply(this, args);
    }
  }
}

export function PermissionsForBot(permissions: PermissionStrings[]) {
  return function(_target: object, _key: string, descriptor: PropertyDescriptor) {
    const origin = descriptor.value;

    descriptor.value = async function(...args: [SlashContext, any[]]) {
      if (!args[0].interaction.guildId) return;
      const guild = args[0].bot.guilds.get(args[0].interaction.guildId) ?? await args[0].bot.helpers.getGuild(args[0].interaction.guildId);

      if (!guild) {
        return;
      }

      if (botHasGuildPermissions(args[0].bot, guild, permissions)) return origin.apply(this, args);
    }
  }
}
