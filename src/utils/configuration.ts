import * as TOML from "https://deno.land/std@0.122.0/encoding/toml.ts";

const decoder = new TextDecoder("utf8");
const file = await Deno.readFile("src/config.toml");

const decoded = TOML.parse(decoder.decode(file));

export default {
  botId: BigInt(decoded.botId as number),
  channelId: BigInt(decoded.channelId as number),
  ownerId: BigInt(decoded.ownerId as number),
  prefix: decoded.prefix as string,
  token: decoded.token as string,
  version: decoded.version as string,
};
