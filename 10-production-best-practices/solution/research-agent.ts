/**
 * Chapter 10 Assignment Solution: Challenge 3
 * Research Agent Workflow (Iterative)
 *
 * Run: npx tsx 10-production-best-practices/solution/research-agent.ts
 */

import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const ResearchState = Annotation.Root({
  question: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
  searchCount: Annotation<number>({
    reducer: (_, right) => right,
    default: () => 0,
  }),
  searchResults: Annotation<string[]>({
    reducer: (left, right) => [...left, ...right],
    default: () => [],
  }),
  needsMoreInfo: Annotation<boolean>({
    reducer: (_, right) => right,
    default: () => true,
  }),
  finalAnswer: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
});

const MAX_SEARCHES = 3;

// Simulated knowledge base
const knowledgeBase: Record<string, string[]> = {
  typescript: [
    "TypeScript is a typed superset of JavaScript developed by Microsoft in 2012.",
    "TypeScript adds static typing, interfaces, and enhanced IDE support to JavaScript.",
    "TypeScript compiles to plain JavaScript and is widely used in large-scale applications.",
  ],
  react: [
    "React is a JavaScript library for building user interfaces, created by Facebook.",
    "React uses a component-based architecture and virtual DOM for efficient rendering.",
    "React hooks like useState and useEffect enable state and side effects in functional components.",
  ],
  nodejs: [
    "Node.js is a JavaScript runtime built on Chrome's V8 engine, released in 2009.",
    "Node.js enables server-side JavaScript with event-driven, non-blocking I/O.",
    "Node.js has a rich ecosystem with npm, the largest package registry.",
  ],
};

function simulateSearch(query: string, searchNum: number): string {
  const lowerQuery = query.toLowerCase();

  // Find matching topic
  for (const [topic, facts] of Object.entries(knowledgeBase)) {
    if (lowerQuery.includes(topic)) {
      const index = (searchNum - 1) % facts.length;
      return `Search ${searchNum}: ${facts[index]}`;
    }
  }

  return `Search ${searchNum}: General information about ${query}`;
}

async function main() {
  console.log("🔬 Research Agent Workflow\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    temperature: 0.7,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  const workflow = new StateGraph(ResearchState);

  // Node 1: Analyze question
  workflow.addNode("analyze", async (state: typeof ResearchState.State) => {
    console.log("1️⃣  Analyzing question...");

    const complexKeywords = ["compare", "analyze", "explain in detail", "history of"];
    const needsResearch = complexKeywords.some((keyword) => state.question.toLowerCase().includes(keyword));

    console.log(`   Needs research: ${needsResearch}\n`);

    return { needsMoreInfo: needsResearch };
  });

  // Node 2: Perform search
  workflow.addNode("search", async (state: typeof ResearchState.State) => {
    const searchNum = state.searchCount + 1;
    console.log(`2️⃣  Performing search ${searchNum}/${MAX_SEARCHES}...`);

    const searchResult = simulateSearch(state.question, searchNum);
    console.log(`   ${searchResult}\n`);

    return {
      searchCount: searchNum,
      searchResults: [searchResult],
    };
  });

  // Node 3: Evaluate if more research needed
  workflow.addNode("evaluate", async (state: typeof ResearchState.State) => {
    console.log("3️⃣  Evaluating research completeness...");

    // Check if we have enough information
    const hasEnoughInfo = state.searchResults.length >= 2 || state.searchCount >= MAX_SEARCHES;

    console.log(`   Search count: ${state.searchCount}/${MAX_SEARCHES}`);
    console.log(`   Results collected: ${state.searchResults.length}`);
    console.log(`   Sufficient info: ${hasEnoughInfo}\n`);

    return { needsMoreInfo: !hasEnoughInfo };
  });

  // Node 4: Generate answer
  workflow.addNode("generate_answer", async (state: typeof ResearchState.State) => {
    console.log("4️⃣  Generating final answer...");

    const context = state.searchResults.join("\n");

    const prompt = `Based on the following research results, answer this question comprehensively:

Question: ${state.question}

Research Results:
${context}

Provide a clear, well-structured answer that synthesizes the research findings.`;

    const response = await model.invoke(prompt);
    console.log("   Answer generated\n");

    return { finalAnswer: response.content.toString() };
  });

  // Routing functions
  function routeAfterAnalyze(state: typeof ResearchState.State): string {
    return state.needsMoreInfo ? "search" : "generate_answer";
  }

  function routeAfterEvaluate(state: typeof ResearchState.State): string {
    if (state.needsMoreInfo && state.searchCount < MAX_SEARCHES) {
      return "search"; // Continue searching
    }
    return "generate_answer";
  }

  // Build graph
  workflow.addEdge("__start__" as any, "analyze" as any);

  workflow.addConditionalEdges("analyze" as any, routeAfterAnalyze, {
    search: "search",
    generate_answer: "generate_answer",
  } as any);

  workflow.addEdge("search" as any, "evaluate" as any);

  workflow.addConditionalEdges("evaluate" as any, routeAfterEvaluate, {
    search: "search",
    generate_answer: "generate_answer",
  } as any);

  workflow.addEdge("generate_answer" as any, END);

  const app = workflow.compile();

  // Test questions
  const questions = [
    "What is TypeScript?",
    "Compare and analyze React and its component architecture in detail",
    "Tell me about Node.js",
  ];

  for (const question of questions) {
    console.log("=".repeat(80));
    console.log(`\n❓ Question: "${question}"\n`);
    console.log("─".repeat(80) + "\n");

    const result = await app.invoke({
      question,
      searchCount: 0,
      searchResults: [],
      needsMoreInfo: true,
      finalAnswer: "",
    });

    console.log("─".repeat(80));
    console.log("\n📊 Research Summary:");
    console.log(`   Total searches: ${result.searchCount}`);
    console.log(`   Results collected: ${result.searchResults.length}`);
    console.log();
    console.log("✅ Final Answer:");
    console.log(`   ${result.finalAnswer}\n`);
  }

  console.log("=".repeat(80));
  console.log("\n💡 Research Agent Features:");
  console.log("   ✓ Decides when research is needed");
  console.log("   ✓ Iterative search (up to 3 attempts)");
  console.log("   ✓ Evaluates information completeness");
  console.log("   ✓ Combines multiple sources");
  console.log("   ✓ Generates comprehensive answers");
  console.log("   ✓ ReAct-style reasoning loop");
}

main().catch(console.error);
