# Yuzu's Discord bot Functional rewrite

![GitHub repo size](https://img.shields.io/github/repo-size/Le-Val/yuzu-bot-rebuild?color=lightblue&label=Files)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/Le-Val/yuzu-bot-rebuild/discordeno-refactor)
![GitHub](https://img.shields.io/github/license/Le-Val/yuzu-bot-rebuild)
[![GitHub issues](https://img.shields.io/github/issues/Le-Val/yuzu-bot-rebuild)](https://github.com/Le-Val/yuzu-bot-rebuild/issues)

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

- Download/Clone/Fork the repo from this branch
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
