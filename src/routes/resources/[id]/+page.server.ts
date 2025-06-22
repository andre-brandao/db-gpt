import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as s from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';

import { generateEmbeddings } from '$lib/ai/embedding';

export const load = (async ({ params: { id } }) => {

    const getResource = db
        .select()
        .from(s.resources)
        .where(eq(s.resources.id, id))
        .limit(1)
        .then((rows) => rows[0])

    const getEmbeddings = db
        .select()
        .from(s.embeddings)
        .where(eq(s.embeddings.resourceId, id))


    const [resource, embeddings] = await Promise.all([
        getResource,
        getEmbeddings
    ])

    if (!resource) {
        return error(404, 'Resource not found');
    }

    return {
        resource,
        embeddings
    };

}) satisfies PageServerLoad;



export const actions: Actions = {
    embed: async ({ request, params: { id } }) => {
        try {
            const resource = await db
                .select()
                .from(s.resources)
                .where(eq(s.resources.id, id))
                .limit(1)
                .then((rows) => rows[0]);

            if (!resource) {
                return fail(404, {
                    success: false,
                    message: 'Resource not found.',
                });
            }

            const embeddings = await generateEmbeddings(resource.content);

            if (embeddings.length === 0) {
                return fail(500, {
                    success: false,
                    message: 'Error generating embeddings. Please try again.',
                });
            }
            await db.delete(s.embeddings)
                .where(eq(s.embeddings.resourceId, resource.id));
            const res = await db.insert(s.embeddings).values(
                embeddings.map((e) => ({
                    resourceId: resource.id,
                    ...e
                }))
            );

            console.log('Embeddings inserted:', res);
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
    update: async ({ request, params: { id } }) => {
        const formData = await request.formData();
        const status = formData.get('status') as string;

        if (!status) {
            return fail(400, {
                success: false,
                message: 'Status is required.'
            });
        }

        if (!s.resourceStatus.enumValues.some((s) => s === status)) {
            return fail(400, {
                success: false,
                message: 'Invalid status value.'
            });
        }
        try {
            const resource = await db
                .select()
                .from(s.resources)
                .where(eq(s.resources.id, id))
                .limit(1)
                .then((rows) => rows[0]);

            if (!resource) {
                return fail(404, {
                    success: false,
                    message: 'Resource not found.'
                });
            }



            const updatedResource = await db.update(s.resources)
                .set({
                    status: status as typeof s.resourceStatus.enumValues[number],
                    updatedAt: new Date()
                })
                .where(eq(s.resources.id, id))
                .returning();

            if (updatedResource.length === 0) {
                return fail(500, {
                    success: false,
                    message: 'Failed to update resource.'
                });
            }

            return {
                success: true,
                message: 'Resource updated successfully.',
                resource: updatedResource[0]
            };

        } catch (err) {
            console.error(err);
            return fail(500, {
                success: false,
                message: 'An error occurred while updating the resource.'
            });
        }
    }
};