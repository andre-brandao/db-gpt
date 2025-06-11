import type { RequestHandler } from './$types';
import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { ANTHROPIC_KEY } from '$env/static/private';


const model = createAnthropic({
    apiKey: ANTHROPIC_KEY
});

export const POST: RequestHandler = async ({ request, locals: { db } }) => {
    const dbDefinition = await db.getSchema();

    const dbDefinitionText = dbDefinition.tables.map((table) => table.create_statement).join('\n\n');

    console.log(dbDefinitionText);
    console.log("CHAT")

    const { messages } = await request.json();

    const result = streamText({
        model: model('claude-3-5-sonnet-20241022'),
        system:
            'You are Database GPT, a language model trained on database interactions. You are here to help with any database-related questions or problems.' +
            'SQL code blocks should only contain SQL code, no comments or explanations.' +
            'Explain the SQL code outside the code block.' +
            'Database type: SQLLite.\n' +
            'Be conscise and clear in your responses.' +
            'Database schema: \n' +
            dbDefinitionText,
        messages
    });

    return result.toDataStreamResponse();
};
