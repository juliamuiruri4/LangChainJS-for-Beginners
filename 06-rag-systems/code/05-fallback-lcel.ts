/**
 * Fallback LCEL - Graceful Error Handling with Alternative Chains
 * Run: npx tsx 06-rag-systems/code/05-fallback-lcel.ts
 *
 * 🤖 Try asking GitHub Copilot Chat (https://github.com/features/copilot):
 * - "How does the fallback pattern improve RAG system reliability?"
 * - "When should I use .withFallbacks() vs try-catch blocks?"
 * - "Can I chain multiple fallbacks together?"
 */

import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { Document } from "langchain/document";
import "dotenv/config";

async function main() {
  console.log("🛡️  Fallback LCEL Example\n");

  // Setup
  const embeddings = new OpenAIEmbeddings({
    model: process.env.AI_EMBEDDING_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
  });

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
  });

  // Create a SPECIFIC knowledge base (only about web frameworks)
  const docs = [
    new Document({
      pageContent:
        "React is a JavaScript library for building user interfaces. It uses a component-based architecture and virtual DOM for efficient updates.",
    }),
    new Document({
      pageContent:
        "Vue.js is a progressive JavaScript framework that's easy to learn. It combines the best features of React and Angular.",
    }),
    new Document({
      pageContent:
        "Angular is a complete framework by Google for building large-scale applications. It includes routing, forms, HTTP client, and more.",
    }),
  ];

  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const retriever = vectorStore.asRetriever({ k: 2 });

  // Helper to format documents
  const formatDocs = (docs: Document[]) => {
    return docs.map((doc) => doc.pageContent).join("\n\n");
  };

  console.log("🔧 Building chains with fallback...\n");
  console.log("=".repeat(80));

  // PRIMARY CHAIN: Try to answer from documents
  const primaryPrompt = ChatPromptTemplate.fromTemplate(`
Answer the question using ONLY the context provided. If the context doesn't contain the answer, respond with "NOT_FOUND".

Context: {context}
Question: {question}

Answer:`);

  const primaryChain = RunnableSequence.from([
    {
      context: async (input: { question: string }) => {
        console.log("   🎯 PRIMARY: Searching documents...");
        const docs = await retriever.invoke(input.question);
        if (docs.length === 0) {
          throw new Error("No relevant documents found");
        }
        return formatDocs(docs);
      },
      question: new RunnablePassthrough(),
    },
    primaryPrompt,
    model,
    new StringOutputParser(),
  ]);

  // FALLBACK CHAIN: Use general knowledge if primary fails
  const fallbackPrompt = ChatPromptTemplate.fromTemplate(`
The document search didn't find relevant information. Answer this question using your general knowledge, but mention that this is not from the specific knowledge base.

Question: {question}

Answer:`);

  const fallbackChain = RunnableSequence.from([
    {
      question: new RunnablePassthrough(),
    },
    fallbackPrompt,
    model,
    new StringOutputParser(),
  ]);

  // COMBINE: Primary with fallback
  const robustChain = primaryChain.withFallbacks({
    fallbacks: [fallbackChain],
  });

  console.log("\n✅ Fallback chain created!\n");
  console.log("🔄 Strategy:");
  console.log("   1️⃣  Try primary chain (search documents)");
  console.log("   2️⃣  If fails → Fallback chain (general knowledge)");
  console.log("\n=".repeat(80));

  // Test with questions that will trigger different behaviors
  const testCases = [
    {
      question: "What is React used for?",
      expected: "Should find in documents ✅",
    },
    {
      question: "How does Vue.js compare to Angular?",
      expected: "Should find in documents ✅",
    },
    {
      question: "What is quantum computing?",
      expected: "Not in docs → Should use fallback 🔄",
    },
    {
      question: "Explain blockchain technology",
      expected: "Not in docs → Should use fallback 🔄",
    },
  ];

  for (const testCase of testCases) {
    console.log(`\n❓ ${testCase.question}`);
    console.log(`   📋 Expected: ${testCase.expected}\n`);

    try {
      const answer = await robustChain.invoke({ question: testCase.question });
      console.log(`🤖 ${answer}\n`);
    } catch (error) {
      console.log(`❌ Error: ${error instanceof Error ? error.message : String(error)}\n`);
    }

    console.log("─".repeat(80));
  }

  console.log("\n💡 Fallback Chain Benefits:");
  console.log("   - 🛡️  Graceful error handling");
  console.log("   - 🎯  Quality control (try best source first)");
  console.log("   - 💰  Cost optimization (cheaper model as fallback)");
  console.log("   - 🔄  Flexibility (multiple fallback levels)");
  console.log("   - ✅  Always returns something (never crashes)");

  console.log("\n🎭 Real-World Use Cases:");
  console.log("   1. RAG with general knowledge fallback");
  console.log("   2. Expensive model → cheap model fallback");
  console.log("   3. Specialized agent → general agent fallback");
  console.log("   4. API call → cached response fallback");
}

main().catch(console.error);
