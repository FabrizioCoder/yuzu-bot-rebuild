// constants
export * from "./constants/categories.ts";
export * from "./constants/options.ts";
export * from "./constants/time.ts";
export * from "./constants/mentions.ts";
export * from "./constants/colors.ts";
export * from "./constants/emojis.ts";

// our cache
export * from "./cache.ts";

// utility
export * from "./handlers/handler.ts";
export * from "./handlers/registerTasks.ts";

// collectors
export * from "./collectors/needButton.ts";
export * from "./collectors/needMessage.ts";

// regexp
export * from "./string_manipulation/url.ts";
export * from "./string_manipulation/emoji.ts";

// etc
export * from "./snowflake_util.ts";
export * from "./range.ts";

export function randomHex() {
  return Math.floor(Math.random() * 16777215);
}

export function toCapitalCase(str: string) {
  return `${str[0].toUpperCase()}${str.slice(1, str.length)}`;
}
