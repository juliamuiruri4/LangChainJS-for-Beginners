/**
 * Chapter 5 Assignment Solution: Challenge 2
 * Semantic Book Search
 *
 * Run: npx tsx 04-documents-embeddings-semantic-search/solution/book-search.ts
 */

import { createEmbeddingsModel } from "@/scripts/create-model.js";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import "dotenv/config";

const books = [
  { title: "The AI Revolution", summary: "How artificial intelligence is transforming society and business" },
  { title: "JavaScript Mastery", summary: "Complete guide to modern web development with JavaScript" },
  { title: "Data Science Handbook", summary: "Statistical analysis and machine learning for beginners" },
  { title: "The Startup Playbook", summary: "Building and scaling technology companies from scratch" },
  { title: "Mystery at Midnight", summary: "A detective solves crimes in Victorian London" },
  { title: "Space Odyssey", summary: "Humans explore distant galaxies and alien civilizations" },
  { title: "Cooking Basics", summary: "Essential techniques for home chefs and food enthusiasts" },
  { title: "Python for Data", summary: "Using Python for data analysis and visualization" },
];

async function main() {
  console.log("📚 Semantic Book Search\n");
  console.log("=".repeat(80) + "\n");

  const embeddings = createEmbeddingsModel();

  console.log("📖 Loading books into vector store...\n");

  const documents = books.map(
    (book) =>
      new Document({
        pageContent: book.summary,
        metadata: { title: book.title },
      })
  );

  const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);

  console.log(`✅ Loaded ${books.length} books\n`);
  console.log("=".repeat(80) + "\n");

  const queries = [
    "books about programming",
    "stories set in space",
    "learning about AI and technology",
    "cooking and recipes",
  ];

  for (const query of queries) {
    console.log(`🔍 Query: "${query}"\n`);
    console.log("─".repeat(80));

    const results = await vectorStore.similaritySearchWithScore(query, 3);

    results.forEach(([doc, score], index) => {
      console.log(`\n${index + 1}. ${doc.metadata.title}`);
      console.log(`   Relevance: ${(score * 100).toFixed(1)}%`);
      console.log(`   Summary: ${doc.pageContent}`);
    });

    console.log("\n" + "─".repeat(80) + "\n");
  }

  console.log("=".repeat(80));
  console.log("\n✅ Book search complete!");
  console.log("\n💡 Notice how semantic search finds:");
  console.log("   - 'programming' matches JavaScript AND Python books");
  console.log("   - 'space' finds the Space Odyssey story");
  console.log("   - 'AI' finds both AI Revolution AND Data Science");
  console.log("   - Searches by meaning, not just exact keywords!");
}

main().catch(console.error);
