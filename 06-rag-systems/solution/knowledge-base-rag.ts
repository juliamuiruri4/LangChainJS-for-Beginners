/**
 * Chapter 6 Assignment Solution: Challenge 1
 * Personal Knowledge Base Q&A
 *
 * Run: npx tsx 06-rag-systems/solution/knowledge-base-rag.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents";
import { createRetrievalChain } from "@langchain/classic/chains/retrieval";
import "dotenv/config";

// Sample knowledge base - you can replace with your own documents
const knowledgeBase = [
  new Document({
    pageContent:
      "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing, classes, and interfaces to JavaScript, making it easier to build and maintain large-scale applications.",
    metadata: { title: "TypeScript Basics", source: "my-notes" },
  }),
  new Document({
    pageContent:
      "React hooks like useState and useEffect allow functional components to have state and side effects. useState returns a state variable and a setter function, while useEffect runs side effects after render.",
    metadata: { title: "React Hooks", source: "my-notes" },
  }),
  new Document({
    pageContent:
      "Docker containers package applications with their dependencies, ensuring consistent behavior across environments. Containers are lightweight, portable, and share the host OS kernel, making them more efficient than virtual machines.",
    metadata: { title: "Docker Containers", source: "my-notes" },
  }),
  new Document({
    pageContent:
      "REST APIs follow principles like statelessness, client-server architecture, and uniform interface. HTTP methods (GET, POST, PUT, DELETE) map to CRUD operations. Status codes indicate request outcomes.",
    metadata: { title: "REST API Design", source: "my-notes" },
  }),
  new Document({
    pageContent:
      "Git branching strategies like Git Flow and trunk-based development help teams manage code changes. Feature branches isolate work, pull requests enable code review, and merge commits preserve history.",
    metadata: { title: "Git Workflows", source: "my-notes" },
  }),
  new Document({
    pageContent:
      "Node.js event loop handles asynchronous operations efficiently. The call stack executes synchronous code, while the callback queue holds async callbacks. The event loop moves callbacks to the stack when it's empty.",
    metadata: { title: "Node.js Event Loop", source: "my-notes" },
  }),
  new Document({
    pageContent:
      "Database indexing improves query performance by creating data structures that allow fast lookups. B-tree indexes work well for range queries, while hash indexes excel at equality comparisons. Over-indexing can slow writes.",
    metadata: { title: "Database Performance", source: "my-notes" },
  }),
];

async function main() {
  console.log("📚 Personal Knowledge Base Q&A\n");
  console.log("=".repeat(80) + "\n");

  const embeddings = new OpenAIEmbeddings({
    model: process.env.AI_EMBEDDING_MODEL || "text-embedding-3-small",
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
  });

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
  });

  console.log(`📝 Loading ${knowledgeBase.length} documents into vector store...\n`);

  const vectorStore = await MemoryVectorStore.fromDocuments(knowledgeBase, embeddings);
  const retriever = vectorStore.asRetriever({ k: 2 });

  const prompt = ChatPromptTemplate.fromTemplate(`
Answer the question based on the following context from my personal knowledge base:

{context}

Question: {input}

Answer: Provide a clear answer with source attribution. If the answer isn't in the knowledge base, say "I don't have information about that in my knowledge base."`);

  const combineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  const ragChain = await createRetrievalChain({
    retriever,
    combineDocsChain,
  });

  console.log("✅ Knowledge base ready!\n");
  console.log("=".repeat(80) + "\n");

  const questions = [
    "What is TypeScript and why use it?",
    "How do React hooks work?",
    "Explain Docker containers",
    "What are database indexes?",
    "How does quantum computing work?", // Not in knowledge base
  ];

  for (const question of questions) {
    console.log(`❓ Question: ${question}\n`);
    console.log("─".repeat(80));

    const response = await ragChain.invoke({ input: question });

    console.log(`\n🤖 Answer: ${response.answer}\n`);

    console.log("📄 Sources:");
    if (response.context && response.context.length > 0) {
      response.context.forEach((doc: any) => {
        console.log(`   - ${doc.metadata.title} (${doc.metadata.source})`);
      });
    } else {
      console.log("   No sources found");
    }

    console.log("\n" + "=".repeat(80) + "\n");
  }

  console.log("✅ Knowledge base Q&A complete!");
  console.log("\n💡 Notice how:");
  console.log("   - Answers are grounded in your knowledge base");
  console.log("   - Sources are automatically cited");
  console.log("   - System gracefully handles questions outside the knowledge base");
}

main().catch(console.error);
