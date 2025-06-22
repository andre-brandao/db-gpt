import { db } from '$lib/server/db';
import * as s from '$lib/server/db/schema';
import { desc, count, eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import type { PgSelect } from 'drizzle-orm/pg-core';
import { generateEmbeddings } from '$lib/ai/embedding';
import { fail } from '@sveltejs/kit';
type ResourceStatus = typeof s.resources.$inferSelect['status'] | null;

export const load = (async ({ url }) => {

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const status: ResourceStatus = (url.searchParams.get('status') as ResourceStatus) || null;


    let getResources = db
        .select()
        .from(s.resources)
        .orderBy(desc(s.resources.createdAt))
        .limit(limit)
        .offset(offset)
        .$dynamic()

    let getCountResources = db
        .select({
            total: count(s.resources.id)
        })
        .from(s.resources)
        .$dynamic();
    if (status && status?.length > 1) {
        getResources = getResources.where(eq(s.resources.status, status));
        getCountResources = getCountResources.where(eq(s.resources.status, status));
    }

    const [resources, totalCount] = await Promise.all([
        getResources,
        getCountResources.then((result) => result[0].total)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
        resources: resources,
        page,
        limit,
        totalCount: totalCount,
        totalPages
    };

}) satisfies PageServerLoad;


export const actions: Actions = {
    embedAllPending: async ({ request }) => {
        try {
            const resources = await db
                .select()
                .from(s.resources)
                .where(eq(s.resources.status, "pending_embedding"))
                // .limit(1)
            // .then((rows) => rows[0]);

            if (!resources) {
                return fail(404, {
                    success: false,
                    message: 'Resource not found.',
                });
            }
            console.log('Resources to embed:', resources.length);
            for (const res of resources) {

                try {

                    const embeddings = await generateEmbeddings(res.content);
                    console.log(`Generated ${embeddings.length} embeddings for resource ${res.id}`);
                    await db.delete(s.embeddings)
                        .where(eq(s.embeddings.resourceId, res.id));
                    const result = await db.insert(s.embeddings).values(
                        embeddings.map((e) => ({
                            resourceId: res.id,
                            ...e
                        }))
                    );

                    await db.update(s.resources)
                        .set({
                            status: "published"
                        })
                        .where(eq(s.resources.id, res.id));

                    console.log('Embeddings inserted:', result);
                } catch (error) {
                    console.error(`Error embedding resource ${res.id}:`, error);
                }
            }


            return {
                success: true,
                message: 'Resource successfully embedded.',
            }
        } catch (err) {
            console.error(err)
            return fail(500, {
                success: false,
                message: err instanceof Error ? err.message : 'An unexpected error occurred.'
            })
        }
    },

};