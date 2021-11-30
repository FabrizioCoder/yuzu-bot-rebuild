import type { MongoClient } from "../../deps.ts";

import "https://deno.land/x/dotenv/load.ts";

export function start(client: MongoClient) {
  // Connecting to a Mongo Atlas Database
  return client.connect(Deno.env.get("DB")!);
}

export function getDatabase(client: MongoClient, str: string) {
  return client.database(str);
}
