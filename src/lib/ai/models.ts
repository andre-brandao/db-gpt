import {
  OPENAI_API_KEY,
  V0_API_KEY,
  // ANTHROPIC_API_KEY,
} from '$env/static/private';
import { createOpenAI } from '@ai-sdk/openai';
import { createVercel } from '@ai-sdk/vercel';

const vercel = createVercel({
  apiKey: V0_API_KEY || ""
});
// import { createAnthropic } from '@ai-sdk/anthropic';


// import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
// import { fromNodeProviderChain } from '@aws-sdk/credential-providers';

// const bedrock = createAmazonBedrock({
//   region: AWS_REGION,
//   accessKeyId: AWS_ACCESS_KEY_ID,
//   secretAccessKey: AWS_SECRET_ACCESS_KEY,
//   sessionToken: AWS_SESSION_TOKEN,
// });


// const anthropic = createAnthropic({
//   apiKey: ANTHROPIC_API_KEY
// });

export const openai = createOpenAI({
  apiKey: OPENAI_API_KEY
})

export const embeddingModel = openai.embedding('text-embedding-ada-002', {
  // dimensions: ,
})

export const model = openai("gpt-4")

export const frontEndModel = vercel("v0-1.0-md")
