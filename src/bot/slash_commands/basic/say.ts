import { createCommand, ChatInputApplicationCommandBuilder} from "oasis";
import { Category, isInvite } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

export default createCommand({
  meta: {
    descr: "Hace que el bot diga algo muy malo",
    short: "Escribir el mensaje del bot",
    usage: "<Input>",
  },
  category: Category.Fun,
  execute({ interaction }) {
    const option = interaction.data?.options?.[0];

    // type guard
    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return;
    }

    if (typeof option.value !== "string") return;
    if (isInvite(option.value)) return "No puedo enviar invites";

    return option.value;
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("say")
    .setDescription("Hace que el bot diga algo muy malo")
    .addStringOption((o) => o.setName("input").setDescription("📝📝📝📝📝").setRequired(true))
    .toJSON(),
});
