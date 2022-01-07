import type { Context } from "oasis";
import { Command, Stop } from "oasis";
import { Category, Configuration } from "utils";

@Command({
  name: "ping",
  category: Category.Owner,
})
export default class {
  @Stop<false>((ctx) => ctx.message.authorId !== Configuration.OWNER_ID)
  static execute({ message }: Context<false>) {
    return `Pong! ${message.tag}`;
  }
}
