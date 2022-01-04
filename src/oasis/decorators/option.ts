import type { ApplicationCommandOption } from "discordeno";
import { ApplicationCommandOptionTypes } from "discordeno";

export function Option(option: ApplicationCommandOption) {
  return function(target: Function) {
    const options = (target as { data?: { options?: ApplicationCommandOption[] } })?.data?.options;

    options?.push(option);
  }
}

export function UserOption(option: Omit<ApplicationCommandOption, "type">) {
  return function(target: Function) {
    const options = (target as { data?: { options?: ApplicationCommandOption[] } })?.data?.options;

    options?.push({ type: ApplicationCommandOptionTypes.User, ...option });
  }
}

export function StringOption(option: Omit<ApplicationCommandOption, "type">) {
  return function(target: Function) {
    const options = (target as { data?: { options?: ApplicationCommandOption[] } })?.data?.options;

    options?.push({ type: ApplicationCommandOptionTypes.String, ...option });
  }
}

export function IntegerOption(option: Omit<ApplicationCommandOption, "type">) {
  return function(target: Function) {
    const options = (target as { data?: { options?: ApplicationCommandOption[] } })?.data?.options;

    options?.push({ type: ApplicationCommandOptionTypes.Integer, ...option });
  }
}
export function ChannelOption(option: Omit<ApplicationCommandOption, "type">) {
  return function(target: Function) {
    const options = (target as { data?: { options?: ApplicationCommandOption[] } })?.data?.options;

    options?.push({ type: ApplicationCommandOptionTypes.Channel, ...option });
  }
}

export function RoleOption(option: Omit<ApplicationCommandOption, "type">) {
  return function(target: Function) {
    const options = (target as { data?: { options?: ApplicationCommandOption[] } })?.data?.options;

    options?.push({ type: ApplicationCommandOptionTypes.Role, ...option });
  }
}

export function MentionableOption(option: Omit<ApplicationCommandOption, "type">) {
  return function(target: Function) {
    const options = (target as { data?: { options?: ApplicationCommandOption[] } })?.data?.options;

    options?.push({ type: ApplicationCommandOptionTypes.Mentionable, ...option });
  }
}

export function BooleanOption(option: Omit<ApplicationCommandOption, "type">) {
  return function(target: Function) {
    const options = (target as { data?: { options?: ApplicationCommandOption[] } })?.data?.options;

    options?.push({ type: ApplicationCommandOptionTypes.Boolean, ...option });
  }
}

export function NumberOption(option: Omit<ApplicationCommandOption, "type">) {
  return function(target: Function) {
    const options = (target as { data?: { options?: ApplicationCommandOption[] } })?.data?.options;

    options?.push({ type: ApplicationCommandOptionTypes.Number, ...option });
  }
}

export function SubCommandOption(option: Omit<ApplicationCommandOption, "type">) {
  return function(target: Function) {
    const options = (target as { data?: { options?: ApplicationCommandOption[] } })?.data?.options;

    options?.push({ type: ApplicationCommandOptionTypes.User, ...option });
  }
}
