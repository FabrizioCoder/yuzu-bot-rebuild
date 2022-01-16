import { createCommand, MessageApplicationCommandBuilder } from "oasis";
import { Category } from "utils";
import { SafetyLevels, search } from "images";

createCommand({
  meta: {
    descr: "commands:search:DESCRIPTION",
    usage: "commands:search:USAGE",
  },
  category: Category.Util,
  translated: true,
  async execute({ interaction }) {
    const message = interaction.data?.resolved?.messages?.first();

    if (!message) {
      return;
    }

    const [result, ..._results] = await search(message.content, SafetyLevels.STRICT);

    if (result) {
      return result.image;
    }
  },
  data: new MessageApplicationCommandBuilder().setName("search").toJSON(),
});
