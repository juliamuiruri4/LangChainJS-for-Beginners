/**
 * Window Memory with LangGraph
 * Run: npx tsx 08-langgraph-memory-conversations/code/02-window-memory.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, START, END, MemorySaver, MessagesAnnotation } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { trimMessages } from "@langchain/core/messages";
import "dotenv/config";

async function main() {
  console.log("🪟 Window Memory Example\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Keep only last 4 messages (2 exchanges)
  const trimmer = trimMessages({
    maxTokens: 200,
    strategy: "last",
    tokenCounter: model,
  });

  // Define the chatbot node with message trimming
  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const trimmedMessages = await trimmer.invoke(state.messages);
    const response = await model.invoke(trimmedMessages);
    return { messages: [response] };
  };

  // Create workflow with memory
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

  // Compile with MemorySaver
  const memory = new MemorySaver();
  const app = workflow.compile({ checkpointer: memory });

  console.log("🗣️  Having a longer conversation...\n");
  console.log("(Window size: ~200 tokens - last 2 exchanges)\n");
  console.log("=".repeat(80));

  const config = { configurable: { thread_id: "conversation-2" } };

  // Exchange 1
  console.log("\n1️⃣  User: My favorite color is blue.");
  await app.invoke(
    { messages: [new HumanMessage("My favorite color is blue.")] },
    config
  );

  // Exchange 2
  console.log("2️⃣  User: I have a dog named Max.");
  await app.invoke(
    { messages: [new HumanMessage("I have a dog named Max.")] },
    config
  );

  // Exchange 3
  console.log("3️⃣  User: I work as a software engineer.");
  await app.invoke(
    { messages: [new HumanMessage("I work as a software engineer.")] },
    config
  );

  // Exchange 4
  console.log("4️⃣  User: I live in Seattle.");
  await app.invoke(
    { messages: [new HumanMessage("I live in Seattle.")] },
    config
  );

  // Now test memory - should only remember last 2 exchanges
  console.log("\n" + "=".repeat(80));
  console.log("\n🧪 Testing Memory:\n");

  console.log("❓ Question: What's my favorite color?");
  const response1 = await app.invoke(
    { messages: [new HumanMessage("What's my favorite color?")] },
    config
  );
  console.log(`🤖 ${response1.messages[response1.messages.length - 1].content}`);
  console.log("   (This was mentioned 4 exchanges ago - likely forgotten)\n");

  console.log("❓ Question: Where do I live?");
  const response2 = await app.invoke(
    { messages: [new HumanMessage("Where do I live?")] },
    config
  );
  console.log(`🤖 ${response2.messages[response2.messages.length - 1].content}`);
  console.log("   (This was recent - should remember)\n");

  console.log("❓ Question: What's my job?");
  const response3 = await app.invoke(
    { messages: [new HumanMessage("What's my job?")] },
    config
  );
  console.log(`🤖 ${response3.messages[response3.messages.length - 1].content}`);
  console.log("   (This was recent - should remember)\n");

  console.log("=".repeat(80));
  console.log("\n💡 Window Memory Characteristics:");
  console.log("   - Keeps only last K messages");
  console.log("   - Fixed memory size (good for token limits)");
  console.log("   - Forgets older context");
  console.log("   - Perfect for long conversations");
}

main().catch(console.error);
