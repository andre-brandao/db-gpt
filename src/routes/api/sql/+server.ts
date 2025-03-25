import type { RequestHandler } from './$types';

import { error, json } from '@sveltejs/kit';
// import { PostgresConnection } from '$lib/db/pg';

export const POST: RequestHandler = async ({ request, locals: { db } }) => {
	const { query } = await request.json();

	if (typeof query !== 'string') {
		return error(500, 'Invalid query');
	}

	const result = await db.query(query);

	return json(
		{
			data: result
		},
		{
			status: 200
		}
	);
};
