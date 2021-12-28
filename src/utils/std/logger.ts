// NOTE: prototypical version of Discordeno template
// https://github.com/discordeno/template/blob/main/minimal/src/utils/logger.ts

import { bold, cyan, gray, yellow, red, italic } from "fmt/colors";

export enum LogLevels {
  Debug,
  Info,
  Warn,
  Error,
  Fatal,
}

const colorFunctions: ReadonlyMap<LogLevels, (str: string) => string> = new Map([
  [LogLevels.Debug, gray],
  [LogLevels.Info, cyan],
  [LogLevels.Warn, yellow],
  [LogLevels.Error, (str: string) => red(str)],
  [LogLevels.Fatal, (str: string) => red(bold(italic(str)))],
]);

const prefixes: ReadonlyMap<LogLevels, string> = new Map([
  [LogLevels.Debug, "DEBUG"],
  [LogLevels.Info, "INFO"],
  [LogLevels.Warn, "WARN"],
  [LogLevels.Error, "ERROR"],
  [LogLevels.Fatal, "FATAL"],
]);

const noColor: (str: string) => string = (str) => str;

export const logger = {
  // etc
  group<T>(...args: T[]) {
    console.group(...args);
  },

  groupEnd() {
    console.groupEnd();
  },

  // defaults
  name: "",
  level: LogLevels.Info,

  // create a custom logger
  create(data: { name?: string, level?: LogLevels } = {}): typeof this & typeof data {
    return Object.assign(Object.create(this), data);
  },

  // methods
  color(str: string, level?: LogLevels) {
    return colorFunctions.get(level ?? this.level)?.(str);
  },

  debug<T>(...args: T[]) {
    this.log(LogLevels.Debug, ...args);
  },

  info<T>(...args: T[]) {
    this.log(LogLevels.Info, ...args);
  },

  warn<T>(...args: T[]) {
    this.log(LogLevels.Warn, ...args);
  },

  error<T>(...args: T[]) {
    this.log(LogLevels.Error, ...args);
  },

  fatal<T>(...args: T[]) {
    this.log(LogLevels.Fatal, ...args);
  },

  log<T>(level: LogLevels, ...args: T[]): void {
    if (level < this.level) {
      return;
    }

    const color = colorFunctions.get(level) ?? noColor;

    const date = new Date();

    const toLog = [
      `[${date.toLocaleDateString()} ${date.toLocaleTimeString()}]`,
      color(prefixes.get(level) ?? "DEBUG"),
      this.name ? `${this.name} >` : ">",
      ...args,
    ];

    switch (level) {
      case LogLevels.Debug:
        return console.debug(...toLog);

      case LogLevels.Info:
        return console.info(...toLog);

      case LogLevels.Warn:
        return console.warn(...toLog);

      case LogLevels.Error:
        return logger.error(...toLog);

      case LogLevels.Fatal:
        return logger.error(...toLog);

      default:
        return console.log(...toLog);
    }
  },
};
