/**
 * RAG with Metadata Filtering
 * Run: npx tsx 06-rag-systems/code/03-metadata-filtering.ts
 */

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import "dotenv/config";

async function main() {
  console.log("🏷️  RAG with Metadata Filtering\n");

  const embeddings = new OpenAIEmbeddings({
    model: process.env.AI_EMBEDDING_MODEL || "text-embedding-3-small",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Documents with rich metadata
  const docs = [
    new Document({
      pageContent: "Python is excellent for data science, with libraries like pandas and NumPy.",
      metadata: { language: "python", topic: "data-science", difficulty: "beginner" },
    }),
    new Document({
      pageContent: "JavaScript powers modern web applications using frameworks like React and Vue.",
      metadata: { language: "javascript", topic: "web-dev", difficulty: "beginner" },
    }),
    new Document({
      pageContent: "TypeScript adds type safety to large JavaScript applications.",
      metadata: { language: "typescript", topic: "web-dev", difficulty: "intermediate" },
    }),
    new Document({
      pageContent: "Python's asyncio enables concurrent programming for I/O-bound tasks.",
      metadata: { language: "python", topic: "async", difficulty: "advanced" },
    }),
    new Document({
      pageContent: "React hooks revolutionized state management in functional components.",
      metadata: { language: "javascript", topic: "web-dev", difficulty: "intermediate" },
    }),
    new Document({
      pageContent: "Machine learning in Python uses scikit-learn and TensorFlow.",
      metadata: { language: "python", topic: "machine-learning", difficulty: "advanced" },
    }),
  ];

  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

  console.log("📚 Vector store created with metadata!\n");
  console.log("=".repeat(80));

  // Scenario 1: Filter by language
  console.log("\n1️⃣  Filter by Language (JavaScript only):\n");

  const jsRetriever = vectorStore.asRetriever({
    filter: (doc) => doc.metadata.language === "javascript",
    k: 3,
  });

  const prompt = ChatPromptTemplate.fromTemplate(`
Answer based on this context:

{context}

Question: {input}
`);

  const jsCombineDocs = await createStuffDocumentsChain({ llm: model, prompt });
  const jsChain = await createRetrievalChain({
    retriever: jsRetriever,
    combineDocsChain: jsCombineDocs,
  });

  const jsResponse = await jsChain.invoke({
    input: "What are modern web development tools?",
  });

  console.log("🤖 Answer:", jsResponse.answer);
  console.log("\n📄 Retrieved:", jsResponse.context.length, "JavaScript docs");

  // Scenario 2: Filter by difficulty
  console.log("\n" + "=".repeat(80));
  console.log("\n2️⃣  Filter by Difficulty (Beginner only):\n");

  const beginnerRetriever = vectorStore.asRetriever({
    filter: (doc) => doc.metadata.difficulty === "beginner",
    k: 3,
  });

  const beginnerCombineDocs = await createStuffDocumentsChain({ llm: model, prompt });
  const beginnerChain = await createRetrievalChain({
    retriever: beginnerRetriever,
    combineDocsChain: beginnerCombineDocs,
  });

  const beginnerResponse = await beginnerChain.invoke({
    input: "Which programming language should I learn first?",
  });

  console.log("🤖 Answer:", beginnerResponse.answer);
  console.log("\n📄 Retrieved:", beginnerResponse.context.length, "beginner docs");

  // Scenario 3: Multiple filters
  console.log("\n" + "=".repeat(80));
  console.log("\n3️⃣  Multiple Filters (Python + Data Science):\n");

  const pythonDataRetriever = vectorStore.asRetriever({
    filter: (doc) =>
      doc.metadata.language === "python" && doc.metadata.topic === "data-science",
    k: 3,
  });

  const pythonDataCombineDocs = await createStuffDocumentsChain({ llm: model, prompt });
  const pythonDataChain = await createRetrievalChain({
    retriever: pythonDataRetriever,
    combineDocsChain: pythonDataCombineDocs,
  });

  const pythonDataResponse = await pythonDataChain.invoke({
    input: "How can I analyze data?",
  });

  console.log("🤖 Answer:", pythonDataResponse.answer);
  console.log("\n📄 Retrieved:", pythonDataResponse.context.length, "Python data science docs");

  console.log("\n" + "=".repeat(80));
  console.log("\n💡 Metadata Filtering Benefits:");
  console.log("   - Narrow search to specific categories");
  console.log("   - Improve relevance and precision");
  console.log("   - Filter by user permissions/roles");
  console.log("   - Combine multiple criteria");
}

main().catch(console.error);
