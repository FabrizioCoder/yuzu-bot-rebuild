export abstract class Util {
  // important
  static DiscordEpoch = 14200704e5;

  static snowflakeToTimestamp(id: bigint) {
    return Number(id >> 22n) + Util.DiscordEpoch;
  }
}
