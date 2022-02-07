import { createCommand } from "oasis/commando";
import { MessageApplicationCommandBuilder } from "oasis/builders";
import { Category } from "utils";
import { SafetyLevels, search } from "images";

const disabled = true as boolean;

createCommand({
  meta: {
    descr: "commands:search:DESCRIPTION",
    usage: "commands:search:USAGE",
  },
  category: Category.Util,
  translated: true,
  async execute({ interaction }) {
    if (disabled) {
      return "The owner has restricted this command to a whitelist! feel free to ask for access on the support server";
    }

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
