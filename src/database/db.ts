import type { Database } from "mongo";
import { MongoClient } from "mongo";

import "dotenv/load";

let db: Database | undefined;

if (!db) {
  const client = new MongoClient();
  await client.connect(Deno.env.get("DB")!);

  db = client.database("azucluster");
}

export { db };
