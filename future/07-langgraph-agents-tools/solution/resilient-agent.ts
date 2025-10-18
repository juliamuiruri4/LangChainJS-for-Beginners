/**
 * Chapter 7 Assignment Solution: Challenge 4
 * Error-Resilient Agent
 *
 * Run: npx tsx 07-langgraph-agents-tools/solution/resilient-agent.ts
 */

import { tool } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "langchain";
import * as z from "zod";
import "dotenv/config";

let apiCallCount = 0;

async function main() {
  console.log("🛡️ Error-Resilient Agent\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-5-mini",
    temperature: 0,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Tool 1: Unreliable API (fails 30% of the time)
  const unreliableTool = tool(
    async (input) => {
      apiCallCount++;

      // Simulate 30% failure rate
      if (Math.random() < 0.3) {
        throw new Error(`API Error: Service temporarily unavailable (attempt ${apiCallCount})`);
      }

      return `Success! Data retrieved: ${input.query} (attempt ${apiCallCount})`;
    },
    {
      name: "unreliable_api",
      description: "Call an API that sometimes fails. Use the retry tool if it fails.",
      schema: z.object({
        query: z.string().describe("The query to send to the API"),
      }),
    }
  );

  // Tool 2: Retry with Exponential Backoff
  const retryTool = tool(
    async (input) => {
      const maxRetries = 3;
      let lastError: string = "";

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          apiCallCount++;

          // Simulate API call with decreasing failure probability
          const failureChance = Math.max(0, 0.3 - attempt * 0.1);

          if (Math.random() < failureChance) {
            throw new Error("API Error: Service temporarily unavailable");
          }

          return `Retry successful on attempt ${attempt}! Data: ${input.operation}`;
        } catch (error: any) {
          lastError = error.message;
          console.log(`   ⚠️ Retry attempt ${attempt} failed: ${lastError}`);

          if (attempt < maxRetries) {
            // Exponential backoff: wait 2^attempt * 100ms
            const delay = Math.pow(2, attempt) * 100;
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      return `All retry attempts failed. Last error: ${lastError}. Falling back to alternative method.`;
    },
    {
      name: "retry_with_backoff",
      description: "Retry an operation with exponential backoff (up to 3 attempts)",
      schema: z.object({
        operation: z.string().describe("Description of the operation to retry"),
      }),
    }
  );

  // Tool 3: Fallback Data Source (always works)
  const fallbackTool = tool(
    async (input) => {
      // Simulated cached/fallback data
      const fallbackData: Record<string, string> = {
        weather: "Cached: 72°F, Sunny (data may be outdated)",
        stock: "Cached: $150.25 (15 minutes delayed)",
        news: "Cached: Latest headlines from 1 hour ago",
      };

      const key = Object.keys(fallbackData).find((k) => input.query.toLowerCase().includes(k));

      if (key) {
        return `Fallback data for "${input.query}": ${fallbackData[key]}`;
      }

      return `Fallback: Using cached data from local database for "${input.query}"`;
    },
    {
      name: "fallback_data",
      description: "Get data from fallback/cached source (always available but may be outdated)",
      schema: z.object({
        query: z.string().describe("What data to retrieve from fallback"),
      }),
    }
  );

  // Tool 4: Validate Response
  const validateTool = tool(
    async (input) => {
      try {
        // Check if response is valid
        if (!input.response || input.response.length < 10) {
          return "INVALID: Response too short or empty";
        }

        if (input.response.toLowerCase().includes("error")) {
          return "INVALID: Response contains error message";
        }

        return "VALID: Response passed validation checks";
      } catch (error) {
        return "INVALID: Could not validate response";
      }
    },
    {
      name: "validate_response",
      description: "Validate that a response is properly formatted and complete",
      schema: z.object({
        response: z.string().describe("The response to validate"),
      }),
    }
  );

  const agent = createReactAgent({
    llm: model,
    tools: [unreliableTool, retryTool, fallbackTool, validateTool],
  });

  console.log("🧪 Testing agent resilience with potentially failing operations\n");
  console.log("=".repeat(80) + "\n");

  const queries = [
    "Try to get weather data from the unreliable API",
    "Get stock prices and retry if it fails",
    "If the API fails, use the fallback data source for news",
  ];

  for (const query of queries) {
    console.log(`❓ ${query}\n`);

    try {
      const response = await agent.invoke({
        messages: [new HumanMessage(query)],
      });

      const lastMessage = response.messages[response.messages.length - 1];
      console.log(`✅ Result: ${lastMessage.content}\n`);
    } catch (error: any) {
      console.log(`❌ Agent Error: ${error.message}\n`);
      console.log("   The agent should handle this gracefully with fallbacks.\n");
    }

    console.log("─".repeat(80) + "\n");
  }

  console.log("=".repeat(80));
  console.log("\n💡 Resilient Agent Features:");
  console.log("   ✓ Handles tool failures gracefully");
  console.log("   ✓ Retry logic with exponential backoff");
  console.log("   ✓ Fallback to alternative data sources");
  console.log("   ✓ Response validation");
  console.log("   ✓ Never crashes - always provides a response");
  console.log(`\n📊 Total API calls made: ${apiCallCount}`);
}

main().catch(console.error);
