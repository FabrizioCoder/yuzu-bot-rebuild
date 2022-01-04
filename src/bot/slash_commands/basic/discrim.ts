import { type Context, Command, MessageEmbed } from "oasis";
import { Category, randomHex } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

@Command({
  name: "discrim",
  description: "Encuentra a usuarios con el mismo tag",
  meta: {
    descr: "Encuentra a usuarios con el mismo tag",
    short: "Encuentra a usuarios con el mismo tag",
    usage: "<Tag>",
  },
  category: Category.Util,
  options: [{
    type: ApplicationCommandOptionTypes.Integer,
    required: true,
    name: "discrim",
    description: "#️⃣ Tag",
  }],
})
export default abstract class {
  static execute({ bot, interaction }: Context) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.Integer) {
      return;
    }

    const users = bot.users.map((u) => {
      if (u.discriminator === <number> option.value) return `${u.username}#${u.discriminator}`;
    });

    const embed = MessageEmbed
      .new()
      .color(randomHex())
      .description(users.join(", ") ?? "Sin resultados")
      .footer(`${users.length} usuario(s) con el tag ${option.value}`)
      .end()

    return embed;
  }
}
