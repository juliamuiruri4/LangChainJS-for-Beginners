/**
 * Example 3: Model Parameters
 *
 * Learn how to control AI behavior using temperature, max tokens,
 * and other parameters.
 *
 * Run: npx tsx 02-chat-models/code/03-parameters.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function temperatureComparison() {
  console.log("🌡️  Temperature Comparison\n");
  console.log("=".repeat(80));

  const prompt = "Write a creative opening line for a sci-fi story about time travel.";
  const temperatures = [0, 1, 2];

  for (const temp of temperatures) {
    console.log(`\nTemperature: ${temp}`);
    console.log("-".repeat(80));

    const model = new ChatOpenAI({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      temperature: temp,
      configuration: {
        baseURL: process.env.AI_ENDPOINT,
      },
      apiKey: process.env.AI_API_KEY,
    });

    // Run the same prompt 2 times to see variability
    for (let i = 1; i <= 2; i++) {
      const response = await model.invoke(prompt);
      console.log(`  Try ${i}: ${response.content}`);
    }
  }

  console.log("\n💡 Observations:");
  console.log("   - Temperature 0: Same response every time (deterministic)");
  console.log("   - Temperature 1: Some variation (balanced)");
  console.log("   - Temperature 2: Lots of variation (creative)");
}

async function maxTokensExample() {
  console.log("\n\n📏 Max Tokens Limit\n");
  console.log("=".repeat(80));

  const prompt = "Write a detailed explanation of machine learning in 5 paragraphs.";

  const tokenLimits = [50, 150, 500];

  for (const maxTokens of tokenLimits) {
    console.log(`\nMax Tokens: ${maxTokens}`);
    console.log("-".repeat(80));

    const model = new ChatOpenAI({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      maxTokens: maxTokens,
      configuration: {
        baseURL: process.env.AI_ENDPOINT,
      },
      apiKey: process.env.AI_API_KEY,
    });

    const response = await model.invoke(prompt);
    console.log(response.content);
    console.log(`\n(Character count: ${response.content.toString().length})`);
  }

  console.log("\n💡 Observations:");
  console.log("   - Lower max tokens = shorter responses");
  console.log("   - Response may be cut off if limit is too low");
  console.log("   - Use max tokens to control costs and response length");
}

async function main() {
  console.log("🎛️  Model Parameters Tutorial\n");

  await temperatureComparison();
  await maxTokensExample();

  console.log("\n\n✅ Summary:");
  console.log("   - Use temperature=0 for consistent, factual responses");
  console.log("   - Use temperature=1-2 for creative, varied responses");
  console.log("   - Use maxTokens to control response length and costs");
}

main().catch(console.error);
