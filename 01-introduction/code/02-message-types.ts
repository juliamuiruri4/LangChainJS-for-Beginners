/**
 * Example 2: Message Types
 *
 * Learn how to use structured messages for better control over AI behavior.
 * SystemMessage sets the AI's personality, HumanMessage is the user input.
 *
 * Run: npx tsx 01-introduction/code/02-message-types.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import "dotenv/config";

async function main() {
  console.log("🎭 Understanding Message Types\n");

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    configuration: {
      baseURL: "https://models.inference.ai.azure.com",
    },
    apiKey: process.env.GITHUB_TOKEN,
  });

  // Using structured messages for better control
  const messages = [
    new SystemMessage("You are a helpful AI assistant who explains things simply."),
    new HumanMessage("Explain quantum computing to a 10-year-old."),
  ];

  const response = await model.invoke(messages);

  console.log("🤖 AI Response:\n");
  console.log(response.content);
  console.log("\n✅ Notice how the SystemMessage influenced the response style!");
}

main().catch(console.error);
