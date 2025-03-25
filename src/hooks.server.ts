import { SQLiteConnection } from '$lib/db/sqlite';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const testDb = new SQLiteConnection('test.sqlite');

    event.locals.db = testDb;

	const response = await resolve(event);
	return response;
};
