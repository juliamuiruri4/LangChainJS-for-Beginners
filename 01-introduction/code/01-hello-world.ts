/**
 * Example 1: Hello World
 *
 * This is the simplest possible LangChain.js application.
 * We'll make a single call to an LLM using GitHub Models.
 *
 * Run: npx tsx 01-introduction/code/01-hello-world.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function main() {
  console.log("🚀 Hello LangChain.js!\n");

  // Create a model instance using GitHub Models
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    configuration: {
      baseURL: "https://models.inference.ai.azure.com",
    },
    apiKey: process.env.GITHUB_TOKEN,
  });

  // Make your first AI call!
  const response = await model.invoke("What is LangChain in one sentence?");

  console.log("🤖 AI Response:", response.content);
  console.log("\n✅ Success! You just made your first LangChain.js call!");
}

main().catch(console.error);
