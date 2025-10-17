/**
 * Conditional Graph
 * Run: npx tsx 09-langgraph-patterns/code/02-conditional-graph.ts
 */

import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";
const WorkflowState = Annotation.Root({
  question: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
  category: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
  answer: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
});

async function main() {
  console.log("🌿 Conditional Graph Example\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    temperature: 0,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  const workflow = new StateGraph(WorkflowState);

  // Node: Categorize the question
  workflow.addNode("categorize", async (state: typeof WorkflowState.State) => {
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
  workflow.addNode("handleTechnical", async (state: typeof WorkflowState.State) => {
    console.log("2️⃣  Handling as technical question...");

    const answer = `Technical answer: ${state.question} - This requires specialized knowledge.`;
    console.log(`   ${answer}\n`);

    return { answer };
  });

  // Node: Handle general questions
  workflow.addNode("handleGeneral", async (state: typeof WorkflowState.State) => {
    console.log("2️⃣  Handling as general question...");

    const response = await model.invoke(state.question);
    const answer = response.content.toString();
    console.log(`   ${answer}\n`);

    return { answer };
  });

  // Routing function
  function route(state: typeof WorkflowState.State): string {
    return state.category === "technical" ? "handleTechnical" : "handleGeneral";
  }

  // Type assertions: LangGraph's edge types don't perfectly match TypeScript's string inference
  workflow.addEdge("__start__" as any, "categorize" as any);
  workflow.addConditionalEdges("categorize" as any, route, {
    handleTechnical: "handleTechnical",
    handleGeneral: "handleGeneral",
  } as any);
  workflow.addEdge("handleTechnical" as any, END);
  workflow.addEdge("handleGeneral" as any, END);

  const app = workflow.compile();
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
