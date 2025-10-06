/**
 * Example 2: RAG with LCEL (LangChain Expression Language)
 *
 * Build RAG using the pipe operator for clean, composable chains.
 *
 * Run: npx tsx 06-rag-systems/code/02-rag-lcel.ts
 */

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { Document } from "langchain/document";
import "dotenv/config";

async function main() {
  console.log("⛓️  RAG with LCEL Example\n");

  // Setup
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Knowledge base
  const docs = [
    new Document({
      pageContent: "TypeScript adds static typing to JavaScript, catching errors at compile time.",
    }),
    new Document({
      pageContent: "React is a library for building user interfaces using component-based architecture.",
    }),
    new Document({
      pageContent: "Node.js enables JavaScript to run on servers, powering backend applications.",
    }),
    new Document({
      pageContent: "npm is the package manager for JavaScript, providing access to millions of libraries.",
    }),
  ];

  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const retriever = vectorStore.asRetriever({ k: 2 });

  // Helper function to format documents
  const formatDocs = (docs: Document[]) => {
    return docs.map((doc) => doc.pageContent).join("\n\n");
  };

  // Create prompt
  const prompt = ChatPromptTemplate.fromTemplate(`
Use the following context to answer the question. Be concise.

Context:
{context}

Question: {question}

Answer:`);

  // Build RAG chain with LCEL
  const ragChainLCEL = RunnableSequence.from([
    {
      // Retrieve documents and format them
      context: async (input: { question: string }) => {
        const docs = await retriever.invoke(input.question);
        return formatDocs(docs);
      },
      // Pass through the question
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);

  console.log("✅ LCEL RAG chain created!\n");
  console.log("=".repeat(80));

  // Test questions
  const questions = [
    "What is TypeScript used for?",
    "How does React work?",
    "What can Node.js do?",
  ];

  for (const question of questions) {
    console.log(`\n❓ ${question}\n`);

    const answer = await ragChainLCEL.invoke({ question });

    console.log(`🤖 ${answer}\n`);
    console.log("─".repeat(80));
  }

  console.log("\n💡 LCEL Benefits:");
  console.log("   - Clean, readable syntax");
  console.log("   - Easy to modify and extend");
  console.log("   - Supports streaming (add .stream())");
  console.log("   - Better debugging");

  // Demonstrate streaming
  console.log("\n" + "=".repeat(80));
  console.log("\n⚡ Streaming Example:\n");

  const streamQuestion = "Explain npm in simple terms";
  console.log(`❓ ${streamQuestion}\n`);
  console.log("🤖 ");

  const stream = await ragChainLCEL.stream({ question: streamQuestion });

  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }

  console.log("\n\n✅ Streaming complete!");
}

main().catch(console.error);
