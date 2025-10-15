/**
 * Message Types
 * Run: npx tsx 01-introduction/code/02-message-types.ts
 */

import { createChatModel } from "@/scripts/create-model.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import "dotenv/config";

async function main() {
  console.log("🎭 Understanding Message Types\n");

  const model = createChatModel();

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
