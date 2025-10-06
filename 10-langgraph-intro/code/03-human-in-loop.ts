/**
 * Example 3: Human-in-the-Loop
 *
 * Build a workflow that requests human approval before proceeding.
 *
 * Run: npx tsx 10-langgraph-intro/code/03-human-in-loop.ts
 */

import { StateGraph, END } from "@langchain/langgraph";
import readline from "readline";

interface ApprovalState {
  request: string;
  approved: boolean;
  result: string;
}

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

  const workflow = new StateGraph<ApprovalState>({
    channels: {
      request: { value: (_, right) => right, default: () => "" },
      approved: { value: (_, right) => right, default: () => false },
      result: { value: (_, right) => right, default: () => "" },
    },
  });

  // Node: Display request and ask for approval
  workflow.addNode("requestApproval", async (state: ApprovalState) => {
    console.log("\n📋 Request Details:");
    console.log(`   ${state.request}\n`);

    const answer = await askQuestion("❓ Do you approve this request? (yes/no): ");

    const approved = answer.toLowerCase() === "yes" || answer.toLowerCase() === "y";

    console.log(approved ? "\n✅ Approved!\n" : "\n❌ Rejected!\n");

    return { approved };
  });

  // Node: Execute approved request
  workflow.addNode("execute", async (state: ApprovalState) => {
    console.log("⚙️  Executing request...");
    const result = `✅ Successfully executed: ${state.request}`;
    console.log(`   ${result}\n`);
    return { result };
  });

  // Node: Reject request
  workflow.addNode("reject", async (state: ApprovalState) => {
    console.log("🚫 Rejecting request...");
    const result = `❌ Request rejected: ${state.request}`;
    console.log(`   ${result}\n`);
    return { result };
  });

  // Routing based on approval
  function checkApproval(state: ApprovalState): string {
    return state.approved ? "execute" : "reject";
  }

  // Build graph
  workflow.setEntryPoint("requestApproval");
  workflow.addConditionalEdges("requestApproval", checkApproval, {
    execute: "execute",
    reject: "reject",
  });
  workflow.addEdge("execute", END);
  workflow.addEdge("reject", END);

  const app = workflow.compile();

  // Test scenarios
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
