import type { ApplicationCommandOption } from "discordeno";

export function SubcommandOption(name: string, option: ApplicationCommandOption) {
  return function(target: Function) {
    const options = (target as { data?: { options?: ApplicationCommandOption[] } })?.data?.options;

    options?.find((o) => o.name === name)?.options?.push(option);
  }
}
