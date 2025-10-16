/**
 * Chapter 6 Assignment Solution: Challenge 4
 * RAG with Citation Generator
 *
 * Run: npx tsx 06-rag-systems/solution/citation-rag.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import "dotenv/config";

// Knowledge base with rich metadata
const knowledgeBase = [
  new Document({
    pageContent: "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn for themselves.",
    metadata: {
      title: "Introduction to Machine Learning",
      section: "Chapter 1",
      page: 12,
      author: "AI Research Team"
    },
  }),
  new Document({
    pageContent: "Supervised learning involves training a model on labeled data. The algorithm learns to map inputs to outputs based on example input-output pairs. Common applications include classification and regression problems.",
    metadata: {
      title: "Supervised Learning Fundamentals",
      section: "Chapter 2",
      page: 34,
      author: "AI Research Team"
    },
  }),
  new Document({
    pageContent: "Neural networks are computing systems inspired by biological neural networks. They consist of layers of interconnected nodes (neurons) that process and transform data. Deep learning uses neural networks with many layers.",
    metadata: {
      title: "Neural Networks Explained",
      section: "Chapter 3",
      page: 56,
      author: "Deep Learning Group"
    },
  }),
  new Document({
    pageContent: "Natural Language Processing (NLP) enables computers to understand, interpret, and generate human language. Techniques include tokenization, part-of-speech tagging, named entity recognition, and sentiment analysis.",
    metadata: {
      title: "Natural Language Processing",
      section: "Chapter 5",
      page: 89,
      author: "NLP Research Lab"
    },
  }),
  new Document({
    pageContent: "Transfer learning involves taking a pre-trained model and fine-tuning it for a specific task. This approach saves time and resources while often achieving better performance than training from scratch.",
    metadata: {
      title: "Transfer Learning Techniques",
      section: "Chapter 7",
      page: 134,
      author: "AI Research Team"
    },
  }),
];

interface RetrievalResult {
  document: Document;
  score: number;
}

async function main() {
  console.log("📝 RAG with Citation Generator\n");
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

  console.log("📚 Loading knowledge base with rich metadata...\n");

  const vectorStore = await MemoryVectorStore.fromDocuments(knowledgeBase, embeddings);

  console.log("✅ Knowledge base ready!\n");
  console.log("=".repeat(80) + "\n");

  // Questions to test
  const questions = [
    "What is machine learning?",
    "Explain neural networks and deep learning",
    "What is NLP and what can it do?",
  ];

  for (const question of questions) {
    console.log(`❓ Question: ${question}\n`);
    console.log("─".repeat(80) + "\n");

    // Retrieve relevant documents with similarity scores
    const relevantDocs = await vectorStore.similaritySearchWithScore(question, 3);

    // Build context with document numbers for citation
    const contextWithCitations = relevantDocs
      .map((result, index) => {
        const doc = result[0];
        return `[${index + 1}] ${doc.pageContent}`;
      })
      .join("\n\n");

    // Create prompt for answer generation
    const prompt = ChatPromptTemplate.fromTemplate(`
Answer the question based on the following context. Use citation numbers [1], [2], etc. to reference sources in your answer.

Context:
{context}

Question: {question}

Provide a comprehensive answer with inline citations like [1] or [2] where you reference information.`);

    const chain = RunnableSequence.from([
      {
        context: () => contextWithCitations,
        question: (input: { question: string }) => input.question,
      },
      prompt,
      model,
    ]);

    const response = await chain.invoke({ question });

    console.log(`🤖 Answer:\n${response.content}\n`);
    console.log("─".repeat(80) + "\n");

    // Format citations
    console.log("📚 Sources:\n");

    relevantDocs.forEach((result, index) => {
      const doc = result[0];
      const score = result[1];
      const relevancePercent = Math.round((1 - score) * 100); // Convert distance to relevance

      console.log(`[${index + 1}] ${doc.metadata.title} - ${doc.metadata.section} (Page ${doc.metadata.page})`);
      console.log(`    Relevance: ${relevancePercent}%`);
      console.log(`    Author: ${doc.metadata.author}`);
      console.log(`    Excerpt: "${doc.pageContent.substring(0, 100)}..."\n`);
    });

    console.log("=".repeat(80) + "\n");
  }

  console.log("✅ Citation RAG complete!\n");
  console.log("💡 Key Features:");
  console.log("   ✓ Inline citations in answers [1], [2], [3]");
  console.log("   ✓ Detailed source information");
  console.log("   ✓ Relevance scores for each source");
  console.log("   ✓ Formatted excerpts from documents");
  console.log("   ✓ Rich metadata (title, section, page, author)");
}

main().catch(console.error);
