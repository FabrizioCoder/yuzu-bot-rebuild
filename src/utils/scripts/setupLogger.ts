import { cyan, white } from "fmt/colors";
import * as log from "logger";

export function setupLogger() {
  return log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler("INFO", {
        formatter({ args, datetime, levelName, msg }) {
          if (args.length <= 0) {
            return white(`[${cyan(levelName)}] : ${datetime.toLocaleDateString()} : ${msg}`);
          }

          const target = args.reduce((acc: string, arg) => acc.replace("{}", arg as string), msg);
          const hasChanged = msg.length === target.length;

          return white(
            `[${cyan(levelName)}] : ${datetime.toLocaleDateString()} : ${hasChanged ? target + args.join(" ") : target}`
          );
        },
      }),
    },
    loggers: {
      default: {
        level: "INFO",
        handlers: ["console"],
      },
    },
  });
}
