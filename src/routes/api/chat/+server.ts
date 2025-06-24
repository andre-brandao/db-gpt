import { streamText } from 'ai';
import { model } from '$lib/ai/models';
import { getTools } from '$lib/ai/tools.js';

import { getDB } from '$lib/samples';



// import { DATABASE_URL } from '$env/static/private';
export async function POST({ request, locals: { session } }) {
  const { messages, db_id } = await request.json();
  console.log("POST", messages, db_id);
  const dbConn = getDB(db_id);
  const mcpTools = dbConn ? await dbConn.getMcpTools() : {};

  const result = streamText({
    model,
    // Check your knowledge base before answering any questions.
    system: `You are a helpful assistant.
    Only respond to questions using information from tool calls.
    Do not make up answers or provide information that is not in the knowledge base.
    Dont ask for confirmation before executing the other tools.
    Svelte has separe tools, so you can use them to answer questions about Svelte and SvelteKit instead of the knowledge base.
    Always format the answer in markdown.
    Always answer the question in the same language as the user.
       if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages,
    onError: console.error,
    onFinish: async (e) => {
      // console.log('Finished streaming response:', e.toolResults);
      // await client.close();
    },
    onChunk: (chunk) => {
      // console.log('Streaming chunk:', chunk.text);
      // You can handle each chunk here, e.g., send it to the client
      console.log("CUNK:", chunk.chunk)
    },
    onStepFinish: (step) => {
      console.log('Step finished:', step.text);
      // console.log('Step tool results:', JSON.stringify(step.toolResults[0].result));
    },
    maxSteps: 10,
    maxRetries: 1,
    tools: {
      ...getTools(session?.user.id),
      ...mcpTools,
    }
  });
  // console.log('Streaming response:', result.);
  return result.toDataStreamResponse({
    getErrorMessage(err) {
      if (err == null) {
        return "Erro Desconhecido"
      }
      if (typeof err === "string") {
        return err
      }

      if (err instanceof Error) {
        return err.message
      }

      return "Erro Desconhecido"
    },
  });
}
