/**
 * Simple Linear Graph
 * Run: npx tsx 09-langgraph-patterns/code/01-simple-graph.ts
 */

import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { BaseMessage } from "langchain";
const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (left, right) => left.concat(right),
    default: () => [],
  }),
  step: Annotation<string>({
    reducer: (left, right) => right ?? left ?? "",
    default: () => "",
  }),
  data: Annotation<string | undefined>({
    reducer: (left, right) => right ?? left,
    default: () => undefined,
  }),
});

async function main() {
  console.log("📊 Simple Linear Graph Example\n");

  // Create the graph
  const workflow = new StateGraph(AgentState);

  // Node 1: Initialize
  workflow.addNode("initialize", async (state: typeof AgentState.State) => {
    console.log("1️⃣  Initializing...");
    return {
      step: "initialized",
      data: "Starting process",
    };
  });

  // Node 2: Process
  workflow.addNode("process", async (state: typeof AgentState.State) => {
    console.log("2️⃣  Processing data...");
    return {
      step: "processed",
      data: `${state.data} -> Processed`,
    };
  });

  // Node 3: Finalize
  workflow.addNode("finalize", async (state: typeof AgentState.State) => {
    console.log("3️⃣  Finalizing...");
    return {
      step: "completed",
      data: `${state.data} -> Completed`,
    };
  });

  // Type assertions: LangGraph's edge types don't perfectly match TypeScript's string inference
  workflow.addEdge("__start__" as any, "initialize" as any);
  workflow.addEdge("initialize" as any, "process" as any);
  workflow.addEdge("process" as any, "finalize" as any);
  workflow.addEdge("finalize" as any, END);
  const app = workflow.compile();

  console.log("▶️  Running workflow...\n");
  console.log("=".repeat(80) + "\n");

  const result = await app.invoke({
    messages: [],
    step: "",
  });

  console.log("\n" + "=".repeat(80));
  console.log("\n✅ Workflow Complete!");
  console.log(`   Final step: ${result.step}`);
  console.log(`   Final data: ${result.data}`);

  console.log("\n💡 Linear Graph Characteristics:");
  console.log("   - Sequential execution (A → B → C)");
  console.log("   - State flows through nodes");
  console.log("   - Simple and predictable");
  console.log("   - Good for straight-line workflows");
}

main().catch(console.error);
