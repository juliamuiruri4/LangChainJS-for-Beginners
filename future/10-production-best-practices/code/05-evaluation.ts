/**
 * Automated Evaluation - Testing LLM Outputs with Metrics
 * Run: npx tsx 10-production-best-practices/code/05-evaluation.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function main() {
  console.log("🧪 Automated Evaluation Example\n");

  // Setup
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-5-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  console.log("=".repeat(80));

  /**
   * Evaluation function with automated metrics
   */
  async function evaluateResponse(question: string, expectedKeywords: string[]) {
    console.log(`\n❓ Question: "${question}"\n`);

    const startTime = Date.now();
    const response = await model.invoke(question);
    const duration = Date.now() - startTime;

    const answer = response.content as string;
    const wordCount = answer.split(/\s+/).length;

    // Metric 1: Response Length (should be between 50-300 words)
    const lengthScore = wordCount >= 50 && wordCount <= 300;
    console.log(`📏 Length Check: ${wordCount} words ${lengthScore ? "✅" : "❌"}`);

    // Metric 2: Keyword Relevance (should contain at least 60% of expected keywords)
    const lowerAnswer = answer.toLowerCase();
    const foundKeywords = expectedKeywords.filter((kw) => lowerAnswer.includes(kw.toLowerCase()));
    const relevanceScore = foundKeywords.length / expectedKeywords.length >= 0.6;
    console.log(
      `🔍 Relevance: ${foundKeywords.length}/${expectedKeywords.length} keywords found ${relevanceScore ? "✅" : "❌"}`
    );
    console.log(`   Expected: [${expectedKeywords.join(", ")}]`);
    console.log(`   Found: [${foundKeywords.join(", ")}]`);

    // Metric 3: Response Time (should be under 5 seconds)
    const speedScore = duration < 5000;
    console.log(`⏱️  Speed: ${duration}ms ${speedScore ? "✅" : "❌"}`);

    // Overall Evaluation
    const metrics = {
      length: lengthScore,
      relevance: relevanceScore,
      speed: speedScore,
    };

    const passedTests = Object.values(metrics).filter(Boolean).length;
    const totalTests = Object.keys(metrics).length;
    const overallScore = (passedTests / totalTests) * 100;

    console.log(
      `\n📊 Overall Score: ${overallScore.toFixed(0)}% (${passedTests}/${totalTests} tests passed)`
    );

    if (overallScore >= 80) {
      console.log("✅ Quality: GOOD - Response meets standards");
    } else if (overallScore >= 60) {
      console.log("⚠️  Quality: ACCEPTABLE - Some improvements needed");
    } else {
      console.log("❌ Quality: POOR - Significant improvements required");
    }

    console.log(`\n🤖 Answer Preview: ${answer.slice(0, 150)}...`);
    console.log("─".repeat(80));

    return {
      question,
      answer,
      metrics,
      overallScore,
      duration,
    };
  }

  // Test Case 1: Simple Definition Question
  await evaluateResponse("What is TypeScript?", [
    "TypeScript",
    "JavaScript",
    "types",
    "static",
    "compile",
  ]);

  // Test Case 2: Complex Explanation Question
  await evaluateResponse("Explain RAG systems and how they work", [
    "RAG",
    "retrieval",
    "generation",
    "documents",
    "context",
    "embeddings",
    "vector",
  ]);

  // Test Case 3: Technical Comparison Question
  await evaluateResponse("What's the difference between LangChain and LangGraph?", [
    "LangChain",
    "LangGraph",
    "chains",
    "agents",
    "graph",
    "workflow",
  ]);

  console.log("\n💡 Evaluation Best Practices:\n");
  console.log("   ✅ Length: Check response is neither too short nor too long");
  console.log("   ✅ Relevance: Verify key concepts are mentioned");
  console.log("   ✅ Speed: Ensure reasonable response time");
  console.log("   ✅ Accuracy: Validate factual correctness (needs domain knowledge)");
  console.log("   ✅ Format: Check structure matches requirements");

  console.log("\n🎯 When to Use Automated Evaluation:\n");
  console.log("   1. Regression testing (ensure changes don't break quality)");
  console.log("   2. A/B testing (compare different prompts/models)");
  console.log("   3. Performance monitoring (track metrics over time)");
  console.log("   4. Batch evaluation (test multiple scenarios quickly)");

  console.log("\n⚠️  Limitations of Automated Metrics:\n");
  console.log("   - Can't measure nuanced quality or creativity");
  console.log("   - May miss semantic correctness");
  console.log("   - Doesn't understand context deeply");
  console.log("   - Best combined with LLM-as-judge or human review");
}

main().catch(console.error);
