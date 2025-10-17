/**
 * Chapter 8 Assignment Solution: Challenge 4
 * Smart Memory Optimizer
 *
 * Run: npx tsx 08-langgraph-memory-conversations/solution/smart-memory.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import * as readline from "readline";
import "dotenv/config";

type MemoryType = "buffer" | "window" | "summary";

interface MemoryStats {
  messageCount: number;
  estimatedTokens: number;
  memoryType: MemoryType;
}

async function main() {
  console.log("🧠 Smart Memory Optimizer\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  let messages: any[] = [];
  let summary: string = "";
  let currentMemoryType: MemoryType = "buffer";

  // Estimate tokens (rough approximation: 1 token ≈ 4 characters)
  function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  function getTotalTokens(): number {
    const messageTokens = messages.reduce(
      (sum, msg) => sum + estimateTokens(String(msg.content)),
      0
    );
    const summaryTokens = summary ? estimateTokens(summary) : 0;
    return messageTokens + summaryTokens;
  }

  function selectMemoryType(messageCount: number, tokenCount: number): MemoryType {
    if (messageCount < 10) {
      return "buffer";
    } else if (messageCount < 30 || tokenCount < 2000) {
      return "window";
    } else {
      return "summary";
    }
  }

  async function getMemoryContext(): Promise<any[]> {
    const messageCount = messages.length;
    const tokenCount = getTotalTokens();
    const optimalType = selectMemoryType(messageCount, tokenCount);

    // Check if we need to transition
    if (optimalType !== currentMemoryType) {
      console.log(
        `\n🔄 Optimizing: Switching from ${currentMemoryType} to ${optimalType} memory\n`
      );

      if (optimalType === "window" && currentMemoryType === "buffer") {
        // Transition to window: keep last 10 messages
        messages = messages.slice(-10);
      } else if (optimalType === "summary" && currentMemoryType === "window") {
        // Transition to summary: create summary of current messages
        const summaryPrompt = `Summarize the key facts and context from this conversation:\n${messages
          .map((m) => `${m._getType()}: ${m.content}`)
          .join("\n")}`;

        const summaryResponse = await model.invoke(summaryPrompt);
        summary = summaryResponse.content.toString();
        messages = messages.slice(-4); // Keep only recent messages
      }

      currentMemoryType = optimalType;
    }

    // Build context based on current memory type
    switch (currentMemoryType) {
      case "buffer":
        return messages;

      case "window":
        // Keep only last 10 messages
        if (messages.length > 10) {
          messages = messages.slice(-10);
        }
        return messages;

      case "summary":
        // Use summary + recent messages
        const contextMessages: any[] = [];
        if (summary) {
          contextMessages.push(new HumanMessage(`Previous conversation summary: ${summary}`));
        }
        contextMessages.push(...messages.slice(-4));
        return contextMessages;

      default:
        return messages;
    }
  }

  function displayStats(): MemoryStats {
    const stats: MemoryStats = {
      messageCount: messages.length,
      estimatedTokens: getTotalTokens(),
      memoryType: currentMemoryType,
    };

    console.log("\n📊 Memory Statistics:");
    console.log(`   Memory Type: ${stats.memoryType.toUpperCase()}`);
    console.log(`   Messages: ${stats.messageCount}`);
    console.log(`   Estimated Tokens: ${stats.estimatedTokens}`);
    if (summary) {
      console.log(`   Summary Active: Yes (${estimateTokens(summary)} tokens)`);
    }
    console.log();

    return stats;
  }

  console.log("💡 Smart Memory automatically optimizes based on conversation length\n");
  console.log("Rules:");
  console.log("   - Buffer: < 10 messages");
  console.log("   - Window: 10-30 messages or < 2000 tokens");
  console.log("   - Summary: > 30 messages or > 2000 tokens\n");
  console.log("Commands: /stats, /exit\n");
  console.log("=".repeat(80) + "\n");

  displayStats();

  // Check if running in CI mode
  const isCI = process.env.CI === "true";

  if (isCI) {
    console.log("🤖 Running in CI mode with simulated conversation\n");

    const testMessages = [
      "Hi, my name is Jordan",
      "I work as a software engineer",
      "I'm learning about LangChain",
      "Tell me about memory management", // Still in buffer
      "What are the different memory types?",
      "How does window memory work?",
      "What's the benefit of summary memory?",
      "Can you explain buffer memory?",
      "What are best practices?",
      "How do I choose the right memory type?", // Should switch to window
      "What's my name?",
      "Tell me more about optimizing memory",
    ];

    for (let i = 0; i < testMessages.length; i++) {
      const userMessage = testMessages[i];
      console.log(`👤 You: ${userMessage}\n`);

      const context = await getMemoryContext();
      const response = await model.invoke([...context, new HumanMessage(userMessage)]);

      messages.push(new HumanMessage(userMessage), new AIMessage(response.content.toString()));

      console.log(`🤖 Assistant: ${response.content}\n`);
      console.log("─".repeat(80));

      if (i === 3 || i === 9) {
        displayStats();
      }
    }

    console.log("\n" + "=".repeat(80));
    displayStats();
    console.log("✅ Smart memory optimization demonstration complete!");
  } else {
    // Interactive mode
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const askQuestion = () => {
      rl.question("👤 You: ", async (input) => {
        const userInput = input.trim();

        if (userInput.toLowerCase() === "/exit") {
          console.log("\n👋 Goodbye!\n");
          rl.close();
          return;
        }

        if (userInput.toLowerCase() === "/stats") {
          displayStats();
          console.log("─".repeat(80) + "\n");
          askQuestion();
          return;
        }

        if (!userInput) {
          askQuestion();
          return;
        }

        try {
          const context = await getMemoryContext();
          const response = await model.invoke([...context, new HumanMessage(userInput)]);

          messages.push(new HumanMessage(userInput), new AIMessage(response.content.toString()));

          console.log(`\n🤖 Assistant: ${response.content}\n`);
          console.log("─".repeat(80) + "\n");
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
