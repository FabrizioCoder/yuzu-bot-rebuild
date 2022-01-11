import { createCommand, MessageApplicationCommandBuilder } from "oasis";
import { Category } from "utils";
import { SafetyLevels, search } from "images";

createCommand({
  meta: {
    descr: "Click encima de un mensaje para buscar una imagen",
    short: "Click encima de un mensaje",
    usage: "<Input>",
  },
  category: Category.Util,
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
