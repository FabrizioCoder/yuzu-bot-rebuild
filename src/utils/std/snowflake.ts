// important
export const DiscordEpoch = 1420070400000n;

export function snowflakeToTimestamp(id: bigint) {
  return (id >> 22n) + DiscordEpoch;
}

export function timestampToDate(timestamp: bigint) {
  return new Date(Number(timestamp));
}
