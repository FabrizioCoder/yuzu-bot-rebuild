import type { Database } from "mongo";
import { MongoClient } from "mongo";

import "dotenv/load";

let db: Database | undefined = undefined;

async function startDatabase() {
  const secret = Deno.env.get("DB");

  if (!db && secret) {
    const client = new MongoClient();
    await client.connect(secret);

    db = client.database("yuzucluster");
  }
}

export { db, startDatabase };
