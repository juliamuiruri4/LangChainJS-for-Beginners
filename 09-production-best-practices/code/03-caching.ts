/**
 * Response Caching
 * Run: npx tsx 09-production-best-practices/code/03-caching.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { InMemoryCache } from "@langchain/core/caches";
import "dotenv/config";

async function main() {
  console.log("💾 Response Caching Example\n");
  console.log("=".repeat(80));

  const cache = new InMemoryCache();

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    cache,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  const question = "What is LangChain.js?";

  // First call - hits API
  console.log(`\n1️⃣  First call: "${question}"\n`);
  console.log("📡 Status: Calling API...");

  console.time("First call");
  const response1 = await model.invoke(question);
  console.timeEnd("First call");

  console.log(`\n🤖 Response: ${String(response1.content).substring(0, 100)}...\n`);

  // Second call - uses cache
  console.log("─".repeat(80));
  console.log(`\n2️⃣  Second call (same question): "${question}"\n`);
  console.log("💾 Status: Using cache...");

  console.time("Second call (cached)");
  const response2 = await model.invoke(question);
  console.timeEnd("Second call (cached)");

  console.log(`\n🤖 Response: ${String(response2.content).substring(0, 100)}...\n`);

  // Third call - different question
  console.log("─".repeat(80));
  const newQuestion = "What is RAG?";
  console.log(`\n3️⃣  Third call (new question): "${newQuestion}"\n`);
  console.log("📡 Status: Calling API (cache miss)...");

  console.time("Third call");
  const response3 = await model.invoke(newQuestion);
  console.timeEnd("Third call");

  console.log(`\n🤖 Response: ${String(response3.content).substring(0, 100)}...\n`);

  // Fourth call - same as third
  console.log("─".repeat(80));
  console.log(`\n4️⃣  Fourth call (repeat of third): "${newQuestion}"\n`);
  console.log("💾 Status: Using cache...");

  console.time("Fourth call (cached)");
  const response4 = await model.invoke(newQuestion);
  console.timeEnd("Fourth call (cached)");

  console.log(`\n🤖 Response: ${String(response4.content).substring(0, 100)}...\n`);

  console.log("=".repeat(80));
  console.log("\n💡 Caching Benefits:");
  console.log("   - 10-100x faster for repeated queries");
  console.log("   - Reduces API costs significantly");
  console.log("   - Improves user experience");
  console.log("   - Great for FAQ/common questions");

  console.log("\n⚠️  Cache Considerations:");
  console.log("   - InMemoryCache clears on restart");
  console.log("   - Use Redis/database for persistence");
  console.log("   - Set cache expiration for dynamic content");
  console.log("   - Cache keys are based on exact input");
}

main().catch(console.error);
