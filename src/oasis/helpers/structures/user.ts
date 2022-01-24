import type { Bot, DiscordenoUser } from "discordeno";

export interface OasisUser extends DiscordenoUser {
  tag: string;
  toString(): string;
}

export function makeUser(_bot: Bot, user: DiscordenoUser): OasisUser {
  return {
    ...user,
    tag: `${user.username}#${user.discriminator}`,
    toString() {
      return `<@${this.id}>`;
    },
  };
}
