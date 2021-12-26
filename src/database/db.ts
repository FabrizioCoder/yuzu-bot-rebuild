import type { Database } from "mongo";
import { MongoClient } from "mongo";

import "https://deno.land/x/dotenv@v3.1.0/load.ts";

let db: Database | undefined;

const client = new MongoClient();

if (!db) {
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
