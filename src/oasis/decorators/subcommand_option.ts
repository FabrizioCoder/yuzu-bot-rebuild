import type { ApplicationCommandOption } from "discordeno";

export function OptionIn(name: string, option: ApplicationCommandOption) {
  return function(target: any) {
    const subcommand = (target as any)
      .data.options
      .find((o: ApplicationCommandOption) => o.name === name);

    subcommand.options ??= [];
    subcommand.options.push(option);
    return target;
  }
}
