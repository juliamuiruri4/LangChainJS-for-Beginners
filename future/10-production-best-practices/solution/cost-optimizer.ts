/**
 * Chapter 9 Assignment Solution: Challenge 2
 * Smart Cost Optimizer
 *
 * Run: npx tsx 09-production-best-practices/solution/cost-optimizer.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

interface CostTracker {
  requestCount: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
  premiumCost: number; // What it would cost if always using premium
  savings: number;
}

// Pricing per 1M tokens (approximate)
const PRICING = {
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4o": { input: 2.5, output: 10.0 },
};

const tracker: CostTracker = {
  requestCount: 0,
  totalInputTokens: 0,
  totalOutputTokens: 0,
  totalCost: 0,
  premiumCost: 0,
  savings: 0,
};

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function calculateCost(inputTokens: number, outputTokens: number, model: string): number {
  const pricing = PRICING[model as keyof typeof PRICING] || PRICING["gpt-4o-mini"];
  return (inputTokens / 1_000_000) * pricing.input + (outputTokens / 1_000_000) * pricing.output;
}

function classifyComplexity(query: string): "simple" | "complex" {
  const simpleKeywords = ["what is", "define", "who is", "when did", "where is"];
  const complexKeywords = ["analyze", "compare", "explain in detail", "discuss", "evaluate"];

  const lowerQuery = query.toLowerCase();

  // Check for complex keywords
  if (complexKeywords.some((keyword) => lowerQuery.includes(keyword))) {
    return "complex";
  }

  // Check for simple keywords or short queries
  if (simpleKeywords.some((keyword) => lowerQuery.includes(keyword)) || query.length < 50) {
    return "simple";
  }

  // Default to simple for moderate queries
  return query.length < 100 ? "simple" : "complex";
}

function selectModel(query: string): { model: string; reasoning: string } {
  const complexity = classifyComplexity(query);

  if (complexity === "simple") {
    return {
      model: "gpt-4o-mini",
      reasoning: "Query is simple/short - using cost-effective model",
    };
  } else {
    return {
      model: "gpt-4o",
      reasoning: "Query is complex - using premium model for best results",
    };
  }
}

async function routeQuery(query: string): Promise<void> {
  const selection = selectModel(query);

  console.log(`🔍 Complexity: ${classifyComplexity(query)}`);
  console.log(`🤖 Selected Model: ${selection.model}`);
  console.log(`💭 Reasoning: ${selection.reasoning}\n`);

  const model = new ChatOpenAI({
    model: selection.model,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  const response = await model.invoke(query);

  // Estimate tokens
  const inputTokens = estimateTokens(query);
  const outputTokens = estimateTokens(response.content.toString());

  // Calculate costs
  const actualCost = calculateCost(inputTokens, outputTokens, selection.model);
  const premiumCost = calculateCost(inputTokens, outputTokens, "gpt-4o");

  // Update tracker
  tracker.requestCount++;
  tracker.totalInputTokens += inputTokens;
  tracker.totalOutputTokens += outputTokens;
  tracker.totalCost += actualCost;
  tracker.premiumCost += premiumCost;
  tracker.savings = tracker.premiumCost - tracker.totalCost;

  console.log(`📊 Cost for this request:`);
  console.log(`   Input tokens: ~${inputTokens}`);
  console.log(`   Output tokens: ~${outputTokens}`);
  console.log(`   Cost: $${actualCost.toFixed(6)}`);
  console.log(`   Premium cost: $${premiumCost.toFixed(6)}`);
  console.log(`   Saved: $${(premiumCost - actualCost).toFixed(6)}\n`);

  console.log(`💬 Response: ${response.content.toString().substring(0, 200)}...`);
}

function displayReport(): void {
  console.log("\n" + "=".repeat(80));
  console.log("\n📈 COST OPTIMIZATION REPORT\n");
  console.log("─".repeat(80));
  console.log(`Total Requests: ${tracker.requestCount}`);
  console.log(`Total Input Tokens: ${tracker.totalInputTokens.toLocaleString()}`);
  console.log(`Total Output Tokens: ${tracker.totalOutputTokens.toLocaleString()}`);
  console.log();
  console.log(`💰 Actual Cost: $${tracker.totalCost.toFixed(6)}`);
  console.log(`💸 Premium Cost: $${tracker.premiumCost.toFixed(6)}`);
  console.log(`✅ Savings: $${tracker.savings.toFixed(6)} (${((tracker.savings / tracker.premiumCost) * 100).toFixed(1)}%)`);
  console.log("─".repeat(80));
  console.log("\n💡 Cost Optimization Benefits:");
  console.log("   ✓ Routes simple queries to cost-effective models");
  console.log("   ✓ Uses premium models only when needed");
  console.log("   ✓ Tracks costs in real-time");
  console.log(`   ✓ Saves ${((tracker.savings / tracker.premiumCost) * 100).toFixed(1)}% compared to always using premium`);
}

async function main() {
  console.log("💰 Smart Cost Optimizer\n");
  console.log("=".repeat(80) + "\n");

  const queries = [
    "What is TypeScript?", // Simple
    "Explain async/await", // Simple
    "Analyze and compare the architectural differences between microservices and monolithic applications", // Complex
    "What is Docker?", // Simple
    "Discuss the trade-offs between SQL and NoSQL databases in detail", // Complex
    "Who created JavaScript?", // Simple
  ];

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];

    console.log(`\n[Request ${i + 1}/${queries.length}]`);
    console.log(`❓ Query: "${query}"\n`);

    await routeQuery(query);

    console.log("\n" + "=".repeat(80));
  }

  displayReport();
}

main().catch(console.error);
