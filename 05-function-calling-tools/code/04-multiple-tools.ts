/**
 * Chapter 5 Example 4: Multiple Tools
 *
 * Run: npx tsx 05-function-calling-tooling/code/04-multiple-tools.ts
 *
 * 🤖 Try asking GitHub Copilot Chat (https://github.com/features/copilot):
 * - "How does the LLM decide which tool to use for a given query?"
 * - "Can the LLM call multiple tools in a single response?"
 * - "What makes a good tool description for helping the LLM choose correctly?"
 */

import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import "dotenv/config";

const calculatorTool = tool(
  async (input) => {
    const sanitized = input.expression.replace(/[^0-9+\-*/().\s]/g, "");
    const result = Function(`"use strict"; return (${sanitized})`)();
    return String(result);
  },
  {
    name: "calculator",
    description: "Perform mathematical calculations",
    schema: z.object({ expression: z.string() }),
  }
);

const searchTool = tool(
  async (input) => {
    const results: Record<string, string> = {
      "capital of France": "Paris",
      "population of Tokyo": "14 million",
      "who created JavaScript": "Brendan Eich",
    };
    return results[input.query.toLowerCase()] || "No results found";
  },
  {
    name: "search",
    description: "Search for factual information",
    schema: z.object({ query: z.string() }),
  }
);

const weatherTool = tool(async (input) => `Weather in ${input.city}: 72°F, sunny`, {
  name: "getWeather",
  description: "Get current weather for a city",
  schema: z.object({ city: z.string() }),
});

async function main() {
  console.log("🎛️ Multiple Tools Demo\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
  });

  const modelWithTools = model.bindTools([calculatorTool, searchTool, weatherTool]);

  const queries = [
    "What is 125 * 8?",
    "What's the capital of France?",
    "What's the weather in Tokyo?",
  ];

  for (const query of queries) {
    console.log(`\nQuery: "${query}"`);

    const response = await modelWithTools.invoke(query);

    if (response.tool_calls && response.tool_calls.length > 0) {
      const toolCall = response.tool_calls[0];
      console.log(`  ✓ Chose tool: ${toolCall.name}`);
      console.log(`  ✓ Args: ${JSON.stringify(toolCall.args)}`);
    } else {
      console.log("  ✗ No tool call generated");
    }

    console.log("─".repeat(80));
  }

  console.log("\n" + "=".repeat(80) + "\n");
  console.log("💡 Key Takeaways:");
  console.log("   • LLMs automatically choose the right tool");
  console.log("   • Clear descriptions help with tool selection");
  console.log("   • Multiple tools enable complex capabilities");
}

main().catch(console.error);
