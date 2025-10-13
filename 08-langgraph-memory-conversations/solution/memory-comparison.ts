/**
 * Chapter 8 Assignment Solution: Challenge 1
 * Memory Types Comparison
 *
 * Run: npx tsx 08-langgraph-memory-conversations/solution/memory-comparison.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, START, END, MemorySaver, MessagesAnnotation } from "@langchain/langgraph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import "dotenv/config";

async function main() {
  console.log("🔬 Memory Types Comparison\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Chatbot node
  const callModel = async (state: typeof MessagesAnnotation.State) => {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  };

  // Create workflow
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

  // Compile with MemorySaver (acts as buffer memory)
  const memory = new MemorySaver();
  const bufferApp = workflow.compile({ checkpointer: memory });

  // Test conversation
  const conversation = [
    "My name is Sam",
    "I love programming",
    "I work at TechCorp",
    "I have two cats",
    "I live in Boston",
  ];

  console.log("📝 Test Conversation:\n");
  conversation.forEach((msg, i) => console.log(`   ${i + 1}. "${msg}"`));
  console.log("\n" + "=".repeat(80) + "\n");

  // Test 1: Buffer Memory (stores all messages)
  console.log("🧪 Test 1: BUFFER MEMORY (stores everything)\n");
  console.log("─".repeat(80) + "\n");

  const bufferConfig = { configurable: { thread_id: "buffer-test" } };

  for (const msg of conversation) {
    await bufferApp.invoke({ messages: [new HumanMessage(msg)] }, bufferConfig);
  }

  const bufferResult = await bufferApp.invoke(
    { messages: [new HumanMessage("Tell me everything you know about me")] },
    bufferConfig
  );

  console.log(`Question: "Tell me everything you know about me"\n`);
  console.log(`Response: ${bufferResult.messages[bufferResult.messages.length - 1].content}\n`);
  console.log(`Total messages in memory: ${bufferResult.messages.length}\n`);
  console.log("─".repeat(80) + "\n");

  // Test 2: Window Memory (last 4 messages)
  console.log("🧪 Test 2: WINDOW MEMORY (last 4 messages only)\n");
  console.log("─".repeat(80) + "\n");

  const windowConfig = { configurable: { thread_id: "window-test" } };
  let windowMessages: any[] = [];

  for (const msg of conversation) {
    const response = await model.invoke([...windowMessages, new HumanMessage(msg)]);
    windowMessages.push(new HumanMessage(msg), new AIMessage(response.content.toString()));

    // Keep only last 4 messages (2 exchanges)
    if (windowMessages.length > 4) {
      windowMessages = windowMessages.slice(-4);
    }
  }

  const windowFinalResponse = await model.invoke([
    ...windowMessages,
    new HumanMessage("Tell me everything you know about me"),
  ]);

  console.log(`Question: "Tell me everything you know about me"\n`);
  console.log(`Response: ${windowFinalResponse.content}\n`);
  console.log(`Total messages in memory: ${windowMessages.length}\n`);
  console.log("─".repeat(80) + "\n");

  // Test 3: Summary Memory (summarizes old messages)
  console.log("🧪 Test 3: SUMMARY MEMORY (summarizes past conversations)\n");
  console.log("─".repeat(80) + "\n");

  let summaryContext = "";
  const recentMessages: any[] = [];

  for (let i = 0; i < conversation.length; i++) {
    const msg = conversation[i];
    const response = await model.invoke([
      ...(summaryContext ? [new HumanMessage(`Context: ${summaryContext}`)] : []),
      ...recentMessages,
      new HumanMessage(msg),
    ]);

    recentMessages.push(new HumanMessage(msg), new AIMessage(response.content.toString()));

    // After 3 exchanges, create summary
    if (recentMessages.length >= 6) {
      const summaryPrompt = `Summarize the key facts from this conversation in 1-2 sentences:\n${recentMessages
        .map((m) => `${m._getType()}: ${m.content}`)
        .join("\n")}`;

      const summary = await model.invoke(summaryPrompt);
      summaryContext = summary.content.toString();
      recentMessages.length = 0; // Clear recent messages
    }
  }

  const summaryFinalResponse = await model.invoke([
    ...(summaryContext ? [new HumanMessage(`Previous conversation summary: ${summaryContext}`)] : []),
    ...recentMessages,
    new HumanMessage("Tell me everything you know about me"),
  ]);

  console.log(`Question: "Tell me everything you know about me"\n`);
  console.log(`Response: ${summaryFinalResponse.content}\n`);
  console.log(`Summary stored: ${summaryContext.substring(0, 100)}...\n`);
  console.log(`Recent messages: ${recentMessages.length}\n`);
  console.log("─".repeat(80) + "\n");

  console.log("=".repeat(80));
  console.log("\n📊 COMPARISON ANALYSIS\n");
  console.log("Buffer Memory:");
  console.log("   ✓ Remembers EVERYTHING");
  console.log("   ✗ Can get expensive with long conversations");
  console.log("   ✓ Perfect recall");
  console.log("   ✗ May hit token limits\n");

  console.log("Window Memory:");
  console.log("   ✓ Fixed memory usage");
  console.log("   ✗ Forgets older information");
  console.log("   ✓ Good for short-term context");
  console.log("   ✗ Limited recall\n");

  console.log("Summary Memory:");
  console.log("   ✓ Efficient for long conversations");
  console.log("   ✓ Retains key information");
  console.log("   ✗ May lose some details");
  console.log("   ✓ Balanced approach\n");

  console.log("💡 Best Use Cases:");
  console.log("   - Buffer: Short, important conversations");
  console.log("   - Window: Real-time chat, recent context matters");
  console.log("   - Summary: Long sessions, key facts important");
}

main().catch(console.error);
