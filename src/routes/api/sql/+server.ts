import { getDB } from '$lib/samples';
import type { RequestHandler } from './$types';

import { error, json } from '@sveltejs/kit';
// import { PostgresConnection } from '$lib/db/pg';

export const POST: RequestHandler = async ({ request }) => {
  const { query, db_id } = await request.json();
  console.log("POST", query, db_id);
  if (typeof query !== 'string') {
    return error(500, 'Invalid query');
  }
  const db = getDB(db_id)


  if (!db) {
    return error(404, 'Database not found');
  }
  const result = await db.query(query);

  return json(result, {
    status: 200
  });
};
