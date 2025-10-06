/**
 * Example 1: Simple Linear Graph
 *
 * Build a basic LangGraph workflow with sequential steps.
 *
 * Run: npx tsx 10-langgraph-intro/code/01-simple-graph.ts
 */

import { StateGraph, END } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

// Define the state
interface AgentState {
  messages: BaseMessage[];
  step: string;
  data?: string;
}

async function main() {
  console.log("📊 Simple Linear Graph Example\n");

  // Create the graph
  const workflow = new StateGraph<AgentState>({
    channels: {
      messages: {
        value: (left: BaseMessage[], right: BaseMessage[]) => left.concat(right),
        default: () => [],
      },
      step: {
        value: (left?: string, right?: string) => right ?? left ?? "",
        default: () => "",
      },
      data: {
        value: (left?: string, right?: string) => right ?? left,
        default: () => undefined,
      },
    },
  });

  // Node 1: Initialize
  workflow.addNode("initialize", async (state: AgentState) => {
    console.log("1️⃣  Initializing...");
    return {
      step: "initialized",
      data: "Starting process",
    };
  });

  // Node 2: Process
  workflow.addNode("process", async (state: AgentState) => {
    console.log("2️⃣  Processing data...");
    return {
      step: "processed",
      data: `${state.data} -> Processed`,
    };
  });

  // Node 3: Finalize
  workflow.addNode("finalize", async (state: AgentState) => {
    console.log("3️⃣  Finalizing...");
    return {
      step: "completed",
      data: `${state.data} -> Completed`,
    };
  });

  // Add edges (connections)
  workflow.addEdge("initialize", "process");
  workflow.addEdge("process", "finalize");
  workflow.addEdge("finalize", END);

  // Set entry point
  workflow.setEntryPoint("initialize");

  // Compile and run
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
