import { embedMany, embed } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { embeddingModel } from './models';

import { CharacterTextSplitter, RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

const textSplitter = new RecursiveCharacterTextSplitter({
	chunkSize: 1024,
	chunkOverlap: 0,

});

const generateChunksV2 = async (input: string) => await textSplitter.splitText(input);

const generateChunks = (input: string): string[] => {
	return input
		.trim()
		.split(/\n\s*\n/) // Split on blank (or whitespace-only) new lines
		.map(chunk => chunk.trim())
		.filter(chunk => chunk !== '');
};

export const generateEmbeddings = async (
	value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
	const chunks = await generateChunksV2(value);
	const { embeddings } = await embedMany({
		model: embeddingModel,
		values: chunks
	});
	return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
	const input = value.replaceAll('\\n', ' ');
	const { embedding } = await embed({
		model: embeddingModel,
		value: input
	});
	return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
	console.log("FINDING Relevant Content", userQuery)
	try {

		const userQueryEmbedded = await generateEmbedding(userQuery);
		const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, userQueryEmbedded)})`;
		const similarGuides = await db
			.select({ name: embeddings.content, similarity })
			.from(embeddings)
			// .where(gt(similarity, 0.5))
			.orderBy((t) => desc(t.similarity))
			.limit(4);
		console.log("FOUND Relevant Content", similarGuides)
		return similarGuides;
	} catch (err) {
		console.error(err)
		return "ERROR: finding content"
	}
};
