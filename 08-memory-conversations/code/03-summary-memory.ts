/**
 * Example 3: Summary Memory
 *
 * Learn how to summarize conversation history to save tokens.
 *
 * Run: npx tsx 08-memory-conversations/code/03-summary-memory.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { ConversationSummaryMemory } from "langchain/memory";
import "dotenv/config";

async function main() {
  console.log("📝 Summary Memory Example\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Summary memory summarizes conversation periodically
  const summaryMemory = new ConversationSummaryMemory({
    llm: model,
    maxTokenLimit: 100, // Summarize when exceeding this limit
  });

  const chain = new ConversationChain({
    llm: model,
    memory: summaryMemory,
  });

  console.log("🗣️  Having a detailed conversation...\n");
  console.log("=".repeat(80));

  // Have a conversation with lots of details
  const exchanges = [
    "I'm planning a trip to Japan next month for two weeks.",
    "I want to visit Tokyo, Kyoto, and Osaka during my trip.",
    "I'm particularly interested in visiting traditional temples and trying authentic Japanese cuisine.",
    "I'm also excited about experiencing both modern technology districts and historical sites.",
    "My budget is around $3000 for the entire trip, including flights and accommodation.",
  ];

  for (let i = 0; i < exchanges.length; i++) {
    console.log(`\n${i + 1}️⃣  User: ${exchanges[i]}`);

    const response = await chain.invoke({
      input: exchanges[i],
    });

    console.log(`   🤖 Bot: ${response.response}\n`);
  }

  console.log("=".repeat(80));

  // Check the summary
  console.log("\n📋 Memory Summary:\n");

  const summary = await summaryMemory.loadMemoryVariables({});
  console.log(summary.history);

  // Test if summary retains key information
  console.log("\n" + "=".repeat(80));
  console.log("\n🧪 Testing Summary Memory:\n");

  console.log("❓ Where am I traveling to?");
  const response = await chain.invoke({
    input: "Based on our conversation, where am I traveling to and what am I interested in?",
  });
  console.log(`🤖 ${response.content}\n`);

  console.log("=".repeat(80));
  console.log("\n💡 Summary Memory Characteristics:");
  console.log("   - Summarizes old conversations");
  console.log("   - Keeps recent messages verbatim");
  console.log("   - Balances context retention and token usage");
  console.log("   - Great for very long conversations");
  console.log("   - May lose some details in summarization");
}

main().catch(console.error);
