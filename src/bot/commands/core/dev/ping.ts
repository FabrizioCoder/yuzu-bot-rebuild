import { type Context, Command, Stop } from "oasis";
import { Category, Configuration } from "utils";

@Command({
  name: "ping",
  category: Category.Owner,
})
export default abstract class {
  @Stop<false>((ctx) => ctx.message.authorId !== Configuration.OWNER_ID)
  static execute({ message }: Context<false>) {
    return `Pong! ${message.tag}`;
  }
}
