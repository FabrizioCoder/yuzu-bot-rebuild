# Yuzu's Discord bot Functional rewrite

![GitHub repo size](https://img.shields.io/github/repo-size/Le-Val/yuzu-bot-rebuild?color=lightblue&label=Files)
![GitHub last commit](https://img.shields.io/github/last-commit/Le-Val/yuzu-bot-rebuild)
![GitHub](https://img.shields.io/github/license/Le-Val/yuzu-bot-rebuild)
[![GitHub issues](https://img.shields.io/github/issues/Le-Val/yuzu-bot-rebuild?color=lightblue&label=Issues)](https://github.com/Le-Val/yuzu-bot-rebuild/issues)
- my discord: `Yuzuru#1401`
- [support the proyect](https://top.gg/bot/893319907981283340)

### Features

- Functional - Lightweight
- No event emitters
- Easy-to-use command system
- Events, Commands, Monitors & Tasks
- Collectors for buttons or messages
- Support for slash commands

### How to start?

- Fork the repo from this branch
- Clone my code
- Install the [Deno](https://deno.land/) runtime
- Go to the [developer](https://discord.com/developers/applications) portal
- Make an application and get your token
- Execute the bot using `deno run`

### Set up the .env file

- Create a file in the root directory named `.env`
- Copy and paste your Discord token

```bash
TOKEN=YOURTOKEN
```

### How to write a command

1. create a file in the /slash_commands/ folder
2. put the following code:

```ts
// slash_commands/ping.ts
import type { Command } from "../types/command.ts";

// slash command:
export default <Command> {
  data: {
    name: "ping",
    description: "🏓🏓🏓",
  },
  execute: (bot, interaction) => "pong!",
};
```

```ts
// commands/ping.ts
import type { Command } from "../types/command.ts";

// non-slash command:
export default <Command<false>> {
  data: {
    name: "ping",
  },
  execute: (bot, message) => "pong!",
};
```

3. do something in the execute() function

- the return type is `string | Embed` the reply will be deferred by default
- the callback will be exactly the same as the interactionCreate event

### Heroku
1. Add [this](https://github.com/chibat/heroku-buildpack-deno.git) buildpack to your app
2. Make a mongodb atlas account
3. Copy the `.env` example
4. Add both your Discord token and the mongo atlas URI to the Heroku env variables
5. Deploy directly from Github
6. Enjoy

### FAQ

#### Q: How do I run the bot?
- A: Write on the command line (on the root directory) this line:
`deno run --allow-net --allow-read --allow-env --no-check --import-map ./import_map.json src/bot/mod.ts`

#### Q: is Deno better than node?
- A: I don't now

#### Q: What extensions do I need?
1. Some Deno extension (atom ide deno etc)
2. Prettier extension

#### Q: How do I write imports in a proper way?
1. Import types before functions/variables
2. no spacing beetween inline imports ^
