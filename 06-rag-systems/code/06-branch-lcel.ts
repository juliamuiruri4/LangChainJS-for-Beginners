/**
 * Branch LCEL - Conditional Routing Based on Input
 * Run: npx tsx 06-rag-systems/code/06-branch-lcel.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough, RunnableSequence, RunnableBranch } from "@langchain/core/runnables";
import { Document } from "langchain/document";
import "dotenv/config";

async function main() {
  console.log("🌿 Branch LCEL Example (Smart Routing)\n");

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

  // Create knowledge base
  const docs = [
    new Document({
      pageContent: "Machine learning is a subset of AI that enables systems to learn from data without explicit programming. It uses algorithms to identify patterns.",
    }),
    new Document({
      pageContent: "Deep learning uses neural networks with multiple layers to process data. It excels at image recognition, natural language processing, and complex pattern matching.",
    }),
    new Document({
      pageContent: "Supervised learning trains models on labeled data where the correct answers are provided. Examples include classification and regression tasks.",
    }),
    new Document({
      pageContent: "Unsupervised learning finds patterns in data without labels. Clustering and dimensionality reduction are common applications.",
    }),
  ];

  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const retriever = vectorStore.asRetriever({ k: 2 });

  // Helper to format documents
  const formatDocs = (docs: Document[]) => {
    return docs.map((doc) => doc.pageContent).join("\n\n");
  };

  console.log("🔧 Building branching chain...\n");
  console.log("=".repeat(80));

  // SIMPLE PATH: For short, direct questions
  const simplePrompt = ChatPromptTemplate.fromTemplate(`
Give a brief, one-sentence answer to this question:

Question: {question}

Answer:`);

  const simpleChain = RunnableSequence.from([
    {
      question: new RunnablePassthrough(),
    },
    simplePrompt,
    model, // Short, direct answers
    new StringOutputParser(),
  ]);

  // DETAILED PATH: For complex questions with context
  const detailedPrompt = ChatPromptTemplate.fromTemplate(`
Provide a comprehensive answer using the context below. Include specific details and examples.

Context: {context}
Question: {question}

Detailed Answer:`);

  const detailedChain = RunnableSequence.from([
    {
      context: async (input: { question: string }) => {
        const docs = await retriever.invoke(input.question);
        return formatDocs(docs);
      },
      question: new RunnablePassthrough(),
    },
    detailedPrompt,
    model, // Comprehensive answers with context
    new StringOutputParser(),
  ]);

  // EXPERT PATH: For technical, deep questions
  const expertPrompt = ChatPromptTemplate.fromTemplate(`
Provide an expert-level technical explanation with precise terminology. Assume the reader has advanced knowledge.

Context: {context}
Question: {question}

Expert Answer:`);

  const expertChain = RunnableSequence.from([
    {
      context: async (input: { question: string }) => {
        const docs = await retriever.invoke(input.question);
        return formatDocs(docs);
      },
      question: new RunnablePassthrough(),
    },
    expertPrompt,
    model, // Precise, technical responses
    new StringOutputParser(),
  ]);

  // BRANCHING LOGIC: Route based on question characteristics
  const branchingChain = RunnableBranch.from([
    [
      // Condition 1: Very short question (< 30 chars) → simple path
      (input: { question: string }) => {
        const isShort = input.question.length < 30;
        if (isShort) console.log("   🚀 ROUTE: Simple (question is short)");
        return isShort;
      },
      simpleChain,
    ],
    [
      // Condition 2: Contains technical keywords → expert path
      (input: { question: string }) => {
        const technicalWords = ["algorithm", "architecture", "implementation", "optimization", "mathematical"];
        const isTechnical = technicalWords.some(word => input.question.toLowerCase().includes(word));
        if (isTechnical) console.log("   🎓 ROUTE: Expert (technical keywords detected)");
        return isTechnical;
      },
      expertChain,
    ],
    // Default: Detailed path for everything else
    (input: { question: string }) => {
      console.log("   📚 ROUTE: Detailed (complex question)");
      return detailedChain.invoke(input);
    },
  ]);

  console.log("\n✅ Branching chain created!\n");
  console.log("🔀 Routing Rules:");
  console.log("   1️⃣  Short question (< 30 chars) → Simple path");
  console.log("   2️⃣  Technical keywords → Expert path");
  console.log("   3️⃣  Everything else → Detailed path");
  console.log("\n=".repeat(80));

  // Test cases that will trigger different paths
  const testCases = [
    {
      question: "What is ML?",
      expectedRoute: "Simple",
    },
    {
      question: "How does the machine learning algorithm architecture work?",
      expectedRoute: "Expert",
    },
    {
      question: "Can you explain supervised learning?",
      expectedRoute: "Detailed",
    },
    {
      question: "Explain the mathematical optimization techniques in deep learning",
      expectedRoute: "Expert",
    },
    {
      question: "What are neural networks and how do they process information?",
      expectedRoute: "Detailed",
    },
  ];

  for (const testCase of testCases) {
    console.log(`\n❓ Question: "${testCase.question}"`);
    console.log(`   📋 Expected Route: ${testCase.expectedRoute}`);

    const answer = await branchingChain.invoke({ question: testCase.question });

    console.log(`\n🤖 Answer: ${answer}\n`);
    console.log("─".repeat(80));
  }

  console.log("\n💡 Branching Benefits:");
  console.log("   - 🎯  Optimized responses (right amount of detail)");
  console.log("   - ⚡  Performance (simple questions = fast path)");
  console.log("   - 💰  Cost efficiency (use resources appropriately)");
  console.log("   - 🎨  Customization (different styles for different inputs)");
  console.log("   - 📊  Scalability (easy to add more branches)");

  console.log("\n🎭 Real-World Use Cases:");
  console.log("   1. Route by complexity (simple/medium/complex)");
  console.log("   2. Route by language (detect and use appropriate model)");
  console.log("   3. Route by topic (different experts for different subjects)");
  console.log("   4. Route by user level (beginner/intermediate/expert)");
  console.log("   5. Route by urgency (fast path for time-sensitive queries)");
}

main().catch(console.error);
