/**
 * Summary Memory with LangGraph
 * Run: npx tsx 08-langgraph-memory-conversations/code/03-summary-memory.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, START, END, MemorySaver, Annotation } from "@langchain/langgraph";
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import "dotenv/config";

const ConversationState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (left, right) => left.concat(right),
    default: () => [],
  }),
  summary: Annotation<string>({
    reducer: (_, right) => right ?? "",
    default: () => "",
  }),
});

async function main() {
  console.log("📝 Summary Memory Example\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Node to summarize old messages
  const summarizeConversation = async (state: typeof ConversationState.State) => {
    if (state.messages.length < 6) {
      // Not enough messages to summarize yet
      return {};
    }

    // Summarize messages except the last 2 exchanges
    const messagesToSummarize = state.messages.slice(0, -4);
    const recentMessages = state.messages.slice(-4);

    const summaryPrompt = `Provide a concise summary of the following conversation:

${messagesToSummarize.map(m => `${m._getType()}: ${m.content}`).join('\n')}

Summary:`;

    const summaryResponse = await model.invoke([new HumanMessage(summaryPrompt)]);
    const summary = String(summaryResponse.content);

    return {
      summary,
      messages: recentMessages,
    };
  };

  // Node to handle conversation
  const callModel = async (state: typeof ConversationState.State) => {
    const contextMessages: BaseMessage[] = [];

    // Add summary as context if exists
    if (state.summary) {
      contextMessages.push(new SystemMessage(`Previous conversation summary: ${state.summary}`));
    }

    // Add recent messages
    contextMessages.push(...state.messages);

    const response = await model.invoke(contextMessages);
    return { messages: [response] };
  };

  // Create workflow with conditional summarization
  const workflow = new StateGraph(ConversationState)
    .addNode("summarize", summarizeConversation)
    .addNode("model", callModel)
    .addEdge(START, "summarize")
    .addEdge("summarize", "model")
    .addEdge("model", END);

  const memory = new MemorySaver();
  const app = workflow.compile({ checkpointer: memory });

  console.log("🗣️  Having a detailed conversation...\n");
  console.log("=".repeat(80));

  const config = { configurable: { thread_id: "conversation-3" } };

  const isCI = process.env.CI === "true";

  // Have a conversation with lots of details
  const exchanges = isCI
    ? [
        // Reduced for CI mode
        "I'm planning a trip to Japan next month for two weeks.",
        "I want to visit Tokyo, Kyoto, and Osaka during my trip.",
        "I'm particularly interested in visiting traditional temples and trying authentic Japanese cuisine.",
      ]
    : [
        "I'm planning a trip to Japan next month for two weeks.",
        "I want to visit Tokyo, Kyoto, and Osaka during my trip.",
        "I'm particularly interested in visiting traditional temples and trying authentic Japanese cuisine.",
        "I'm also excited about experiencing both modern technology districts and historical sites.",
        "My budget is around $3000 for the entire trip, including flights and accommodation.",
      ];

  for (let i = 0; i < exchanges.length; i++) {
    console.log(`\n${i + 1}️⃣  User: ${exchanges[i]}`);

    const response = await app.invoke(
      { messages: [new HumanMessage(exchanges[i])] },
      config
    );

    console.log(`   🤖 Bot: ${response.messages[response.messages.length - 1].content}\n`);
  }

  console.log("=".repeat(80));

  // Check the summary
  console.log("\n📋 Conversation State:\n");
  console.log(`Recent messages: ${exchanges.length * 2} messages`);
  console.log(`Summary: ${exchanges.length >= 3 ? "Generated" : "Not yet"}\n`);

  console.log("=" .repeat(80));
  console.log("\n🧪 Testing Summary Memory:\n");

  console.log("❓ Based on our conversation, where am I traveling to and what am I interested in?");
  const response = await app.invoke(
    { messages: [new HumanMessage("Based on our conversation, where am I traveling to and what am I interested in?")] },
    config
  );
  console.log(`🤖 ${response.messages[response.messages.length - 1].content}\n`);

  console.log("=".repeat(80));
  console.log("\n💡 Summary Memory Characteristics:");
  console.log("   - Summarizes old conversations");
  console.log("   - Keeps recent messages verbatim");
  console.log("   - Balances context retention and token usage");
  console.log("   - Great for very long conversations");
  console.log("   - May lose some details in summarization");
}

main().catch(console.error);
