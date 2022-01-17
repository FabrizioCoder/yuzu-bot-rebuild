// important
export const DiscordEpoch = 14200704e5;

export function snowflakeToTimestamp(id: bigint) {
  return Number(id >> 22n) + DiscordEpoch;
}

export function timestampToDate(timestamp: number) {
  return new Date(timestamp);
}

export function timestampToUnix(timestamp: number) {
  return timestamp / 1000;
}
