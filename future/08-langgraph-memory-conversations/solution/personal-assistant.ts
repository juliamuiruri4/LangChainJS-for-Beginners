/**
 * Chapter 8 Assignment Solution: Challenge 2
 * Stateful Personal Assistant
 *
 * Run: npx tsx 08-langgraph-memory-conversations/solution/personal-assistant.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, START, END, MemorySaver, MessagesAnnotation } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import * as readline from "readline";
import "dotenv/config";

async function main() {
  console.log("🤖 Stateful Personal Assistant\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined
    },
    apiKey: process.env.AI_API_KEY
  });

  // System prompt for the assistant
  const systemMessage = `You are a helpful personal assistant. You remember user preferences and information they share.
Be friendly and refer back to information they've told you. If they mention preferences like wanting concise answers, honor that.`;

  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const messages = [new HumanMessage(systemMessage), ...state.messages];
    const response = await model.invoke(messages);
    return { messages: [response] };
  };

  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

  const memory = new MemorySaver();
  const app = workflow.compile({ checkpointer: memory });

  const config = { configurable: { thread_id: "personal-assistant-1" } };

  console.log("💬 Personal Assistant Ready!\n");
  console.log("Commands:");
  console.log("  /memory  - Show current memory");
  console.log("  /clear   - Clear conversation memory");
  console.log("  /summary - Get conversation summary");
  console.log("  /exit    - Exit the assistant\n");
  console.log("=".repeat(80) + "\n");

  // Check if running in CI mode
  const isCI = process.env.CI === "true";

  if (isCI) {
    console.log("🤖 Running in CI mode with predefined conversation\n");

    const testMessages = [
      "Hi! My name is Alex",
      "I prefer concise answers",
      "What's my name?",
      "Can you help me with a quick question about TypeScript?"
    ];

    for (const msg of testMessages) {
      console.log(`👤 You: ${msg}\n`);

      const response = await app.invoke({ messages: [new HumanMessage(msg)] }, config);

      console.log(`🤖 Assistant: ${response.messages[response.messages.length - 1].content}\n`);
      console.log("─".repeat(80) + "\n");
    }

    // Show memory
    console.log("💾 Memory Contents:");
    const finalState = await app.getState(config);
    console.log(`   Total messages: ${finalState.values.messages.length}`);
    console.log("\n✅ Personal assistant demonstration complete!");
  } else {
    // Interactive mode
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = () => {
      rl.question("👤 You: ", async (input) => {
        const userInput = input.trim();

        if (userInput.toLowerCase() === "/exit") {
          console.log("\n👋 Goodbye!\n");
          rl.close();
          return;
        }

        if (userInput.toLowerCase() === "/clear") {
          // Create new thread
          config.configurable.thread_id = `personal-assistant-${Date.now()}`;
          console.log("\n🔄 Conversation memory cleared!\n");
          console.log("─".repeat(80) + "\n");
          askQuestion();
          return;
        }

        if (userInput.toLowerCase() === "/memory") {
          const state = await app.getState(config);
          console.log("\n💾 Memory Contents:\n");
          console.log(`   Total messages: ${state.values.messages.length}`);

          state.values.messages.slice(-6).forEach((msg: any, i: number) => {
            const role = msg._getType() === "human" ? "You" : "Assistant";
            const preview = String(msg.content).substring(0, 60);
            console.log(
              `   ${i + 1}. ${role}: ${preview}${String(msg.content).length > 60 ? "..." : ""}`
            );
          });

          console.log("\n" + "─".repeat(80) + "\n");
          askQuestion();
          return;
        }

        if (userInput.toLowerCase() === "/summary") {
          const state = await app.getState(config);
          const messages = state.values.messages.slice(-10);

          if (messages.length === 0) {
            console.log("\n📝 No conversation to summarize yet.\n");
          } else {
            const summaryPrompt = `Summarize this conversation in 2-3 bullet points:\n${messages
              .map((m: any) => `${m._getType()}: ${m.content}`)
              .join("\n")}`;

            const summary = await model.invoke(summaryPrompt);
            console.log(`\n📝 Conversation Summary:\n${summary.content}\n`);
          }

          console.log("─".repeat(80) + "\n");
          askQuestion();
          return;
        }

        if (!userInput) {
          askQuestion();
          return;
        }

        try {
          const response = await app.invoke({ messages: [new HumanMessage(userInput)] }, config);

          console.log(
            `\n🤖 Assistant: ${response.messages[response.messages.length - 1].content}\n`
          );
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
