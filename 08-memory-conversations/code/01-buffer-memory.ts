/**
 * Example 1: Buffer Memory
 *
 * Learn how to maintain conversation history with buffer memory.
 *
 * Run: npx tsx 08-memory-conversations/code/01-buffer-memory.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import "dotenv/config";

async function main() {
  console.log("💾 Buffer Memory Example\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Create buffer memory - stores ALL messages
  const memory = new BufferMemory();

  const chain = new ConversationChain({
    llm: model,
    memory,
  });

  console.log("🗣️  Starting conversation...\n");
  console.log("=".repeat(80));

  // Exchange 1
  console.log("\n👤 User: My name is Alex and I'm a TypeScript developer.");

  const response1 = await chain.invoke({
    input: "My name is Alex and I'm a TypeScript developer.",
  });

  console.log(`🤖 Bot: ${response1.response}\n`);

  // Exchange 2
  console.log("👤 User: What programming languages do I like?");

  const response2 = await chain.invoke({
    input: "What programming languages do I like?",
  });

  console.log(`🤖 Bot: ${response2.response}\n`);

  // Exchange 3
  console.log("👤 User: What's my name?");

  const response3 = await chain.invoke({
    input: "What's my name?",
  });

  console.log(`🤖 Bot: ${response3.response}\n`);

  console.log("=".repeat(80));

  // Inspect memory
  console.log("\n📋 Memory Contents:\n");

  const memoryVariables = await memory.loadMemoryVariables({});
  console.log(memoryVariables.history);

  console.log("\n💡 Buffer Memory Characteristics:");
  console.log("   - Stores ALL conversation messages");
  console.log("   - Perfect recall of entire history");
  console.log("   - Can become expensive with long conversations");
  console.log("   - May hit token limits");
}

main().catch(console.error);
