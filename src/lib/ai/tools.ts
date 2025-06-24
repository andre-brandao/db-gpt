
import { tool, experimental_createMCPClient as createMCPClient, } from 'ai';
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
})
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
  "Add_Resource": tool({
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
  "Retrieve_Information": tool({
    description: `get information from your knowledge base to answer questions.`,
    parameters: z.object({
      question: z.string().describe('the users question')
    }),
    execute: async ({ question }) => await findRelevantContent(question)
  }),
  // "DuckDuckGo_Search": tool({
  //   description: `Search the web using DuckDuckGo. Use this tool to gather information that is not available in your knowledge base.`,
  //   parameters: z.object({
  //     query: z.string().describe('the search query')
  //   }),
  //   execute: async ({ query }) => {
  //     const res = await fetch(`https://api.duckduckgo.com/?q=${query}&format=json&pretty=1`);
  //     const data = await res.json();
  //     return JSON.stringify(data);
  //   }
  // }),
  "Retrieve_Svelte_and_SvelteKig_Abridged_Docs": tool({
    description: `A shorter version of the Svelte and SvelteKit documentation, with examples and non-essential content removed`,
    parameters: z.object({}).describe('no parameters required'),
    execute: async () => {
      return (await fetch("https://svelte.dev/llms-medium.txt")).text()
    }
  }),

  // "Retrieve_Svelte_and_SvelteKit_Compressed_Docs": tool({
  //   description: `A minimal version of the Svelte and SvelteKit documentation, with many examples and non-essential content removed`,
  //   parameters: z.object({}).describe('no parameters required'),
  //   execute: async () => {
  //     return (await fetch("https://svelte.dev/llms-small.txt")).text()
  //   }
  // }),
  // "Retrieve_Svelte_and_SvelteKit_Complete_Docs": tool({
  //   description: `The complete Svelte and SvelteKit documentation including all examples and additional content`,
  //   parameters: z.object({}).describe('no parameters required'),
  //   execute: async () => {
  //     return (await fetch("https://svelte.dev/llms-full.txt")).text()
  //   }
  // }),
  // "Retrieve_Svelte_Documentation": tool({
  //   description: `The developer documentation for Svelte.`,
  //   parameters: z.object({}).describe('no parameters required'),
  //   execute: async () => {
  //     return (await fetch("https://svelte.dev/docs/svelte/llms.txt")).text()
  //   }
  // }),

  // "Retrieve_SvelteKit_Documentation": tool({
  //   description: `The developer documentation for SvelteKit.`,
  //   parameters: z.object({}).describe('no parameters required'),
  //   execute: async () => {
  //     return (await fetch("https://svelte.dev/docs/kit/llms.txt")).text()
  //   }
  // }),

})

/**
# Svelte Documentation for LLMs

> Svelte is a UI framework that uses a compiler to let you write breathtakingly concise components that do minimal work in the browser, using languages you already know — HTML, CSS and JavaScript.

## Documentation Sets

- [Abridged documentation](https://svelte.dev/llms-medium.txt): A shorter version of the Svelte and SvelteKit documentation, with examples and non-essential content removed
- [Compressed documentation](https://svelte.dev/llms-small.txt): A minimal version of the Svelte and SvelteKit documentation, with many examples and non-essential content removed
- [Complete documentation](https://svelte.dev/llms-full.txt): The complete Svelte and SvelteKit documentation including all examples and additional content

## Individual Package Documentation

- [Svelte documentation](https://svelte.dev/docs/svelte/llms.txt): This is the developer documentation for Svelte.
- [SvelteKit documentation](https://svelte.dev/docs/kit/llms.txt): This is the developer documentation for SvelteKit.
- [the Svelte CLI documentation](https://svelte.dev/docs/cli/llms.txt): This is the developer documentation for the Svelte CLI.

## Notes

- The abridged and compressed documentation excludes legacy compatibility notes, detailed examples, and supplementary information
- The complete documentation includes all content from the official documentation
- Package-specific documentation files contain only the content relevant to that package
- The content is automatically generated from the same source as the official documentation

*/
