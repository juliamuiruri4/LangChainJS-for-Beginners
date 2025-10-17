/**
 * Fallback Strategy
 * Run: npx tsx 10-production-best-practices/code/02-fallback-strategy.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

interface Provider {
  name: string;
  model: any;
}

async function invokeWithFallback(input: string, maxRetries: number = 2): Promise<string> {
  const providers: Provider[] = [
    {
      name: "GitHub Models (Primary)",
      model: new ChatOpenAI({
        model: process.env.AI_MODEL || "gpt-5-mini",
        configuration: {
          baseURL: process.env.AI_ENDPOINT,
          defaultQuery: process.env.AI_API_VERSION
            ? { "api-version": process.env.AI_API_VERSION }
            : undefined,
        },
        apiKey: process.env.AI_API_KEY,
        timeout: 5000,
      }),
    },
    {
      name: "GitHub Models Backup",
      model: new ChatOpenAI({
        model: process.env.AI_MODEL || "gpt-5",
        configuration: {
          baseURL: process.env.AI_ENDPOINT,
          defaultQuery: process.env.AI_API_VERSION
            ? { "api-version": process.env.AI_API_VERSION }
            : undefined,
        },
        apiKey: process.env.AI_API_KEY,
        timeout: 10000,
      }),
    },
  ];

  let lastError: Error | null = null;

  for (const provider of providers) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Trying ${provider.name} (attempt ${attempt}/${maxRetries})...`);

        const response = await provider.model.invoke(input);

        console.log(`✅ Success with ${provider.name}\n`);
        return response.content;
      } catch (error: any) {
        lastError = error;
        console.log(`❌ ${provider.name} failed: ${error.message}`);

        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`⏳ Waiting ${waitTime}ms before retry...\n`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }
  }

  throw new Error(`All providers failed. Last error: ${lastError?.message}`);
}

async function main() {
  console.log("🛡️  Fallback Strategy Example\n");
  console.log("=".repeat(80));

  const isCI = process.env.CI === "true";
  const questions = isCI
    ? ["What is TypeScript?"] // Reduce questions in CI mode
    : [
        "What is TypeScript?",
        "Explain async/await in JavaScript",
        "What are the benefits of LangChain.js?",
      ];

  for (const question of questions) {
    console.log(`\n❓ Question: ${question}\n`);

    try {
      const answer = await invokeWithFallback(question);
      console.log(`🤖 Answer: ${answer}\n`);
    } catch (error: any) {
      console.error(`\n💥 All fallbacks exhausted: ${error.message}\n`);
    }

    console.log("─".repeat(80));
  }

  console.log("\n💡 Fallback Strategy Benefits:");
  console.log("   - Automatic failover to backup providers");
  console.log("   - Retry logic with exponential backoff");
  console.log("   - High availability");
  console.log("   - Graceful degradation");
}

main().catch(console.error);
