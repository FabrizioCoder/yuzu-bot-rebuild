import { createMessageCommand } from "oasis";
import { Category } from "utils";

createMessageCommand({
  isAdminOnly: true,
  name: "ping",
  category: Category.Owner,
  execute({ message }) {
    return `Pong! ${message.tag}`;
  },
});
