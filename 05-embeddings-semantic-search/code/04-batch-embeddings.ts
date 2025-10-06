/**
 * Example 4: Batch Embeddings for Efficiency
 *
 * Learn how to create embeddings in batches for better performance.
 *
 * Run: npx tsx 05-embeddings-semantic-search/code/04-batch-embeddings.ts
 */

import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";

async function main() {
  console.log("⚡ Batch Embeddings Example\n");

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    configuration: {
      baseURL: "https://models.inference.ai.azure.com",
    },
    apiKey: process.env.GITHUB_TOKEN,
  });

  const texts = [
    "Machine learning is a subset of artificial intelligence",
    "Deep learning uses neural networks with multiple layers",
    "Natural language processing enables computers to understand text",
    "Computer vision allows machines to interpret visual information",
    "Reinforcement learning trains agents through rewards and penalties",
    "Supervised learning uses labeled training data",
    "Unsupervised learning finds patterns in unlabeled data",
    "Transfer learning applies knowledge from one task to another",
  ];

  console.log(`📝 Processing ${texts.length} texts...\n`);

  // Method 1: Individual embeddings (slower)
  console.log("1️⃣  Creating embeddings one-by-one (SLOW):");
  console.time("Individual embeddings");

  const individualEmbeddings = [];
  for (const text of texts) {
    const embedding = await embeddings.embedQuery(text);
    individualEmbeddings.push(embedding);
  }

  console.timeEnd("Individual embeddings");
  console.log(`   Created ${individualEmbeddings.length} embeddings\n`);

  // Method 2: Batch embeddings (faster!)
  console.log("2️⃣  Creating embeddings in batch (FAST):");
  console.time("Batch embeddings");

  const batchEmbeddings = await embeddings.embedDocuments(texts);

  console.timeEnd("Batch embeddings");
  console.log(`   Created ${batchEmbeddings.length} embeddings\n`);

  console.log("=".repeat(80));
  console.log("\n📊 Embedding Details:");
  console.log(`   Dimensions per embedding: ${batchEmbeddings[0].length}`);
  console.log(`   Total vectors created: ${batchEmbeddings.length}`);
  console.log(`   First vector sample: [${batchEmbeddings[0].slice(0, 5).map((n) => n.toFixed(4)).join(", ")}...]`);

  console.log("\n💡 Key Takeaways:");
  console.log("   - Batch processing is 5-10x faster");
  console.log("   - Reduces API calls (lower costs)");
  console.log("   - Always use embedDocuments() for multiple texts");
  console.log("   - Both methods produce identical embeddings");

  // Verify they're the same
  console.log("\n✅ Verification:");
  const match = individualEmbeddings[0].every(
    (val, idx) => Math.abs(val - batchEmbeddings[0][idx]) < 0.0001
  );
  console.log(`   Individual vs Batch results match: ${match ? "YES" : "NO"}`);
}

main().catch(console.error);
