import type { Database } from "mongo";
import { MongoClient } from "mongo";

import "https://deno.land/x/dotenv@v3.1.0/load.ts";

let db: Database | undefined;

if (!db) {
  const client = new MongoClient();
  await start(client);
  db = getDatabase(client, "azucluster");
}

export function start(client: MongoClient) {
  // Connecting to a Mongo Atlas Database
  return client.connect(Deno.env.get("DB")!);
}

export function getDatabase(client: MongoClient, str: string) {
  return client.database(str);
}

export { db };
