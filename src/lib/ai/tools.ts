
import { tool, experimental_createMCPClient as createMCPClient } from 'ai';
import { createResource } from '$lib/server/db/actions/resources';
import { findRelevantContent } from '$lib/ai/embedding';
import { z } from 'zod';
import { Experimental_StdioMCPTransport as StdioMCPTransport } from 'ai/mcp-stdio';

export const pgMcpClient = (dbURL: string) => createMCPClient({
  transport: new StdioMCPTransport({
    command: 'node',
    args: ['mcp/postgres-context-server/index.mjs'],
    env: {
      DATABASE_URL: dbURL,
    }
  }),
});
// const mcpClient = await createMCPClient({
//   transport: {
//     type: 'sse',
//     url: 'https://my-server.com/sse',

//     // optional: configure HTTP headers, e.g. for authentication
//     headers: {
//       Authorization: 'Bearer my-api-key',
//     },
//   },
// });

export const getTools = (userId?: string) => ({
  addResource: tool({
    description: `add a resource to your knowledge base.
      If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
    parameters: z.object({
      content: z.string().describe('the content or resource to add to the knowledge base')
    }),
    execute: async ({ content }) => await createResource({
      content,
      createdBy: userId ?? null,
      metadata: {
        source: 'user'
      },
      status: "draft",
      source: "user_conversation"
    })
  }),
  getInformation: tool({
    description: `get information from your knowledge base to answer questions.`,
    parameters: z.object({
      question: z.string().describe('the users question')
    }),
    execute: async ({ question }) => await findRelevantContent(question)
  })
})
