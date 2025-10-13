/**
 * Chapter 9 Assignment Solution: Challenge 1
 * Multi-Provider Application
 *
 * Run: npx tsx 09-production-best-practices/solution/multi-provider-app.ts
 * Or with provider: AI_PROVIDER=github npx tsx 09-production-best-practices/solution/multi-provider-app.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

interface ProviderConfig {
  name: string;
  model: string;
  baseURL?: string;
  apiVersion?: string;
  apiKey?: string;
}

function getProviderConfig(): ProviderConfig {
  const provider = (process.env.AI_PROVIDER || "github").toLowerCase();

  const configs: Record<string, ProviderConfig> = {
    github: {
      name: "GitHub Models",
      model: process.env.AI_MODEL || "gpt-4o-mini",
      baseURL: process.env.AI_ENDPOINT,
      apiVersion: process.env.AI_API_VERSION,
      apiKey: process.env.AI_API_KEY,
    },
    azure: {
      name: "Azure OpenAI",
      model: process.env.AZURE_MODEL || "gpt-4o",
      baseURL: process.env.AZURE_ENDPOINT,
      apiVersion: process.env.AZURE_API_VERSION || "2024-02-15-preview",
      apiKey: process.env.AZURE_API_KEY,
    },
    openai: {
      name: "OpenAI",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      apiKey: process.env.OPENAI_API_KEY,
    },
  };

  return configs[provider] || configs.github;
}

function createModel(config: ProviderConfig) {
  const modelConfig: any = {
    model: config.model,
    apiKey: config.apiKey,
  };

  if (config.baseURL) {
    modelConfig.configuration = {
      baseURL: config.baseURL,
      defaultQuery: config.apiVersion ? { "api-version": config.apiVersion } : undefined,
    };
  }

  return new ChatOpenAI(modelConfig);
}

async function main() {
  console.log("🔄 Multi-Provider Application\n");
  console.log("=".repeat(80) + "\n");

  const config = getProviderConfig();

  console.log("📍 Current Configuration:");
  console.log(`   Provider: ${config.name}`);
  console.log(`   Model: ${config.model}`);
  if (config.baseURL) {
    console.log(`   Base URL: ${config.baseURL}`);
  }
  if (config.apiVersion) {
    console.log(`   API Version: ${config.apiVersion}`);
  }
  console.log();

  console.log("💡 To switch providers:");
  console.log("   1. Environment: AI_PROVIDER=azure npm run start");
  console.log("   2. .env file: AI_PROVIDER=openai");
  console.log("   3. Supports: github, azure, openai");
  console.log();

  console.log("=".repeat(80) + "\n");

  try {
    const model = createModel(config);

    const questions = [
      "What is TypeScript?",
      "Explain async/await in JavaScript",
      "What are the benefits of using Docker?",
    ];

    for (const question of questions) {
      console.log(`❓ Question: ${question}\n`);

      const response = await model.invoke(question);

      console.log(`🤖 Answer (via ${config.name}):`);
      console.log(`${response.content}\n`);
      console.log("─".repeat(80) + "\n");
    }

    console.log("=".repeat(80));
    console.log("\n✅ Multi-Provider Application Complete!\n");
    console.log("💡 Key Benefits:");
    console.log("   ✓ Easy provider switching without code changes");
    console.log("   ✓ Environment-based configuration");
    console.log("   ✓ Consistent interface across providers");
    console.log("   ✓ Fallback options available");
    console.log("   ✓ Production-ready abstraction");
  } catch (error: any) {
    console.error("\n❌ Error:", error.message);
    console.log("\n💡 Tips:");
    console.log("   - Check API keys in .env file");
    console.log("   - Verify provider configuration");
    console.log("   - Ensure correct endpoint URLs");
  }
}

main().catch(console.error);
