/**
 * Simple RAG System
 * Run: npx tsx 06-rag-systems/code/01-simple-rag.ts
 */

import { createChatModel, createEmbeddingsModel } from "@/scripts/create-model.js";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import "dotenv/config";

async function main() {
  console.log("🔍 Simple RAG System Example\n");

  // 1. Setup embeddings and model
  const embeddings = createEmbeddingsModel();

  const model = createChatModel();

  // 2. Create knowledge base
  const docs = [
    new Document({
      pageContent:
        "LangChain.js was released in 2023 as the JavaScript/TypeScript port of the Python LangChain library. It enables developers to build LLM-powered applications using familiar web technologies.",
      metadata: { source: "langchain-history", topic: "introduction" },
    }),
    new Document({
      pageContent:
        "RAG (Retrieval Augmented Generation) combines document retrieval with LLM generation. It allows models to access external knowledge without retraining, making responses more accurate and up-to-date.",
      metadata: { source: "rag-explanation", topic: "concepts" },
    }),
    new Document({
      pageContent:
        "Vector stores like Pinecone, Weaviate, and Chroma enable semantic search over documents. They store embeddings and perform fast similarity searches to find relevant content.",
      metadata: { source: "vector-stores", topic: "infrastructure" },
    }),
    new Document({
      pageContent:
        "LangChain Expression Language (LCEL) provides a declarative way to compose chains. It uses a pipe operator to connect components, making complex workflows easier to build and understand.",
      metadata: { source: "lcel-guide", topic: "development" },
    }),
  ];

  console.log(`📚 Creating vector store with ${docs.length} documents...\n`);

  // 3. Create vector store and retriever
  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const retriever = vectorStore.asRetriever({ k: 2 });

  // 4. Create RAG prompt
  const prompt = ChatPromptTemplate.fromTemplate(`
Answer the question based only on the following context:

{context}

Question: {input}

Answer: Provide a clear, concise answer based on the context above. If the context doesn't contain the answer, say so.
`);

  // 5. Create RAG chain
  const combineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  const ragChain = await createRetrievalChain({
    retriever,
    combineDocsChain,
  });

  // 6. Ask questions
  const questions = [
    "When was LangChain.js released?",
    "What is RAG and why is it useful?",
    "What vector stores can I use with LangChain?",
    "How do I deploy LangChain to production?", // Not in docs
  ];

  for (const question of questions) {
    console.log("=".repeat(80));
    console.log(`\n❓ Question: ${question}\n`);

    const response = await ragChain.invoke({
      input: question,
    });

    console.log("🤖 Answer:", response.answer);
    console.log("\n📄 Sources used:", response.context.length, "documents");
    response.context.forEach((doc: Document, i: number) => {
      console.log(`   ${i + 1}. ${doc.metadata.source} (${doc.metadata.topic})`);
    });
    console.log();
  }

  console.log("=".repeat(80));
  console.log("\n💡 Key Observations:");
  console.log("   - RAG retrieves relevant documents first");
  console.log("   - LLM generates answer based on retrieved context");
  console.log("   - When info isn't in docs, system acknowledges it");
  console.log("   - Source attribution is automatic!");
}

main().catch(console.error);
