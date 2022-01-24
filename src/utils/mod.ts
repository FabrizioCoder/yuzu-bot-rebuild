// constants
export * from "./constants.ts";

// utility
export * from "./std/range.ts";
export * from "./std/cheemsify.ts";
export * from "./std/logger.ts";
export * from "./algorithms/levenshtein_distance.ts";

export * from "./scripts/APICommands.ts";
export * from "./i18next.ts";

export * as cache from "./cache.ts";

export { default as Configuration } from "./configuration.ts";

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

export function maskify(str: string) {
  return str.replace(/.(?=.{4,}$)/g, "#");
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
