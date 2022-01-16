import { Bson } from "mongo";

export function makeLong(long: bigint) {
  return new Bson.Long(Number(long & 0xffffffffn), Number((long >> 32n) & 0xffffffffn));
}
