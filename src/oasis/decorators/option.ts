import type { ApplicationCommandOption } from "discordeno";

export function Option(option: ApplicationCommandOption) {
  return function(target: any) {
    Object.assign(target as any, { data: { ...(target as any).data, options: [...((target as any).data?.options ?? []), option] } });
    return target;
  }
}
