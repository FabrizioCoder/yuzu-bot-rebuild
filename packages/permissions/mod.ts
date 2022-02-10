import {
  BitwisePermissionFlags,
  type DiscordenoGuild,
  type DiscordenoMember,
} from "https://deno.land/x/discordeno@13.0.0-rc19/mod.ts";

export function hasPermission(bitfield: bigint, permission: keyof typeof BitwisePermissionFlags) {
  return (bitfield & BigInt(BitwisePermissionFlags[permission])) === BigInt(BitwisePermissionFlags[permission]);
}

export function hasPermissions(bitfield: bigint, permissions: Array<keyof typeof BitwisePermissionFlags>) {
  return permissions.every((perm) => hasPermission(bitfield, perm));
}

export function toPermissionsBitfield(guild: DiscordenoGuild, member: DiscordenoMember) {
  let permissions = 0n;
  permissions |=
    [...member.roles, member.guildId]
      .map((id) => guild.roles.get(id)?.permissions)
      .filter(Boolean)
      .reduce((bits, perms) => bits | perms, 0n) || 0n;
  if (guild.ownerId === member.id) permissions |= 8n;
  return permissions;
}
