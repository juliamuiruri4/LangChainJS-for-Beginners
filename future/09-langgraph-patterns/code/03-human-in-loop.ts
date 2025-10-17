/**
 * Human-in-the-Loop with interrupt()
 * Run: npx tsx 09-langgraph-patterns/code/03-human-in-loop.ts
 */

import {
  StateGraph,
  START,
  END,
  Annotation,
  Command,
  interrupt,
  MemorySaver
} from "@langchain/langgraph";

const ApprovalState = Annotation.Root({
  request: Annotation<string>({
    reducer: (_, right) => right,
    default: () => ""
  }),
  approved: Annotation<boolean>({
    reducer: (_, right) => right,
    default: () => false
  }),
  result: Annotation<string>({
    reducer: (_, right) => right,
    default: () => ""
  })
});

async function main() {
  console.log("👤 Human-in-the-Loop with interrupt() Example\n");

  const workflow = new StateGraph(ApprovalState);

  // Node: Request approval using interrupt()
  workflow.addNode("requestApproval", async (state: typeof ApprovalState.State) => {
    console.log("\n📋 Request Details:");
    console.log(`   ${state.request}\n`);

    // Use interrupt() to pause execution and wait for human input
    const decision = interrupt({
      question: "Do you approve this request?",
      details: state.request,
      options: ["approve", "reject"]
    });

    // The interrupt() returns the human's decision
    // We can route to different paths based on this
    return { approved: decision === "approve" };
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

  // Build the graph
  // Type assertions: LangGraph's edge types don't perfectly match TypeScript's string inference
  workflow.addEdge(START, "requestApproval" as any);
  workflow.addConditionalEdges("requestApproval" as any, checkApproval, {
    execute: "execute",
    reject: "reject"
  } as any);
  workflow.addEdge("execute" as any, END);
  workflow.addEdge("reject" as any, END);

  // Compile with checkpointer for persistence during interrupts
  const checkpointer = new MemorySaver();
  const app = workflow.compile({ checkpointer });

  const requests = [
    "Deploy new version to production",
    "Delete user data for user ID 12345",
    "Send marketing email to all users"
  ];

  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];
    console.log("=".repeat(80));
    console.log(`\n🔔 New Request: ${request}`);

    const config = { configurable: { thread_id: `request-${i}` } };

    try {
      // Start the workflow
      let result = await app.invoke(
        {
          request,
          approved: false,
          result: ""
        },
        config
      );

      // Check if interrupted (using type assertion since interrupt API is new)
      const resultAny = result as any;
      if (resultAny.__interrupt__) {
        console.log("\n⏸️  Workflow paused for human approval");
        console.log(`   Question: ${resultAny.__interrupt__[0].value.question}`);
        console.log(`   Options: ${resultAny.__interrupt__[0].value.options.join(", ")}\n`);

        // In a real application, you would:
        // 1. Show this to a user in a UI
        // 2. Wait for their response
        // 3. Resume with: await app.invoke(null, { ...config, resumeValue: "approve" })

        // For this example, we'll automatically approve the first request
        const humanDecision = i === 0 ? "approve" : "reject";
        console.log(`   Human Decision: ${humanDecision}\n`);

        // Resume the workflow with the human's decision
        result = await app.invoke(new Command({ resume: humanDecision } as any), config);
      }

      console.log(`📊 Final Result: ${result.result}\n`);
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}\n`);
    }
  }

  console.log("=".repeat(80));
  console.log("\n💡 Human-in-the-Loop with interrupt() Benefits:");
  console.log("   - Pauses workflow execution at any point");
  console.log("   - Persists state during human review");
  console.log("   - Can resume from exactly where it paused");
  console.log("   - Supports async human input (hours/days later)");
  console.log("   - Production-ready pattern with checkpointing");
  console.log(
    "\n📚 Learn more: https://docs.langchain.com/oss/javascript/langgraph/add-human-in-the-loop\n"
  );
}

main().catch(console.error);
