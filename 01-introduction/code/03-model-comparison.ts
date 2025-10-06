/**
 * Example 3: Model Comparison
 *
 * Compare different AI models to see how they respond differently.
 * GitHub Models gives you access to multiple models for free!
 *
 * Run: npx tsx 01-introduction/code/03-model-comparison.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function compareModels() {
  console.log("🔬 Comparing AI Models\n");

  const prompt = "Explain recursion in programming in one sentence.";
  const models = ["gpt-4o", "gpt-4o-mini"];

  for (const modelName of models) {
    console.log(`\n📊 Testing: ${modelName}`);
    console.log("─".repeat(50));

    const model = new ChatOpenAI({
      model: modelName,
      configuration: {
        baseURL: process.env.AI_ENDPOINT,
      },
      apiKey: process.env.AI_API_KEY,
    });

    const startTime = Date.now();
    const response = await model.invoke(prompt);
    const duration = Date.now() - startTime;

    console.log(`Response: ${response.content}`);
    console.log(`⏱️  Time: ${duration}ms`);
  }

  console.log("\n✅ Comparison complete!");
  console.log("\n💡 Key Observations:");
  console.log("   - gpt-4o is more capable and detailed");
  console.log("   - gpt-4o-mini is faster and uses fewer resources");
  console.log("   - Choose based on your needs: speed vs. capability");
}

compareModels().catch(console.error);
