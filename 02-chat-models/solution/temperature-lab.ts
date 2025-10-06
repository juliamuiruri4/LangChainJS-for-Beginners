/**
 * Challenge 3 Solution: Temperature Experiment
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const prompt = "Write a catchy tagline for a coffee shop.";
const temperatures = [0, 0.5, 1, 1.5, 2];
const trialsPerTemp = 3;

async function temperatureExperiment() {
  console.log("🌡️  Temperature Experiment\n");
  console.log(`Prompt: "${prompt}"\n`);
  console.log("=".repeat(80));

  for (const temp of temperatures) {
    console.log(`\n🌡️ Temperature: ${temp}`);
    console.log("-".repeat(80));

    const model = new ChatOpenAI({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      temperature: temp,
      configuration: {
        baseURL: process.env.AI_ENDPOINT,
      },
      apiKey: process.env.AI_API_KEY,
    });

    const responses: string[] = [];

    for (let trial = 1; trial <= trialsPerTemp; trial++) {
      const response = await model.invoke(prompt);
      const content = response.content.toString();
      responses.push(content);
      console.log(`Try ${trial}: "${content}"`);

      // Small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Check for uniqueness
    const uniqueResponses = new Set(responses);
    console.log(`\n📊 Unique responses: ${uniqueResponses.size}/${trialsPerTemp}`);
  }

  console.log("\n" + "=".repeat(80));
  console.log("📊 Analysis\n");
  console.log("Temperature 0.0:");
  console.log("  ✅ Consistent and deterministic");
  console.log("  ✅ Best for: Code generation, factual Q&A, translations");
  console.log("  ❌ Not ideal for: Creative writing, brainstorming\n");

  console.log("Temperature 0.5-1.0:");
  console.log("  ✅ Balanced between consistency and creativity");
  console.log("  ✅ Best for: General conversation, helpful suggestions");
  console.log("  ℹ️  Default for most applications\n");

  console.log("Temperature 1.5-2.0:");
  console.log("  ✅ Highly creative and varied");
  console.log("  ✅ Best for: Creative writing, unique ideas, brainstorming");
  console.log("  ❌ Not ideal for: Factual information, code\n");

  console.log("=".repeat(80));
}

temperatureExperiment().catch(console.error);
