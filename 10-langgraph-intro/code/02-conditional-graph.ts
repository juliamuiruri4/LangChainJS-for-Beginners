/**
 * Example 2: Conditional Graph
 *
 * Build a graph with branching logic based on state.
 *
 * Run: npx tsx 10-langgraph-intro/code/02-conditional-graph.ts
 */

import { StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

interface WorkflowState {
  question: string;
  category: string;
  answer: string;
}

async function main() {
  console.log("🌿 Conditional Graph Example\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    temperature: 0,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  const workflow = new StateGraph<WorkflowState>({
    channels: {
      question: { value: (_, right) => right, default: () => "" },
      category: { value: (_, right) => right, default: () => "" },
      answer: { value: (_, right) => right, default: () => "" },
    },
  });

  // Node: Categorize the question
  workflow.addNode("categorize", async (state: WorkflowState) => {
    console.log("1️⃣  Categorizing question...");

    const prompt = `Categorize this question as either "technical" or "general":

    Question: "${state.question}"

    Answer with just one word: technical or general`;

    const response = await model.invoke(prompt);
    const category = response.content.toString().toLowerCase().includes("technical")
      ? "technical"
      : "general";

    console.log(`   Category: ${category}\n`);

    return { category };
  });

  // Node: Handle technical questions
  workflow.addNode("handleTechnical", async (state: WorkflowState) => {
    console.log("2️⃣  Handling as technical question...");

    const answer = `Technical answer: ${state.question} - This requires specialized knowledge.`;
    console.log(`   ${answer}\n`);

    return { answer };
  });

  // Node: Handle general questions
  workflow.addNode("handleGeneral", async (state: WorkflowState) => {
    console.log("2️⃣  Handling as general question...");

    const response = await model.invoke(state.question);
    const answer = response.content.toString();
    console.log(`   ${answer}\n`);

    return { answer };
  });

  // Routing function
  function route(state: WorkflowState): string {
    return state.category === "technical" ? "handleTechnical" : "handleGeneral";
  }

  // Build the graph
  workflow.setEntryPoint("categorize");
  workflow.addConditionalEdges("categorize", route, {
    technical: "handleTechnical",
    general: "handleGeneral",
  });
  workflow.addEdge("handleTechnical", END);
  workflow.addEdge("handleGeneral", END);

  const app = workflow.compile();

  // Test with different questions
  const questions = [
    "How do I implement binary search in Python?",
    "What's the weather like today?",
    "Explain quantum entanglement",
    "What time is it?",
  ];

  for (const question of questions) {
    console.log("=".repeat(80));
    console.log(`\n❓ Question: ${question}\n`);

    const result = await app.invoke({ question, category: "", answer: "" });

    console.log(`✅ Category: ${result.category}`);
    console.log(`✅ Answer: ${result.answer}\n`);
  }

  console.log("=".repeat(80));
  console.log("\n💡 Conditional Graph Features:");
  console.log("   - Branching based on state");
  console.log("   - Different paths for different inputs");
  console.log("   - Routing function decides next node");
  console.log("   - Flexible and dynamic");
}

main().catch(console.error);
