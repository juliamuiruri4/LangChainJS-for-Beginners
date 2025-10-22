/**
 * Model Parameters
 * Run: npx tsx 02-chat-models/code/03-parameters.ts
 *
 * 🤖 Try asking GitHub Copilot Chat (https://github.com/features/copilot):
 * - "What temperature value should I use for a customer service chatbot?"
 * - "How do I add the maxTokens parameter to limit response length?"
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function temperatureComparison() {
  console.log("🌡️  Temperature Comparison\n");
  console.log("=".repeat(80));

  const prompt = "Write a creative opening line for a sci-fi story about time travel.";
  const isCI = process.env.CI === "true";
  const temperatures = isCI ? [0, 1] : [0, 1, 2]; // Reduce temperatures in CI mode
  const tries = isCI ? 1 : 2; // Reduce tries in CI mode

  for (const temp of temperatures) {
    console.log(`\nTemperature: ${temp}`);
    console.log("-".repeat(80));

    const model = new ChatOpenAI({
      model: process.env.AI_MODEL,
      configuration: { baseURL: process.env.AI_ENDPOINT },
      apiKey: process.env.AI_API_KEY,
    });
    for (let i = 1; i <= tries; i++) {
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

  const isCI = process.env.CI === "true";
  const tokenLimits = isCI ? [150] : [50, 150, 500]; // Reduce in CI mode

  for (const maxTokens of tokenLimits) {
    console.log(`\nMax Tokens: ${maxTokens}`);
    console.log("-".repeat(80));

    const model = new ChatOpenAI({
      model: process.env.AI_MODEL,
      configuration: { baseURL: process.env.AI_ENDPOINT },
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
