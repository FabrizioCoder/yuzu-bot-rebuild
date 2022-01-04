import type { ApplicationCommandOption } from "discordeno";

export function Option(option: ApplicationCommandOption) {
  return function(target: Function) {
    const options = (target as { data?: { options?: ApplicationCommandOption[] } })?.data?.options;

    options?.push(option);
  }
}
