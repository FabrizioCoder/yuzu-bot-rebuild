// constants
export * from "./constants/division.ts";
export * from "./constants/time.ts";
export * from "./constants/color.ts";
export * from "./constants/emoji.ts";

// utility
export * from "./std/handler.ts";
export * from "./std/mention.ts";
export * from "./std/range.ts";
export * from "./std/snowflake.ts";
export * from "./std/cheemsify.ts";

// collectors
export * from "./collectors/needButton.ts";
export * from "./collectors/needMessage.ts";

export * as cache from "./cache.ts";
export * as Options from "./constants/option.ts";

export function randomHex() {
  return Math.floor(Math.random() * 16777215);
}

export function isNotAscii(str: string) {
  // deno-lint-ignore no-control-regex
  return /[^\x00-\x7F]+/g.test(str);
}

export function isInvite(str: string) {
  return /(https:\/\/)?.*(discord.*\.?g.*g.*|invite\/*)\/?.+/gim.test(str);
}

export function isURL(str: string) {
  return /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/.test(str);
}

export function toCapitalCase(str: string) {
  return str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
}

export function isCustomEmoji(str: string) {
  return /^<([a]?):.*[a-z0-9]:\d{18}>/i.test(str);
}
