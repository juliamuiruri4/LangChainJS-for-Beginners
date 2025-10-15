/**
 * Similarity Search with Scores
 * Run: npx tsx 05-embeddings-semantic-search/code/03-similarity-scores.ts
 */

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createEmbeddingsModel } from "@/scripts/create-model.js";
import { Document } from "langchain/document";
import "dotenv/config";

async function main() {
  console.log("📊 Similarity Search with Scores\n");

  const embeddings = createEmbeddingsModel();

  // Create a diverse set of documents
  const docs = [
    new Document({
      pageContent: "Python is excellent for data science and machine learning applications.",
      metadata: { category: "programming", language: "python" },
    }),
    new Document({
      pageContent: "JavaScript powers interactive web applications and modern frontends.",
      metadata: { category: "programming", language: "javascript" },
    }),
    new Document({
      pageContent: "Machine learning algorithms identify patterns in large datasets.",
      metadata: { category: "AI", topic: "ml" },
    }),
    new Document({
      pageContent: "Cats are independent pets that enjoy lounging in sunny spots.",
      metadata: { category: "animals", type: "pets" },
    }),
    new Document({
      pageContent: "Dogs are loyal companions that love outdoor activities and play.",
      metadata: { category: "animals", type: "pets" },
    }),
    new Document({
      pageContent: "TypeScript adds static typing to JavaScript for safer code.",
      metadata: { category: "programming", language: "typescript" },
    }),
  ];

  console.log(`📚 Creating vector store with ${docs.length} documents...\n`);

  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

  console.log("✅ Vector store created!\n");
  console.log("=".repeat(80));

  // Search with scores
  const queries = [
    "programming languages for web development",
    "pets that are good for apartments",
    "understanding data with AI",
  ];

  for (const query of queries) {
    console.log(`\n🔍 Query: "${query}"\n`);

    const resultsWithScores = await vectorStore.similaritySearchWithScore(query, 3);

    resultsWithScores.forEach(([doc, score], index) => {
      console.log(`${index + 1}. Score: ${score.toFixed(4)}`);
      console.log(`   Text: ${doc.pageContent}`);
      console.log(`   Category: ${doc.metadata.category}`);

      // Interpret score
      let interpretation = "";
      if (score > 0.85) interpretation = "🎯 Excellent match";
      else if (score > 0.75) interpretation = "✅ Good match";
      else if (score > 0.65) interpretation = "⚠️  Moderate match";
      else interpretation = "❌ Weak match";

      console.log(`   ${interpretation}\n`);
    });

    console.log("─".repeat(80));
  }

  console.log("\n💡 Understanding Similarity Scores:");
  console.log("   - Closer to 1.0 = More similar");
  console.log("   - Closer to 0.0 = Less similar");
  console.log("   - Typically use threshold (e.g., > 0.7) to filter results");
}

main().catch(console.error);
