/**
 * Buffer Memory with LangGraph
 * Run: npx tsx 08-memory-conversations/code/01-buffer-memory.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, START, END, MemorySaver, MessagesAnnotation } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import "dotenv/config";

async function main() {
  console.log("💾 Buffer Memory Example\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Define the chatbot node
  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  };

  // Create workflow with memory
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

  // Compile with MemorySaver for automatic conversation persistence
  const memory = new MemorySaver();
  const app = workflow.compile({ checkpointer: memory });

  console.log("🗣️  Starting conversation...\n");
  console.log("=".repeat(80));

  const config = { configurable: { thread_id: "conversation-1" } };

  // Exchange 1
  console.log("\n👤 User: My name is Alex and I'm a TypeScript developer.");

  const response1 = await app.invoke(
    { messages: [new HumanMessage("My name is Alex and I'm a TypeScript developer.")] },
    config
  );

  console.log(`🤖 Bot: ${response1.messages[response1.messages.length - 1].content}\n`);

  // Exchange 2
  console.log("👤 User: What programming languages do I like?");

  const response2 = await app.invoke(
    { messages: [new HumanMessage("What programming languages do I like?")] },
    config
  );

  console.log(`🤖 Bot: ${response2.messages[response2.messages.length - 1].content}\n`);

  // Exchange 3
  console.log("👤 User: What's my name?");

  const response3 = await app.invoke(
    { messages: [new HumanMessage("What's my name?")] },
    config
  );

  console.log(`🤖 Bot: ${response3.messages[response3.messages.length - 1].content}\n`);

  console.log("=".repeat(80));

  // Inspect memory
  console.log("\n📋 Memory Contents:\n");
  console.log(`Total messages in conversation: ${response3.messages.length}`);

  response3.messages.forEach((msg, i) => {
    const role = msg._getType() === "human" ? "User" : "Bot";
    const preview = String(msg.content).substring(0, 60);
    console.log(`${i + 1}. ${role}: ${preview}${String(msg.content).length > 60 ? "..." : ""}`);
  });

  console.log("\n💡 Buffer Memory Characteristics:");
  console.log("   - Stores ALL conversation messages");
  console.log("   - Perfect recall of entire history");
  console.log("   - Can become expensive with long conversations");
  console.log("   - May hit token limits");
}

main().catch(console.error);
