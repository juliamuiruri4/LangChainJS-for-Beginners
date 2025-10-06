/**
 * Example 1: Model Switching
 *
 * Build provider-agnostic code that can switch between AI providers easily.
 *
 * Run: npx tsx 09-production-best-practices/code/01-model-switching.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

interface ModelConfig {
  provider: "github" | "azure" | "openai";
  model: string;
  apiKey?: string;
  baseURL?: string;
}

function createModel(config: ModelConfig) {
  switch (config.provider) {
    case "github":
      return new ChatOpenAI({
        model: config.model,
        configuration: {
          baseURL: "https://models.inference.ai.azure.com",
        },
        apiKey: config.apiKey || process.env.GITHUB_TOKEN,
      });

    case "azure":
      return new ChatOpenAI({
        model: config.model,
        configuration: {
          baseURL: config.baseURL || process.env.AZURE_OPENAI_ENDPOINT,
        },
        apiKey: config.apiKey || process.env.AZURE_OPENAI_API_KEY,
      });

    case "openai":
      return new ChatOpenAI({
        model: config.model,
        apiKey: config.apiKey || process.env.OPENAI_API_KEY,
      });

    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

async function main() {
  console.log("🔄 Model Switching Example\n");
  console.log("=".repeat(80));

  // Configuration from environment
  const provider = (process.env.AI_PROVIDER as any) || "github";
  const modelName = process.env.AI_MODEL || "gpt-4o-mini";

  console.log(`\nUsing provider: ${provider}`);
  console.log(`Using model: ${modelName}\n`);

  const config: ModelConfig = {
    provider,
    model: modelName,
  };

  const model = createModel(config);

  const question = "What is the capital of France?";
  console.log(`❓ Question: ${question}\n`);

  const response = await model.invoke(question);
  console.log(`🤖 Answer: ${response.content}\n`);

  console.log("=".repeat(80));
  console.log("\n💡 To switch providers:");
  console.log('   export AI_PROVIDER="azure"');
  console.log('   export AI_MODEL="gpt-4o"');
  console.log("\n   Your code stays exactly the same!");

  console.log("\n✅ Benefits:");
  console.log("   - No code changes to switch providers");
  console.log("   - Easy A/B testing");
  console.log("   - Provider fallbacks");
  console.log("   - Environment-based configuration");
}

main().catch(console.error);
