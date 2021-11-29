// utility to parse mentions

export const mention = /^<(@&|@|#)\d{18}>/ig;
export const roleMention = /^<(@&)\d{18}>/ig;
export const userMention = /^<(@)\d{18}>/ig;
export const chanMention = /^<(#)\d{18}>/ig;
