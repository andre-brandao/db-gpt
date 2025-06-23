import { streamText } from 'ai';
import { model } from '$lib/ai/models';
import { getTools, pgMcpClient } from '$lib/ai/tools.js';
// import { DATABASE_URL } from '$env/static/private';

export async function POST({ request, locals: { session } }) {
  const { messages } = await request.json();
  // console.log('Received messages:', messages);
  const client = await pgMcpClient("postgresql://postgres:tTAhQBMETvSFKQWAsXfMAxPsTEdqNtFu@metro.proxy.rlwy.net:34803/netflix");
  const mcpTools = await client.tools()
  const result = streamText({
    model,
    // Check your knowledge base before answering any questions.
    system: `You are a helpful assistant.
    Only respond to questions using information from tool calls.
    Do not make up answers or provide information that is not in the knowledge base.
    Always show the SQL query and ask for confirmation before executing.
    Always answer the question in the same language as the user.
       if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages,
    onError: console.error,
    onFinish: async (e) => {
      // console.log('Finished streaming response:', e.toolResults);
      await client.close();
    },
    onChunk: (chunk) => {
      // console.log('Streaming chunk:', chunk.text);
      // You can handle each chunk here, e.g., send it to the client
      console.log("CUNK:", chunk.chunk)
    },
    onStepFinish: (step) => {
      console.log('Step finished:', step.text);
      console.log('Step tool results:', JSON.stringify(step.toolResults[0].result));
    },
    tools: {
      ...getTools(session?.user.id),
      ...mcpTools,
    }
  });
  // console.log('Streaming response:', result.);
  return result.toDataStreamResponse();
}
