import type { Database } from "https://deno.land/x/mongo/mod.ts";
import { MongoClient } from "https://deno.land/x/mongo/mod.ts";
import { getDatabase, start } from "./start_database.ts";

import "https://deno.land/x/dotenv/load.ts";

let db: Database | undefined;

const client = new MongoClient();

if (!db) {
  await start(client);
  db = getDatabase(client, "azucluster");
}

export { db };
