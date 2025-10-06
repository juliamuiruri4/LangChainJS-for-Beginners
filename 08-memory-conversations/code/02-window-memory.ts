/**
 * Example 2: Window Memory
 *
 * Learn how to keep only recent conversation history.
 *
 * Run: npx tsx 08-memory-conversations/code/02-window-memory.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferWindowMemory } from "langchain/memory";
import "dotenv/config";

async function main() {
  console.log("🪟 Window Memory Example\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Keep only last 2 exchanges (4 messages total: 2 human + 2 AI)
  const windowMemory = new BufferWindowMemory({ k: 4 });

  const chain = new ConversationChain({
    llm: model,
    memory: windowMemory,
  });

  console.log("🗣️  Having a longer conversation...\n");
  console.log("(Window size: 4 messages - last 2 exchanges)\n");
  console.log("=".repeat(80));

  // Exchange 1
  console.log("\n1️⃣  User: My favorite color is blue.");
  await chain.invoke({ input: "My favorite color is blue." });

  // Exchange 2
  console.log("2️⃣  User: I have a dog named Max.");
  await chain.invoke({ input: "I have a dog named Max." });

  // Exchange 3
  console.log("3️⃣  User: I work as a software engineer.");
  await chain.invoke({ input: "I work as a software engineer." });

  // Exchange 4
  console.log("4️⃣  User: I live in Seattle.");
  await chain.invoke({ input: "I live in Seattle." });

  // Now test memory - should only remember last 2 exchanges
  console.log("\n" + "=".repeat(80));
  console.log("\n🧪 Testing Memory:\n");

  console.log("❓ Question: What's my favorite color?");
  const response1 = await chain.invoke({
    input: "What's my favorite color?",
  });
  console.log(`🤖 ${response1.response}`);
  console.log("   (This was mentioned 4 exchanges ago - likely forgotten)\n");

  console.log("❓ Question: Where do I live?");
  const response2 = await chain.invoke({
    input: "Where do I live?",
  });
  console.log(`🤖 ${response2.response}`);
  console.log("   (This was recent - should remember)\n");

  console.log("❓ Question: What's my job?");
  const response3 = await chain.invoke({
    input: "What's my job?",
  });
  console.log(`🤖 ${response3.response}`);
  console.log("   (This was recent - should remember)\n");

  console.log("=".repeat(80));
  console.log("\n💡 Window Memory Characteristics:");
  console.log("   - Keeps only last K messages");
  console.log("   - Fixed memory size (good for token limits)");
  console.log("   - Forgets older context");
  console.log("   - Perfect for long conversations");
}

main().catch(console.error);
