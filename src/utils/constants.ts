// ex: Emoji[:github:]
export enum Emoji {
  ":yes:" = "<:yes:900646190876602390>",
  ":no:" = "<:no:900646321399156766>",
  ":translator:" = "<:translator:900659602922827786>",
  ":plus:" = "<:plus:900658944123486228>",
  ":github:" = "<:github:900653682981494784>",

  ":blurple_arrow_left:" = "<:blurple_arrow_left:902579559310979083>",
  ":blurple_arrow_right:" = "<:blurple_arrow_right:902579658917281803>",
  ":blurple_hashtag:" = "<:blurple_hashtag:902580515922657332>",
  ":blurple_x:" = "<:blurple_x:902581558374961152>",
}

export enum CategoryEmoji {
  ":category_fun:" = "<:category_fun:900659146586738729>",
  ":category_info:" = "<:category_info:900655062089596938>",
  ":category_util:" = "<:category_util:900654248667267124>",
  ":category_admin:" = "<:category_admin:900649020668645386>",
  ":category_config:" = "<:category_config:900660131275100182>",
  ":category_interaction:" = "<:category_interaction:900655587384246272>",
  ":category_image:" = "<:category_image:932054764634636348>",
}

export enum DiscordColors {
  Blurple = 0x5865f2,
  Green = 0x57f287,
  Yellow = 0xfee75c,
  Fuchsia = 0xeb459e,
  Red = 0xed4245,
  White = 0xffffff,
  Black = 0x000000,
}

export enum Category {
  Config,
  Fun,
  Info,
  Interaction,
  Util,
  Admin,
  Owner,
  Image,
}

// utility to parse mentions
export const botMention = (botId: bigint) => new RegExp(`^<@!?${botId}>( |)$`);
export const mention = /^<(@&|@|#|@!)\d{18}>/gim;
export const roleMention = /^<(@&)\d{18}>/gim;
export const userMention = /^<(@|@!)\d{18}>/gim;
export const chanMention = /^<(#)\d{18}>/gim;

export enum Api {
  Nekos = "https://nekos.life/api/v2/",
  PokeApi = "https://pokeapi.co/api/v2",
}
