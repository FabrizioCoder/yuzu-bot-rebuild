// check if the string is an emoji
export const isCustomEmoji = (str: string) =>
  /^<([a]?):.*[a-z0-9]:\d{18}>/i.test(str);

// prefix command
// deno-lint-ignore no-control-regex
export const isNotAscii = (str: string) => /[^\x00-\x7F]+/g.test(str);
