/**
 * Chapter 6 Assignment Solution: Challenge 2
 * Multi-Source RAG System
 *
 * Run: npx tsx 06-rag-systems/solution/multi-source-rag.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import readline from "readline";
import "dotenv/config";

const documents = [
  // Text sources
  new Document({
    pageContent: "LangChain simplifies building AI applications with modular components",
    metadata: { source_type: "text", source: "article.txt", date: "2024-01-15" },
  }),
  new Document({
    pageContent: "Vector databases store embeddings for semantic search capabilities",
    metadata: { source_type: "text", source: "notes.txt", date: "2024-01-20" },
  }),
  // Markdown sources
  new Document({
    pageContent: "# Getting Started\n\nInstall LangChain using npm install @langchain/core",
    metadata: {
      source_type: "markdown",
      source: "README.md",
      date: "2024-02-01",
    },
  }),
  new Document({
    pageContent: "## Best Practices\n\nAlways validate user input before processing",
    metadata: {
      source_type: "markdown",
      source: "GUIDE.md",
      date: "2024-02-05",
    },
  }),
  // Web sources
  new Document({
    pageContent: "LangChain.js provides JavaScript bindings for the LangChain framework",
    metadata: {
      source_type: "web",
      source: "https://js.langchain.com",
      date: "2024-02-10",
    },
  }),
  new Document({
    pageContent: "RAG combines retrieval with generation for accurate AI responses",
    metadata: {
      source_type: "web",
      source: "https://docs.langchain.com/rag",
      date: "2024-02-15",
    },
  }),
];

async function createRAGSystem() {
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

  const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);

  return { vectorStore, model };
}

async function query(question: string, sourceType?: string) {
  const { vectorStore, model } = await createRAGSystem();

  let retriever;
  if (sourceType) {
    retriever = vectorStore.asRetriever({
      k: 3,
      filter: (doc: Document) => doc.metadata.source_type === sourceType,
    });
  } else {
    retriever = vectorStore.asRetriever({ k: 3 });
  }

  const prompt = ChatPromptTemplate.fromTemplate(`
Answer based on the following context. Include source type in your response.

{context}

Question: {input}

Answer:`);

  const combineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  const ragChain = await createRetrievalChain({
    retriever,
    combineDocsChain,
  });

  return await ragChain.invoke({ input: question });
}

async function main() {
  console.log("🗂️  Multi-Source RAG System\n");
  console.log("=".repeat(80) + "\n");

  // Check CI mode
  if (process.env.CI === "true") {
    console.log("Running in CI mode\n");

    console.log("Test 1: Query all sources");
    const response1 = await query("What is LangChain?");
    console.log(`Answer: ${response1.answer}\n`);
    console.log(
      `Sources: ${response1.context?.map((d: any) => d.metadata.source_type).join(", ")}\n`
    );

    console.log("Test 2: Query markdown sources only");
    const response2 = await query("How do I get started?", "markdown");
    console.log(`Answer: ${response2.answer}\n`);

    console.log("✅ Multi-source RAG working correctly!");
    return;
  }

  // Interactive mode
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function ask(prompt: string): Promise<string> {
    return new Promise((resolve) => rl.question(prompt, resolve));
  }

  console.log("Available source types: text, markdown, web, all\n");

  while (true) {
    const question = await ask("\n❓ Question (or 'quit'): ");
    if (question.toLowerCase() === "quit") break;

    const sourceType = await ask("📁 Filter by source type (or 'all'): ");

    console.log("\n🔍 Searching...\n");

    const response = await query(question, sourceType === "all" ? undefined : sourceType);

    console.log("─".repeat(80));
    console.log(`\n🤖 Answer: ${response.answer}\n`);

    console.log("📄 Sources:");
    response.context?.forEach((doc: any, i: number) => {
      console.log(
        `   ${i + 1}. [${doc.metadata.source_type.toUpperCase()}] ${doc.metadata.source}`
      );
      console.log(`      Date: ${doc.metadata.date}`);
    });
    console.log("\n" + "─".repeat(80));
  }

  rl.close();
  console.log("\n✅ Complete!");
}

main().catch(console.error);
