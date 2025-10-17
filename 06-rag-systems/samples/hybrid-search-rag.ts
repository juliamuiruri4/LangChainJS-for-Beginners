/**
 * Chapter 6 Assignment Solution: Bonus Challenge
 * Hybrid Search RAG
 *
 * Run: npx tsx 06-rag-systems/solution/hybrid-search-rag.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import "dotenv/config";

// Knowledge base about programming languages
const knowledgeBase = [
  new Document({
    pageContent:
      "Python is a high-level, interpreted programming language known for its simplicity and readability. It supports multiple programming paradigms including procedural, object-oriented, and functional programming.",
    metadata: { id: "doc1", title: "Python Overview" }
  }),
  new Document({
    pageContent:
      "JavaScript is a versatile programming language primarily used for web development. It runs in browsers and on servers via Node.js. JavaScript is dynamically typed and supports event-driven programming.",
    metadata: { id: "doc2", title: "JavaScript Basics" }
  }),
  new Document({
    pageContent:
      "Rust is a systems programming language focused on safety, speed, and concurrency. It prevents memory errors without using a garbage collector, making it ideal for performance-critical applications.",
    metadata: { id: "doc3", title: "Rust Language" }
  }),
  new Document({
    pageContent:
      "Go (Golang) is a statically typed language designed for simplicity and efficiency. It features built-in concurrency support through goroutines and channels, making it excellent for network services.",
    metadata: { id: "doc4", title: "Go Programming" }
  }),
  new Document({
    pageContent:
      "TypeScript extends JavaScript by adding static type definitions. Types provide a way to describe the shape of objects, enabling better tooling and catching errors at compile time instead of runtime.",
    metadata: { id: "doc5", title: "TypeScript Features" }
  })
];

// Simple BM25-like keyword scoring
function keywordSearch(
  query: string,
  documents: Document[],
  k: number = 3
): Array<{ doc: Document; score: number }> {
  const queryTerms = query.toLowerCase().split(/\s+/);

  const scores = documents.map((doc) => {
    const content = doc.pageContent.toLowerCase();
    let score = 0;

    for (const term of queryTerms) {
      // Count occurrences of each term
      const regex = new RegExp(term, "gi");
      const matches = content.match(regex);
      if (matches) {
        // TF (term frequency) component
        score += matches.length;

        // Bonus for exact phrase matches
        if (content.includes(query.toLowerCase())) {
          score += 5;
        }
      }
    }

    return { doc, score };
  });

  // Sort by score descending and return top k
  return scores.sort((a, b) => b.score - a.score).slice(0, k);
}

// Reciprocal Rank Fusion
function fuseResults(
  keywordResults: Array<{ doc: Document; score: number }>,
  semanticResults: Array<[Document, number]>,
  k: number = 60
): Array<{
  doc: Document;
  fusedScore: number;
  keywordScore: number;
  semanticScore: number;
}> {
  const scoreMap = new Map<string, { keywordRank: number; semanticRank: number; doc: Document }>();

  // Process keyword results
  keywordResults.forEach((result, index) => {
    const id = result.doc.metadata.id;
    scoreMap.set(id, {
      keywordRank: index + 1,
      semanticRank: 0,
      doc: result.doc
    });
  });

  // Process semantic results
  semanticResults.forEach((result, index) => {
    const id = result[0].metadata.id;
    const existing = scoreMap.get(id);

    if (existing) {
      existing.semanticRank = index + 1;
    } else {
      scoreMap.set(id, {
        keywordRank: 0,
        semanticRank: index + 1,
        doc: result[0]
      });
    }
  });

  // Calculate RRF scores
  const fusedResults = Array.from(scoreMap.entries()).map(([id, data]) => {
    const keywordRRF = data.keywordRank > 0 ? 1 / (k + data.keywordRank) : 0;
    const semanticRRF = data.semanticRank > 0 ? 1 / (k + data.semanticRank) : 0;
    const fusedScore = keywordRRF + semanticRRF;

    return {
      doc: data.doc,
      fusedScore,
      keywordScore: keywordRRF,
      semanticScore: semanticRRF
    };
  });

  // Sort by fused score descending
  return fusedResults.sort((a, b) => b.fusedScore - a.fusedScore);
}

async function main() {
  console.log("🔬 Hybrid Search RAG System\n");
  console.log("=".repeat(80) + "\n");

  const embeddings = new OpenAIEmbeddings({
    model: process.env.AI_EMBEDDING_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY
  });

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY
  });

  console.log("📚 Loading knowledge base...\n");
  const vectorStore = await MemoryVectorStore.fromDocuments(knowledgeBase, embeddings);

  console.log("✅ Hybrid search system ready!\n");
  console.log("=".repeat(80) + "\n");

  const queries = [
    "What is TypeScript?", // Exact keyword match
    "Tell me about languages with static typing", // Semantic match
    "Which language is best for system programming?" // Mixed
  ];

  for (const query of queries) {
    console.log(`🔍 Query: "${query}"\n`);
    console.log("─".repeat(80) + "\n");

    // Perform keyword search
    console.log("📝 Keyword Search Results:");
    const keywordResults = keywordSearch(query, knowledgeBase, 3);
    keywordResults.forEach((result, index) => {
      console.log(
        `   ${index + 1}. ${result.doc.metadata.title} (score: ${result.score.toFixed(2)})`
      );
    });
    console.log();

    // Perform semantic search
    console.log("🧠 Semantic Search Results:");
    const semanticResults = await vectorStore.similaritySearchWithScore(query, 3);
    semanticResults.forEach((result, index) => {
      const doc = result[0];
      const distance = result[1];
      console.log(
        `   ${index + 1}. ${doc.metadata.title} (similarity: ${(1 - distance).toFixed(2)})`
      );
    });
    console.log();

    // Fuse results
    console.log("🔀 Hybrid (Fused) Results:");
    const fusedResults = fuseResults(keywordResults, semanticResults);
    fusedResults.slice(0, 3).forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.doc.metadata.title}`);
      console.log(`      Fused Score: ${result.fusedScore.toFixed(4)}`);
      console.log(
        `      Keyword: ${result.keywordScore.toFixed(4)} | Semantic: ${result.semanticScore.toFixed(4)}`
      );
    });
    console.log();

    // Generate answer using top hybrid result
    const topDoc = fusedResults[0].doc;
    const answer = await model.invoke(
      `Answer this question based on the context below:\n\nContext: ${topDoc.pageContent}\n\nQuestion: ${query}\n\nAnswer:`
    );

    console.log("─".repeat(80));
    console.log(`\n🤖 Answer: ${answer.content}\n`);
    console.log(`📄 Source: ${topDoc.metadata.title}\n`);
    console.log("=".repeat(80) + "\n");
  }

  console.log("✅ Hybrid Search RAG Complete!\n");
  console.log("💡 Analysis:");
  console.log("   ✓ Keyword search: Best for exact term matches");
  console.log("   ✓ Semantic search: Best for conceptual similarity");
  console.log("   ✓ Hybrid search: Combines strengths of both approaches");
  console.log("   ✓ Reciprocal Rank Fusion: Effective score combination method");
  console.log("\n📊 When Hybrid Helps:");
  console.log("   - Queries with specific technical terms (keyword boost)");
  console.log("   - Queries requiring conceptual understanding (semantic boost)");
  console.log("   - Mixed queries benefit from both approaches");
}

main().catch(console.error);
