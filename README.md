# Yuzu's Discord bot v2

![GitHub repo size](https://img.shields.io/github/repo-size/yuzudev/yuzu-bot-rebuild?color=lightblue&label=Files)
![GitHub last commit](https://img.shields.io/github/last-commit/yuzudev/yuzu-bot-rebuild)
![GitHub](https://img.shields.io/github/license/yuzudev/yuzu-bot-rebuild)
[![GitHub issues](https://img.shields.io/github/issues/yuzudev/yuzu-bot-rebuild?color=lightblue&label=Issues)](https://github.com/yuzudev/yuzu-bot-rebuild/issues)

- my discord: `Yuzu#0956`
- [support the proyect by inviting the bot](https://top.gg/bot/893319907981283340)

### Features

- Functional - Lightweight - No event emitters
- Languages
- Image manipulation commands
- Easy-to-use command system
- handlers for Events, Commands, Monitors & Tasks
- Database (for starboard, tags, prefixes and languages)
- +50 commands

### Example

```ts
// on root directory:
// deno run -A --no-check ./import_map.json src/bot/mod.ts
import { createCommand } from "oasis";
import { Category } from "utils";

createCommand({
  data: {
    name: "ping",
    description: "Replies pong! 🏓",
  },
  category: Category.Owner,
  execute({ interaction }) {
    return `Pong! ${interaction.user.username}`;
  },
});
```

- Permissions required: `--allow-net --allow-read --allow-env`
- Recommended flags: `--no-check --import-map`

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
2. write code (see example above)
3. do something in the execute() function

- the return type is `string | Embed` the reply will be **deferred by default**
- the callback will be exactly the same as the interactionCreate event

### Heroku

1. Add [this](https://github.com/chibat/heroku-buildpack-deno.git) buildpack to your app
2. Make a mongodb atlas account
3. Copy the `.env` example
4. Add both your Discord token and the mongo atlas URI to the Heroku env variables
5. Deploy directly from Github
6. Enjoy

### FAQ

#### Q: What extensions do I need?

1. Some Deno extension (atom ide deno etc)
2. Prettier extension

#### Q: How do I write imports in a proper way?

1. Import types before functions/variables
2. no newlines in imports ^
