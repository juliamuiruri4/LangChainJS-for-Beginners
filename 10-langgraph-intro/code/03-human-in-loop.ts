/**
 * Human-in-the-Loop
 * Run: npx tsx 10-langgraph-intro/code/03-human-in-loop.ts
 */

import { StateGraph, END, Annotation } from "@langchain/langgraph";
import readline from "readline";
const ApprovalState = Annotation.Root({
  request: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
  approved: Annotation<boolean>({
    reducer: (_, right) => right,
    default: () => false,
  }),
  result: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
});

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log("👤 Human-in-the-Loop Example\n");

  const workflow = new StateGraph(ApprovalState);

  // Node: Display request and ask for approval
  workflow.addNode("requestApproval", async (state: typeof ApprovalState.State) => {
    console.log("\n📋 Request Details:");
    console.log(`   ${state.request}\n`);

    const answer = await askQuestion("❓ Do you approve this request? (yes/no): ");

    const approved = answer.toLowerCase() === "yes" || answer.toLowerCase() === "y";

    console.log(approved ? "\n✅ Approved!\n" : "\n❌ Rejected!\n");

    return { approved };
  });

  // Node: Execute approved request
  workflow.addNode("execute", async (state: typeof ApprovalState.State) => {
    console.log("⚙️  Executing request...");
    const result = `✅ Successfully executed: ${state.request}`;
    console.log(`   ${result}\n`);
    return { result };
  });

  // Node: Reject request
  workflow.addNode("reject", async (state: typeof ApprovalState.State) => {
    console.log("🚫 Rejecting request...");
    const result = `❌ Request rejected: ${state.request}`;
    console.log(`   ${result}\n`);
    return { result };
  });

  // Routing based on approval
  function checkApproval(state: typeof ApprovalState.State): string {
    return state.approved ? "execute" : "reject";
  }

  // Type assertions: LangGraph's edge types don't perfectly match TypeScript's string inference
  workflow.addEdge("__start__" as any, "requestApproval" as any);
  workflow.addConditionalEdges("requestApproval" as any, checkApproval, {
    execute: "execute",
    reject: "reject",
  } as any);
  workflow.addEdge("execute" as any, END);
  workflow.addEdge("reject" as any, END);

  const app = workflow.compile();
  const requests = [
    "Deploy new version to production",
    "Delete user data for user ID 12345",
    "Send marketing email to all users",
  ];

  for (const request of requests) {
    console.log("=".repeat(80));
    console.log(`\n🔔 New Request: ${request}`);

    const result = await app.invoke({
      request,
      approved: false,
      result: "",
    });

    console.log(`📊 Final Result: ${result.result}\n`);
  }

  console.log("=".repeat(80));
  console.log("\n💡 Human-in-the-Loop Benefits:");
  console.log("   - Critical decisions require human approval");
  console.log("   - Prevents automated errors");
  console.log("   - Audit trail of approvals");
  console.log("   - Control over sensitive operations");
}

main().catch(console.error);
