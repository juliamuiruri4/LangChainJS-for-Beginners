/**
 * Chapter 10 Assignment Solution: Bonus Challenge
 * Multi-Agent Collaboration Graph
 *
 * Run: npx tsx 10-production-best-practices/solution/multi-agent-collab.ts
 */

import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const CollaborationState = Annotation.Root({
  task: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
  plan: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
  researchFindings: Annotation<string[]>({
    reducer: (left, right) => [...left, ...right],
    default: () => [],
  }),
  analysis: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
  finalReport: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
  status: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "planning",
  }),
});

async function main() {
  console.log("🤝 Multi-Agent Collaboration System\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-5-mini",
    temperature: 0.7,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  const workflow = new StateGraph(CollaborationState);

  // Agent 1: Planner
  workflow.addNode("planner", async (state: typeof CollaborationState.State) => {
    console.log("1️⃣  PLANNER: Creating project plan...");

    const prompt = `You are a project planner. Break down this task into 2-3 subtasks:

Task: ${state.task}

Provide a brief plan with numbered subtasks.`;

    const response = await model.invoke(prompt);
    const plan = response.content.toString();

    console.log(`   Plan created:\n   ${plan.split("\n").join("\n   ")}\n`);

    return { plan, status: "researching" };
  });

  // Agent 2: Researcher
  workflow.addNode("researcher", async (state: typeof CollaborationState.State) => {
    console.log("2️⃣  RESEARCHER: Gathering information...");

    // Parse plan to extract subtasks
    const subtasks = state.plan
      .split("\n")
      .filter((line) => /^\d+\./.test(line.trim()))
      .slice(0, 2); // Research first 2 subtasks

    const findings: string[] = [];

    for (const subtask of subtasks) {
      const prompt = `Provide 1-2 sentences of information about: ${subtask}`;
      const response = await model.invoke(prompt);
      findings.push(`${subtask}: ${response.content.toString()}`);
      console.log(`   Researched: ${subtask.substring(0, 50)}...`);
    }

    console.log(`   Collected ${findings.length} research findings\n`);

    return { researchFindings: findings, status: "analyzing" };
  });

  // Agent 3: Analyst
  workflow.addNode("analyst", async (state: typeof CollaborationState.State) => {
    console.log("3️⃣  ANALYST: Analyzing findings...");

    const prompt = `Analyze these research findings and identify key insights:

${state.researchFindings.join("\n\n")}

Provide a brief analysis highlighting the most important points.`;

    const response = await model.invoke(prompt);
    const analysis = response.content.toString();

    console.log(`   Analysis complete\n`);

    return { analysis, status: "writing" };
  });

  // Agent 4: Writer
  workflow.addNode("writer", async (state: typeof CollaborationState.State) => {
    console.log("4️⃣  WRITER: Compiling final report...");

    const prompt = `Create a professional report based on:

Task: ${state.task}
Plan: ${state.plan}
Analysis: ${state.analysis}

Format as a brief executive summary with Introduction, Key Findings, and Conclusion sections.`;

    const response = await model.invoke(prompt);
    const report = response.content.toString();

    console.log("   Report compiled\n");

    return { finalReport: report, status: "complete" };
  });

  // Router
  function routeByStatus(state: typeof CollaborationState.State): string {
    switch (state.status) {
      case "planning":
        return "planner";
      case "researching":
        return "researcher";
      case "analyzing":
        return "analyst";
      case "writing":
        return "writer";
      default:
        return END;
    }
  }

  // Build graph
  workflow.addEdge("__start__" as any, "planner" as any);
  workflow.addEdge("planner" as any, "researcher" as any);
  workflow.addEdge("researcher" as any, "analyst" as any);
  workflow.addEdge("analyst" as any, "writer" as any);
  workflow.addEdge("writer" as any, END);

  const app = workflow.compile();

  // Test tasks
  const tasks = [
    "Research and analyze the benefits of TypeScript for large-scale applications",
    "Investigate the impact of microservices architecture on development teams",
  ];

  for (const task of tasks) {
    console.log("=".repeat(80));
    console.log(`\n📋 Task: ${task}\n`);
    console.log("─".repeat(80) + "\n");

    const result = await app.invoke({
      task,
      plan: "",
      researchFindings: [],
      analysis: "",
      finalReport: "",
      status: "planning",
    });

    console.log("─".repeat(80));
    console.log("\n📄 FINAL REPORT:\n");
    console.log(result.finalReport);
    console.log("\n" + "=".repeat(80) + "\n");

    console.log("📊 Collaboration Summary:");
    console.log(
      `   ✓ Planner: Created ${result.plan.split("\n").filter((l: string) => l.trim()).length}-point plan`
    );
    console.log(`   ✓ Researcher: Collected ${result.researchFindings.length} findings`);
    console.log(`   ✓ Analyst: Provided key insights`);
    console.log(`   ✓ Writer: Compiled final report\n`);
  }

  console.log("=".repeat(80));
  console.log("\n💡 Multi-Agent Collaboration Features:");
  console.log("   ✓ 4 specialized agents (Planner, Researcher, Analyst, Writer)");
  console.log("   ✓ Sequential workflow with state passing");
  console.log("   ✓ Each agent builds on previous work");
  console.log("   ✓ Coordinated task execution");
  console.log("   ✓ Professional output formatting");
  console.log("   ✓ Scalable agent architecture");
}

main().catch(console.error);
