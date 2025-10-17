/**
 * Chapter 10 Assignment Solution: Challenge 2
 * Content Approval Workflow
 *
 * Run: npx tsx 10-production-best-practices/solution/content-approval.ts
 */

import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const ContentState = Annotation.Root({
  content: Annotation<string>({
    reducer: (_, right) => right,
    default: () => ""
  }),
  issues: Annotation<string[]>({
    reducer: (_, right) => right,
    default: () => []
  }),
  revisionCount: Annotation<number>({
    reducer: (_, right) => right,
    default: () => 0
  }),
  approved: Annotation<boolean>({
    reducer: (_, right) => right,
    default: () => false
  }),
  status: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "draft"
  }),
  humanApproval: Annotation<boolean>({
    reducer: (_, right) => right,
    default: () => false
  })
});

const REQUIRED_KEYWORDS = ["javascript", "typescript", "programming"];
const MIN_LENGTH = 100;
const MAX_LENGTH = 500;
const MAX_REVISIONS = 3;

async function main() {
  console.log("✅ Content Approval Workflow\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    temperature: 0,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined
    },
    apiKey: process.env.AI_API_KEY
  });

  const workflow = new StateGraph(ContentState);

  // Node 1: Auto-check content
  workflow.addNode("auto_check", async (state: typeof ContentState.State) => {
    console.log("1️⃣  Running automated checks...");

    const issues: string[] = [];

    // Length validation
    if (state.content.length < MIN_LENGTH) {
      issues.push(`Content too short (${state.content.length} < ${MIN_LENGTH} characters)`);
    }
    if (state.content.length > MAX_LENGTH) {
      issues.push(`Content too long (${state.content.length} > ${MAX_LENGTH} characters)`);
    }

    // Required keywords check
    const contentLower = state.content.toLowerCase();
    const missingKeywords = REQUIRED_KEYWORDS.filter((keyword) => !contentLower.includes(keyword));
    if (missingKeywords.length > 0) {
      issues.push(`Missing required keywords: ${missingKeywords.join(", ")}`);
    }

    // Grammar check (simple)
    if (!/[.!?]$/.test(state.content.trim())) {
      issues.push("Content should end with proper punctuation");
    }

    console.log(`   Found ${issues.length} issue(s)\n`);

    return {
      issues,
      status: issues.length > 0 ? "needs_revision" : "passed_checks"
    };
  });

  // Node 2: Suggest edits
  workflow.addNode("suggest_edits", async (state: typeof ContentState.State) => {
    console.log("2️⃣  Suggesting edits...");
    console.log(`   Issues found: ${state.issues.join(", ")}\n`);

    return {
      revisionCount: state.revisionCount + 1,
      status: "revision_suggested"
    };
  });

  // Node 3: Request human approval
  workflow.addNode("human_approval", async (state: typeof ContentState.State) => {
    console.log("3️⃣  Requesting human approval...");

    // Simulate human approval (in real app, this would wait for human input)
    const autoApprove = process.env.CI === "true" || Math.random() > 0.3;

    if (autoApprove) {
      console.log("   ✅ Approved by reviewer\n");
      return { humanApproval: true, approved: true, status: "approved" };
    } else {
      console.log("   ❌ Rejected by reviewer\n");
      return { humanApproval: false, status: "rejected" };
    }
  });

  // Node 4: Publish
  workflow.addNode("publish", async (state: typeof ContentState.State) => {
    console.log("4️⃣  Publishing content...");
    console.log("   ✅ Content published successfully!\n");

    return { status: "published" };
  });

  // Routing functions
  function routeAfterCheck(state: typeof ContentState.State): string {
    if (state.issues.length === 0) {
      return "human_approval";
    }
    if (state.revisionCount >= MAX_REVISIONS) {
      console.log(`   ⚠️ Max revisions (${MAX_REVISIONS}) reached\n`);
      return END;
    }
    return "suggest_edits";
  }

  function routeAfterApproval(state: typeof ContentState.State): string {
    if (state.humanApproval) {
      return "publish";
    }
    if (state.revisionCount >= MAX_REVISIONS) {
      return END;
    }
    return "suggest_edits";
  }

  // Build graph
  workflow.addEdge("__start__" as any, "auto_check" as any);

  workflow.addConditionalEdges("auto_check" as any, routeAfterCheck, {
    human_approval: "human_approval",
    suggest_edits: "suggest_edits",
    __end__: END
  } as any);

  workflow.addEdge("suggest_edits" as any, "auto_check" as any); // Loop back for revision

  workflow.addConditionalEdges("human_approval" as any, routeAfterApproval, {
    publish: "publish",
    suggest_edits: "suggest_edits",
    __end__: END
  } as any);

  workflow.addEdge("publish" as any, END);

  const app = workflow.compile();

  // Test content samples
  const testContent = [
    {
      name: "Valid Content",
      content:
        "JavaScript and TypeScript are powerful programming languages for web development. TypeScript adds static typing to JavaScript, making code more maintainable and catching errors early. Modern programming with these languages enables building robust applications."
    },
    {
      name: "Too Short",
      content: "JavaScript is great for programming."
    },
    {
      name: "Missing Keywords",
      content:
        "This is a long article about web development and modern software engineering practices. It covers various aspects of building applications in today's world. Development teams use various tools and frameworks."
    }
  ];

  for (const test of testContent) {
    console.log("=".repeat(80));
    console.log(`\n📄 Content: ${test.name}\n`);
    console.log("─".repeat(80) + "\n");

    const result = await app.invoke({
      content: test.content,
      issues: [],
      revisionCount: 0,
      approved: false,
      status: "draft",
      humanApproval: false
    });

    console.log("─".repeat(80));
    console.log("\n📊 Final Status:");
    console.log(`   Status: ${result.status.toUpperCase()}`);
    console.log(`   Revisions: ${result.revisionCount}`);
    console.log(`   Approved: ${result.approved ? "Yes" : "No"}`);

    if (result.issues.length > 0) {
      console.log(`   Issues: ${result.issues.join("; ")}`);
    }
    console.log();
  }

  console.log("=".repeat(80));
  console.log("\n💡 Content Approval Features:");
  console.log("   ✓ Automated quality checks (length, keywords, grammar)");
  console.log("   ✓ Revision loop with max attempts");
  console.log("   ✓ Human approval requirement");
  console.log("   ✓ Revision history tracking");
  console.log("   ✓ Conditional workflow routing");
}

main().catch(console.error);
