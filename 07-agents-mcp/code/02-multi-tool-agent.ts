/**
 * Chapter 7 Example 2: Agent with Multiple Tools
 *
 * Run: npx tsx 07-agents-mcp/code/02-multi-tool-agent.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import "dotenv/config";

const calculatorTool = tool(
  async (input) => {
    const sanitized = input.expression.replace(/[^0-9+\-*/().\s]/g, "");
    return String(Function(`"use strict"; return (${sanitized})`)());
  },
  {
    name: "calculator",
    description: "Perform mathematical calculations",
    schema: z.object({ expression: z.string() }),
  }
);

const weatherTool = tool(
  async (input) => {
    const weather = { Seattle: "62°F, cloudy", Paris: "18°C, sunny", Tokyo: "24°C, rainy" };
    return weather[input.city as keyof typeof weather] || "Weather data unavailable";
  },
  {
    name: "getWeather",
    description: "Get current weather for a city",
    schema: z.object({ city: z.string() }),
  }
);

const searchTool = tool(
  async (input) => `Search results for "${input.query}": [Simulated results]`,
  {
    name: "search",
    description: "Search for information on the web",
    schema: z.object({ query: z.string() }),
  }
);

async function main() {
  console.log("🎛️ Multi-Tool Agent Demo\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  const modelWithTools = model.bindTools([calculatorTool, weatherTool, searchTool]);

  const queries = [
    "What is 50 * 25?",
    "What's the weather in Tokyo?",
    "Search for information about TypeScript",
  ];

  for (const query of queries) {
    console.log(`Query: "${query}"`);

    const response = await modelWithTools.invoke(query);

    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolCall = response.tool_calls[0];
      console.log(`  → Agent chose: ${toolCall.name}`);
      console.log(`  → With args: ${JSON.stringify(toolCall.args)}`);
    }

    console.log("─".repeat(80) + "\n");
  }

  console.log("=".repeat(80) + "\n");
  console.log("💡 Key Concepts:");
  console.log("   • Agents automatically select appropriate tools");
  console.log("   • Tool descriptions guide selection");
  console.log("   • Multiple specialized tools enable complex tasks");
}

main().catch(console.error);
