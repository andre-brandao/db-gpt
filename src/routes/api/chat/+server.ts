import { streamText } from 'ai';
import { model } from '$lib/ai/models';
import { getTools, pgMcpClient } from '$lib/ai/tools.js';
import { DATABASE_URL } from '$env/static/private';

export async function POST({ request, locals: { session } }) {
  const { messages } = await request.json();
  // console.log('Received messages:', messages);
  const client = await pgMcpClient(DATABASE_URL);
  const mcpTools = await client.tools()
  console.log('MCP Tools:', mcpTools);
  const result = streamText({
    model,
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.`,
    //    system: `You are a helpful assistant.Check your knowledge base before answering any questions.
    //    Only respond to questions using information from tool calls.
    // Do not make up answers or provide information that is not in the knowledge base.
    // If the user asks a question about AWS, use the getInformation tool in English.
    // Always answer the question in the same language as the user.
    //    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages,
    onError: console.error,
    onFinish: async () => {
      await client.close();
    },
    tools: {
      ...getTools(session?.user.id),
      ...mcpTools,
    }
  });
  // console.log('Streaming response:', result.);
  return result.toDataStreamResponse();
}
