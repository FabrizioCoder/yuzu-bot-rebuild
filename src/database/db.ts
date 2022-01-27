import type { Database } from "mongo";
import { MongoClient } from "mongo";
import { Configuration } from "utils";

let db: Database | undefined = undefined;

async function startDatabase() {
  const { uri } = Configuration.db;

  if (!db && uri) {
    const client = new MongoClient();
    await client.connect(uri);

    db = client.database("yuzucluster");
  }
}

export { db, startDatabase };
