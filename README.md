# Yuzu Discord bot
1. Modern features. Made in Typescript and Discord.js
2. Strongly inspired by Discordeno's template
3. It has +20 functional commands and an easy-to-follow code
4. Is an OO program but it has a lot of functional programming code
5. Slash Command support and nice backward compatibility with the old command system
6. Ready-to-use Database

# Features
1. Monitors: run every time a message is received (useful for separating code from the message event)
2. Tasks: run in timed intervals once the client is ready
3. Events: run every time something happens on Discord

## Token:
* Go to Discord [developer portal](https://discord.com/developers/applications)
* Login
* Make a bot
* Copy your bot's token

## Using a .env file:
```bash
# .env
TOKEN=yourtoken
DB=mongodb://localhost:27017/test
```

## Using the /utils/Constants.ts file
```ts
enum Options
{
	GUILD_ID = '891367004903182336', // your test server
	OWNER_ID = '774292293020155906', // your id
	SESSION_ID = '893319907981283340', // the client id

	PREFIX = '!',
	TOKEN = 'you token goes here'
}
```

## Etc:

> Install packages
- `npm install`

> Terminal
- `node start.js`

> Linux
- Click <start.js>

## Contact me:
* Yuzuru#1401