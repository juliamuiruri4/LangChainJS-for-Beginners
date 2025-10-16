/**
 * Parallel LCEL - Running Multiple Operations Simultaneously
 * Run: npx tsx 06-rag-systems/code/04-parallel-lcel.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough, RunnableSequence, RunnableParallel } from "@langchain/core/runnables";
import { Document } from "langchain/document";
import "dotenv/config";

async function main() {
  console.log("⚡ Parallel LCEL Example\n");

  // Setup
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

  // Create knowledge base about programming languages
  const docs = [
    new Document({
      pageContent: "Python is a high-level programming language known for its simplicity and readability. It's widely used in data science, machine learning, and web development.",
      metadata: { category: "language", popularity: "high" },
    }),
    new Document({
      pageContent: "JavaScript runs in browsers and on servers via Node.js. It's the primary language for web development and powers interactive websites.",
      metadata: { category: "language", popularity: "high" },
    }),
    new Document({
      pageContent: "Rust is a systems programming language focused on safety and performance. It prevents memory bugs and ensures thread safety.",
      metadata: { category: "language", popularity: "growing" },
    }),
    new Document({
      pageContent: "TypeScript adds static typing to JavaScript, catching errors at compile time and improving developer experience in large codebases.",
      metadata: { category: "language", popularity: "high" },
    }),
  ];

  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const retriever = vectorStore.asRetriever({ k: 2 });

  // Helper to format documents
  const formatDocs = (docs: Document[]) => {
    return docs.map((doc) => doc.pageContent).join("\n\n");
  };

  // Create prompt
  const prompt = ChatPromptTemplate.fromTemplate(`
Answer the question using the context and statistics provided.

Context: {context}
Stats: {stats}
Question: {question}

Answer:`);

  console.log("🔧 Building parallel LCEL chain...\n");
  console.log("=".repeat(80));

  // PARALLEL EXECUTION: Run multiple operations at the same time
  const parallelChain = RunnableParallel.from({
    // Operation 1: Retrieve and format relevant documents
    context: async (input: { question: string }) => {
      console.log("   📚 Retrieving documents...");
      const docs = await retriever.invoke(input.question);
      return formatDocs(docs);
    },

    // Operation 2: Generate statistics about the documents
    stats: async (input: { question: string }) => {
      console.log("   📊 Generating statistics...");
      const docs = await retriever.invoke(input.question);
      return `Found ${docs.length} relevant documents. Categories: ${docs.map(d => d.metadata.category).join(", ")}`;
    },

    // Operation 3: Pass through the question
    question: new RunnablePassthrough(),
  });

  // Combine parallel results with the rest of the chain
  const fullChain = RunnableSequence.from([
    parallelChain,  // All three operations run at once!
    prompt,
    model,
    new StringOutputParser(),
  ]);

  console.log("\n✅ Parallel chain created!\n");
  console.log("⏱️  Operations running in parallel:\n");
  console.log("   1️⃣  Document retrieval");
  console.log("   2️⃣  Statistics generation");
  console.log("   3️⃣  Question passthrough");
  console.log("\n=".repeat(80));

  // Test the parallel chain
  const questions = [
    "What makes Python popular?",
    "How is TypeScript different from JavaScript?",
  ];

  for (const question of questions) {
    console.log(`\n❓ ${question}\n`);

    const startTime = Date.now();
    const answer = await fullChain.invoke({ question });
    const duration = Date.now() - startTime;

    console.log(`\n🤖 ${answer}`);
    console.log(`\n⏱️  Response time: ${duration}ms`);
    console.log("─".repeat(80));
  }

  console.log("\n💡 Benefits of Parallel Execution:");
  console.log("   - ⚡ Faster: Multiple operations run simultaneously");
  console.log("   - 🔄 Efficient: Better resource utilization");
  console.log("   - 📊 Rich: Combine data from multiple sources");
  console.log("   - 🎯 Flexible: Each operation is independent");

  console.log("\n📈 Performance Comparison:");
  console.log("   Sequential: Operation A → Operation B → Operation C (3 seconds)");
  console.log("   Parallel:   [Operation A | Operation B | Operation C] (1 second)");
  console.log("   Speedup:    ~3x faster!");
}

main().catch(console.error);
