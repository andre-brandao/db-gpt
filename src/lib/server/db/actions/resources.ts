import { db } from '../.';
import { generateEmbeddings } from '$lib/ai/embedding';
import {
	embeddings as embeddingsTable,
	type NewResourceParams,
	insertResourceSchema,
	resources
} from '../schema';

export const createResource = async (input: NewResourceParams) => {
	console.log('TOOL: Creating resource with input:', input);
	try {
		const { content } = insertResourceSchema.parse(input);

		const [resource] = await db.insert(resources).values({
			content,
			createdBy: input.createdBy,
			metadata: input.metadata,
			status: input.status ?? 'draft',
			source: input.source ?? null,
		}).returning();

		const embeddings = await generateEmbeddings(content);

		console.log('Embeddings generated:', embeddings);
		const res = await db.insert(embeddingsTable).values(
			embeddings.map((e) => ({
				resourceId: resource.id,
				...e
			}))
		);

		console.log('Embeddings inserted:', res);

		return 'Resource successfully created and embedded.';
	} catch (e) {
		console.error('Error creating resource:', e);
		if (e instanceof Error) return e.message.length > 0 ? e.message : 'Error, please try again.';
		return 'An unexpected error occurred.';
	}
};
