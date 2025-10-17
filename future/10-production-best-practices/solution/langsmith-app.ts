/**
 * Chapter 9 Assignment Solution: Bonus Challenge
 * LangSmith Integration
 *
 * Run: npx tsx 09-production-best-practices/solution/langsmith-app.ts
 *
 * Prerequisites:
 * 1. Sign up for LangSmith at https://smith.langchain.com/
 * 2. Get your API key from settings
 * 3. Add to .env file:
 *    LANGCHAIN_TRACING_V2=true
 *    LANGCHAIN_API_KEY=your_langsmith_api_key
 *    LANGCHAIN_PROJECT=production-app
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

// Enable LangSmith tracing
const LANGSMITH_ENABLED = process.env.LANGCHAIN_TRACING_V2 === "true";

async function main() {
  console.log("🔬 LangSmith Integration Demo\n");
  console.log("=".repeat(80) + "\n");

  if (!LANGSMITH_ENABLED) {
    console.log("⚠️  LangSmith tracing is NOT enabled");
    console.log("\n📝 To enable LangSmith:");
    console.log("   1. Sign up at https://smith.langchain.com/");
    console.log("   2. Get your API key");
    console.log("   3. Set environment variables:");
    console.log("      LANGCHAIN_TRACING_V2=true");
    console.log("      LANGCHAIN_API_KEY=your_api_key");
    console.log("      LANGCHAIN_PROJECT=production-app");
    console.log("\n   Running demo WITHOUT LangSmith tracing...\n");
  } else {
    console.log("✅ LangSmith tracing enabled!");
    console.log(`   Project: ${process.env.LANGCHAIN_PROJECT || "default"}`);
    console.log("   Traces will appear in your LangSmith dashboard\n");
  }

  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    temperature: 0.7,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined
    },
    apiKey: process.env.AI_API_KEY,
    // Custom tags and metadata for LangSmith
    tags: ["production", "demo"]
  });

  const scenarios = [
    {
      query: "What is TypeScript?",
      tags: ["basic", "typescript"],
      metadata: { category: "programming", difficulty: "beginner" }
    },
    {
      query: "Explain async/await in JavaScript",
      tags: ["intermediate", "javascript"],
      metadata: { category: "programming", difficulty: "intermediate" }
    },
    {
      query: "Compare microservices vs monolithic architecture",
      tags: ["advanced", "architecture"],
      metadata: { category: "architecture", difficulty: "advanced" }
    }
  ];

  for (const scenario of scenarios) {
    console.log(`❓ Query: ${scenario.query}\n`);
    console.log(`   Tags: ${scenario.tags.join(", ")}`);
    console.log(`   Metadata: ${JSON.stringify(scenario.metadata)}\n`);

    const startTime = Date.now();

    try {
      // When LangSmith is enabled, this will automatically create a trace
      const response = await model.invoke(scenario.query, {
        tags: scenario.tags,
        metadata: scenario.metadata
      });

      const latency = Date.now() - startTime;

      console.log(`✅ Response: ${response.content.toString().substring(0, 150)}...\n`);
      console.log(`⏱️  Latency: ${latency}ms`);

      if (LANGSMITH_ENABLED) {
        console.log("🔍 Trace recorded in LangSmith with custom tags and metadata");
      }
    } catch (error: any) {
      console.log(`❌ Error: ${error.message}`);

      if (LANGSMITH_ENABLED) {
        console.log("🔍 Error trace recorded in LangSmith");
      }
    }

    console.log("\n" + "─".repeat(80) + "\n");
  }

  console.log("=".repeat(80));
  console.log("\n📊 LangSmith Metrics You Can Track:\n");
  console.log("Request-Level Metrics:");
  console.log("   - Latency (response time)");
  console.log("   - Token usage (input/output)");
  console.log("   - Cost per request");
  console.log("   - Error rate");
  console.log();

  console.log("Aggregated Metrics:");
  console.log("   - Popular queries");
  console.log("   - Error trends over time");
  console.log("   - Performance by tag/category");
  console.log("   - Cost optimization opportunities");
  console.log();

  console.log("Advanced Features:");
  console.log("   - Prompt comparison (A/B testing)");
  console.log("   - Chain visualization");
  console.log("   - Custom feedback collection");
  console.log("   - Production monitoring dashboards");
  console.log();

  if (LANGSMITH_ENABLED) {
    console.log("🎯 Next Steps:");
    console.log("   1. Visit https://smith.langchain.com/");
    console.log("   2. Open your project dashboard");
    console.log("   3. View traces from this run");
    console.log("   4. Analyze performance metrics");
    console.log("   5. Set up alerts for errors/latency");
  } else {
    console.log("💡 To enable full LangSmith features:");
    console.log("   Set up environment variables and run again");
  }

  console.log("\n✅ LangSmith integration demo complete!");
}

main().catch(console.error);
