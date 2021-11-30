import type { Database } from "../../deps.ts";
import { MongoClient } from "../../deps.ts";
import { getDatabase, start } from "./start_database.ts";

let db: Database | undefined;

const client = new MongoClient();

if (!db) {
  await start(client);
  db = getDatabase(client, "azucluster");
}

export { db };
