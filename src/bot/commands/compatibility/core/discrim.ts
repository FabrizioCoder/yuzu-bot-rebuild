import { createMessageCommand, MessageEmbed } from "oasis";
import { Category, randomHex } from "utils";

export default createMessageCommand({
  name: "discrim",
  meta: {
    descr: "Encuentra a usuarios con el mismo tag",
    short: "Encuentra a usuarios con el mismo tag",
    usage: "<Tag>",
  },
  category: Category.Util,
  execute({ bot, args: { args: [fst] } }) {
    if (fst.length !== 4) {
      return "El tag debe tener 4 dígitos";
    }

    const discriminator = parseInt(fst);

    const users = bot.users.map((u) => {
      if (u.discriminator === discriminator) return `${u.username}#${u.discriminator}`;
    });

    const embed = MessageEmbed
      .new()
      .color(randomHex())
      .description(users.join(", ") ?? "Sin resultados")
      .footer(`${users.length} usuario(s) con el tag ${discriminator}`)
      .end()

    return embed;
  },
});
