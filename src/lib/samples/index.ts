import { PostgresConnection } from "$lib/ai/db/pg";
import type { DBConnection } from "$lib/ai/db/types";
import sampleDBS from "./data.json"
export function getDB(db_id: keyof typeof sampleDBS | unknown): DBConnection | null {
  // @ts-expect-error - db_id is a key of sampleDBS, but TypeScript doesn't know that
  const dbINFO = sampleDBS[db_id]
  if (!dbINFO) {
    return null
  }
  switch (dbINFO.type) {
    case "pg": {
      console.log("Connecting to Postgres DB:", dbINFO.db_url);
      return new PostgresConnection(dbINFO.db_url)
      break;
    }
    default: {
      return null;
    }
  }

}
