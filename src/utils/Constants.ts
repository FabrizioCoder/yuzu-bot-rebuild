export enum Milliseconds {
	WEEK = 1000 * 60 * 60 * 24 * 7,
	DAY = 1000 * 60 * 60 * 24,
	HOUR = 1000 * 60 * 60,
	MINUTE = 1000 * 60,
	SECOND = 1000
}

export enum Options {
	// ids
	CHANNEL_ID = '895959965469134858',
	GUILD_ID = '891367004903182336',
	OWNER_ID = '774292293020155906',
	SESSION_ID = '893319907981283340',
	// ETC
	PREFIX = '!',
	TOKEN = 'empty'
}

export const enum BotSupporters {
	// empty :(
}

export const enum BotDevelopers {
	ME = '774292293020155906'
}

export enum Division {
	CONFIGURATION,
	FUN,
	INFO,
	INTERACTION,
	MODERATION,
	UTIL,
	OWNER
}

// ex: Emoji[:github:]
export enum Emoji {
	':category_fun:' = '<:category_fun:900659146586738729>',
	':category_info:' = '<:category_info:900655062089596938>',
	':category_util:' = '<:category_util:900654248667267124>',
	':category_admin:' = '<:category_admin:900649020668645386>',
	':category_config:' = '<:category_config:900660131275100182>',
	':category_interaction:' = '<:category_interaction:900655587384246272>',

	':yes:' = '<:yes:900646190876602390>',
	':no:' = '<:no:900646321399156766>',
	':translator:' = '<:translator:900659602922827786>',
	':plus:' = '<:plus:900658944123486228>',
	':github:' = '<:github:900653682981494784>',

	':blurple_arrow_left:' = '<:blurple_arrow_left:902579559310979083>',
	':blurple_arrow_right:' = '<:blurple_arrow_right:902579658917281803>',
	':blurple_hashtag:' = '<:blurple_hashtag:902580515922657332>',
	':blurple_x:' = '<:blurple_x:902581558374961152>'
}

// coming soon ig
export enum SupportedLanguages {
	'en-US',
	'es-MX'
}

// maybe useful maybe not
export const intents = [0, 2, 3, 9, 10, 12, 13].map(n => 1 << n).reduce((x, y) => x + y);