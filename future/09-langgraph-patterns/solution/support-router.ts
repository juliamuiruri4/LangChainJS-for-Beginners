/**
 * Chapter 10 Assignment Solution: Challenge 1
 * Customer Support Router
 *
 * Run: npx tsx 10-production-best-practices/solution/support-router.ts
 */

import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const TicketState = Annotation.Root({
  ticket: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
  category: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
  priority: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
  assignedTeam: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
  response: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
});

async function main() {
  console.log("🎯 Customer Support Router\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    temperature: 0,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Create workflow
  const workflow = new StateGraph(TicketState);

  // Node 1: Classify ticket category
  workflow.addNode("classify", async (state: typeof TicketState.State) => {
    console.log("1️⃣  Classifying ticket category...");

    const prompt = `Classify this support ticket as either "technical", "billing", or "general":

Ticket: "${state.ticket}"

Answer with just one word: technical, billing, or general`;

    const response = await model.invoke(prompt);
    const content = response.content.toString().toLowerCase();

    let category = "general";
    if (content.includes("technical")) {
      category = "technical";
    } else if (content.includes("billing")) {
      category = "billing";
    }

    console.log(`   Category: ${category}\n`);
    return { category };
  });

  // Node 2: Route to Engineering Team
  workflow.addNode("engineering", async (state: typeof TicketState.State) => {
    console.log("2️⃣  Routing to Engineering Team...");
    return { assignedTeam: "Engineering Team" };
  });

  // Node 3: Route to Finance Team
  workflow.addNode("finance", async (state: typeof TicketState.State) => {
    console.log("2️⃣  Routing to Finance Team...");
    return { assignedTeam: "Finance Team" };
  });

  // Node 4: Route to Customer Service
  workflow.addNode("customer_service", async (state: typeof TicketState.State) => {
    console.log("2️⃣  Routing to Customer Service...");
    return { assignedTeam: "Customer Service" };
  });

  // Node 5: Assign Priority
  workflow.addNode("prioritize", async (state: typeof TicketState.State) => {
    console.log("3️⃣  Assigning priority...");

    const urgentKeywords = ["not working", "broken", "urgent", "critical", "down", "error"];
    const ticketLower = state.ticket.toLowerCase();

    let priority = "low";

    if (urgentKeywords.some((keyword) => ticketLower.includes(keyword))) {
      priority = "high";
    } else if (state.category === "technical" || state.category === "billing") {
      priority = "medium";
    }

    console.log(`   Priority: ${priority}\n`);
    return { priority };
  });

  // Node 6: Generate Response
  workflow.addNode("respond", async (state: typeof TicketState.State) => {
    console.log("4️⃣  Generating response...");

    const prompt = `You are a ${state.assignedTeam} representative. Generate a helpful response to this ${state.priority} priority ticket:

Ticket: "${state.ticket}"

Provide a brief, professional response (2-3 sentences).`;

    const response = await model.invoke(prompt);
    console.log(`   Response generated\n`);

    return { response: response.content.toString() };
  });

  // Routing function
  function routeByCategory(state: typeof TicketState.State): string {
    if (state.category === "technical") {
      return "engineering";
    } else if (state.category === "billing") {
      return "finance";
    } else {
      return "customer_service";
    }
  }

  // Build the graph
  workflow.addEdge("__start__" as any, "classify" as any);

  workflow.addConditionalEdges("classify" as any, routeByCategory, {
    engineering: "engineering",
    finance: "finance",
    customer_service: "customer_service",
  } as any);

  workflow.addEdge("engineering" as any, "prioritize" as any);
  workflow.addEdge("finance" as any, "prioritize" as any);
  workflow.addEdge("customer_service" as any, "prioritize" as any);

  workflow.addEdge("prioritize" as any, "respond" as any);
  workflow.addEdge("respond" as any, END);

  const app = workflow.compile();

  // Test tickets
  const tickets = [
    "My API key is not working and I can't access the service",
    "I have a question about my invoice from last month",
    "How do I reset my password?",
    "The application keeps crashing - urgent!",
    "Can you explain your pricing plans?",
  ];

  for (const ticket of tickets) {
    console.log("=".repeat(80));
    console.log(`\n🎫 New Ticket: "${ticket}"\n`);
    console.log("─".repeat(80) + "\n");

    const result = await app.invoke({
      ticket,
      category: "",
      priority: "",
      assignedTeam: "",
      response: "",
    });

    console.log("✅ Ticket Processing Complete:");
    console.log(`   Category: ${result.category}`);
    console.log(`   Priority: ${result.priority.toUpperCase()}`);
    console.log(`   Assigned Team: ${result.assignedTeam}`);
    console.log(`   Response: ${result.response}\n`);
  }

  console.log("=".repeat(80));
  console.log("\n💡 Support Router Features:");
  console.log("   ✓ Automatic ticket classification");
  console.log("   ✓ Intelligent routing to appropriate team");
  console.log("   ✓ Priority assignment based on content");
  console.log("   ✓ Team-specific responses");
  console.log("   ✓ Fully automated workflow");
}

main().catch(console.error);
