// utility to parse mentions

export const mention = /^<(@&|@|#|@!)\d{18}>/igm;
export const roleMention = /^<(@&)\d{18}>/igm;
export const userMention = /^<(@|@!)\d{18}>/igm;
export const chanMention = /^<(#)\d{18}>/igm;
