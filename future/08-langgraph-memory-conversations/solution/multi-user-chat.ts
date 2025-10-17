/**
 * Chapter 8 Assignment Solution: Challenge 3
 * Multi-User Chat System
 *
 * Run: npx tsx 08-langgraph-memory-conversations/solution/multi-user-chat.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, START, END, MemorySaver, MessagesAnnotation } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import * as readline from "readline";
import "dotenv/config";

async function main() {
  console.log("💬 Multi-User Chat System\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-5-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  };

  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

  const memory = new MemorySaver();
  const app = workflow.compile({ checkpointer: memory });

  // Track active users
  let currentUser = "Alice";

  console.log("👥 Multi-User Chat Active\n");
  console.log("Commands:");
  console.log("  /switch [name] - Switch to a different user");
  console.log("  /users         - List all active users");
  console.log("  /exit          - Exit the chat\n");
  console.log("=".repeat(80) + "\n");

  // Check if running in CI mode
  const isCI = process.env.CI === "true";

  if (isCI) {
    console.log("🤖 Running in CI mode with predefined conversation\n");

    const testScenario = [
      { user: "Alice", message: "My favorite color is blue" },
      { user: "Bob", message: "I love hiking" },
      { user: "Alice", message: "What's my favorite color?" },
      { user: "Bob", message: "What do I love?" },
      { user: "Charlie", message: "Hi! I'm new here" },
      { user: "Alice", message: "Do you remember me?" },
    ];

    for (const { user, message } of testScenario) {
      console.log(`👤 ${user}: ${message}\n`);

      const config = {
        configurable: { thread_id: `user-${user.toLowerCase()}` },
      };
      const response = await app.invoke({ messages: [new HumanMessage(message)] }, config);

      console.log(
        `🤖 Bot (to ${user}): ${response.messages[response.messages.length - 1].content}\n`
      );
      console.log("─".repeat(80) + "\n");
    }

    console.log("✅ Multi-user chat demonstration complete!");
    console.log("\n💡 Key Features Demonstrated:");
    console.log("   ✓ Separate memory per user");
    console.log("   ✓ No cross-contamination between users");
    console.log("   ✓ Each user has independent conversation history");
  } else {
    // Interactive mode
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(`📍 Current user: ${currentUser}\n`);

    const askQuestion = () => {
      rl.question(`👤 ${currentUser}: `, async (input) => {
        const userInput = input.trim();

        if (userInput.toLowerCase() === "/exit") {
          console.log("\n👋 Goodbye!\n");
          rl.close();
          return;
        }

        if (userInput.toLowerCase().startsWith("/switch")) {
          const newUser = userInput.split(" ")[1];
          if (newUser) {
            currentUser = newUser.charAt(0).toUpperCase() + newUser.slice(1);
            console.log(`\n🔄 Switched to user: ${currentUser}\n`);
          } else {
            console.log("\n⚠️ Usage: /switch [name]\n");
          }
          console.log("─".repeat(80) + "\n");
          askQuestion();
          return;
        }

        if (userInput.toLowerCase() === "/users") {
          const state = await app.getState({
            configurable: { thread_id: `user-${currentUser.toLowerCase()}` },
          });
          console.log(`\n👥 Current user: ${currentUser}`);
          console.log(`   Messages in history: ${state.values.messages.length}\n`);
          console.log("   Note: Each user has separate conversation memory\n");
          console.log("─".repeat(80) + "\n");
          askQuestion();
          return;
        }

        if (!userInput) {
          askQuestion();
          return;
        }

        try {
          const config = {
            configurable: { thread_id: `user-${currentUser.toLowerCase()}` },
          };
          const response = await app.invoke({ messages: [new HumanMessage(userInput)] }, config);

          console.log(`\n🤖 Bot: ${response.messages[response.messages.length - 1].content}\n`);
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
