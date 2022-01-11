import type { Database } from "mongo";
import { MongoClient } from "mongo";

import "dotenv/load";

let db: Database | undefined;

async function startDatabase() {
  if (!db) {
    const client = new MongoClient();
    await client.connect(Deno.env.get("DB")!);

    db = client.database("azucluster");
  }
}

export { db, startDatabase };
