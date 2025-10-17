/**
 * Chapter 6 Assignment Solution: Challenge 3
 * Conversational RAG
 *
 * Run: npx tsx 06-rag-systems/solution/conversational-rag.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import * as readline from "readline";
import "dotenv/config";

// Knowledge base about TypeScript
const knowledgeBase = [
  new Document({
    pageContent:
      "TypeScript is a strongly typed programming language that builds on JavaScript. It adds optional static typing to JavaScript, which can help catch errors early in development.",
    metadata: { title: "TypeScript Overview", section: "Introduction" },
  }),
  new Document({
    pageContent:
      "TypeScript's main benefits include better IDE support, early error detection, improved code maintainability, and enhanced refactoring capabilities. It helps teams build more robust applications.",
    metadata: { title: "TypeScript Benefits", section: "Advantages" },
  }),
  new Document({
    pageContent:
      "TypeScript supports interfaces which define the shape of objects. Interfaces can include properties, methods, and index signatures. They enable type checking and serve as documentation.",
    metadata: { title: "TypeScript Interfaces", section: "Type System" },
  }),
  new Document({
    pageContent:
      "Generics in TypeScript allow you to create reusable components that work with multiple types. They provide type safety while maintaining flexibility. Common examples include Array<T> and Promise<T>.",
    metadata: { title: "TypeScript Generics", section: "Advanced Features" },
  }),
  new Document({
    pageContent:
      "TypeScript enums allow you to define a set of named constants. They can be numeric or string-based and help make code more readable and less error-prone when working with sets of related values.",
    metadata: { title: "TypeScript Enums", section: "Type System" },
  }),
];

async function main() {
  console.log("💬 Conversational RAG System\n");
  console.log("=".repeat(80) + "\n");

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

  console.log("📝 Loading knowledge base into vector store...\n");

  const vectorStore = await MemoryVectorStore.fromDocuments(knowledgeBase, embeddings);
  const retriever = vectorStore.asRetriever({ k: 2 });

  // Create a history-aware retriever that reformulates questions based on chat history
  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
    [
      "user",
      "Given the conversation above, generate a search query to look up information relevant to the conversation",
    ],
  ]);

  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  // Create the answer generation prompt
  const answerPrompt = ChatPromptTemplate.fromMessages([
    ["system", "Answer the user's questions based on the below context:\n\n{context}"],
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
  ]);

  const combineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: answerPrompt,
  });

  const conversationalRagChain = await createRetrievalChain({
    retriever: historyAwareRetriever,
    combineDocsChain,
  });

  // Store conversation history
  const chatHistory: (HumanMessage | AIMessage)[] = [];

  console.log("✅ Conversational RAG ready!\n");
  console.log("=".repeat(80) + "\n");
  console.log("💡 Try asking follow-up questions that reference previous context\n");
  console.log("Commands:");
  console.log("  - Type your question to ask");
  console.log("  - Type 'reset' to start a new conversation");
  console.log("  - Type 'history' to see conversation history");
  console.log("  - Type 'exit' to quit\n");
  console.log("=".repeat(80) + "\n");

  // Check if running in CI mode
  const isCI = process.env.CI === "true";

  if (isCI) {
    // CI mode: run predefined conversation
    console.log("🤖 Running in CI mode with predefined conversation\n");

    const testConversation = [
      "What is TypeScript?",
      "What are its main benefits?",
      "Can you explain more about the type system?",
      "What are generics?",
    ];

    for (const question of testConversation) {
      console.log(`\n👤 You: ${question}\n`);

      const response = await conversationalRagChain.invoke({
        input: question,
        chat_history: chatHistory,
      });

      console.log(`🤖 Assistant: ${response.answer}\n`);
      console.log("─".repeat(80));

      // Update history
      chatHistory.push(new HumanMessage(question));
      chatHistory.push(new AIMessage(response.answer));
    }

    console.log("\n✅ Conversational RAG demonstration complete!");
    console.log("\n💡 Notice how:");
    console.log("   - Follow-up questions understand context ('its' refers to TypeScript)");
    console.log("   - Conversation history is maintained");
    console.log("   - Answers remain grounded in the knowledge base");
  } else {
    // Interactive mode
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const askQuestion = () => {
      rl.question("👤 You: ", async (input) => {
        const userInput = input.trim();

        if (userInput.toLowerCase() === "exit") {
          console.log("\n👋 Goodbye!\n");
          rl.close();
          return;
        }

        if (userInput.toLowerCase() === "reset") {
          chatHistory.length = 0;
          console.log("\n🔄 Conversation reset!\n");
          console.log("=".repeat(80) + "\n");
          askQuestion();
          return;
        }

        if (userInput.toLowerCase() === "history") {
          console.log("\n📜 Conversation History:\n");
          if (chatHistory.length === 0) {
            console.log("   (empty)\n");
          } else {
            chatHistory.forEach((msg, i) => {
              const role = msg._getType() === "human" ? "You" : "Assistant";
              console.log(`${i + 1}. ${role}: ${String(msg.content).substring(0, 60)}...`);
            });
          }
          console.log("\n" + "=".repeat(80) + "\n");
          askQuestion();
          return;
        }

        if (!userInput) {
          askQuestion();
          return;
        }

        try {
          const response = await conversationalRagChain.invoke({
            input: userInput,
            chat_history: chatHistory,
          });

          console.log(`\n🤖 Assistant: ${response.answer}\n`);
          console.log("─".repeat(80) + "\n");

          // Update history
          chatHistory.push(new HumanMessage(userInput));
          chatHistory.push(new AIMessage(response.answer));
        } catch (error) {
          console.error("\n❌ Error:", error);
          console.log("\n" + "─".repeat(80) + "\n");
        }

        askQuestion();
      });
    };

    askQuestion();
  }
}

main().catch(console.error);
