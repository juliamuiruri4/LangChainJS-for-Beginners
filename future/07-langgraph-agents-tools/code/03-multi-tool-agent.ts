/**
 * Run: npx tsx 07-langgraph-agents-tools/code/03-multi-tool-agent.ts
 */

import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import "dotenv/config";

async function main() {
  console.log("🎯 Multi-Tool Agent Example\n");

  // Tool 1: Calculator
  const calculatorTool = tool(
    async (input) => {
      try {
        // Simple math parser for basic operations (safer than eval)
        const sanitized = input.expression.replace(/[^0-9+\-*/().\s]/g, "");
        const result = Function(`"use strict"; return (${sanitized})`)();
        return `${result}`;
      } catch (error) {
        return "Error in calculation";
      }
    },
    {
      name: "calculator",
      description: "Perform mathematical calculations. Input: math expression",
      schema: z.object({
        expression: z.string().describe("The mathematical expression to evaluate"),
      }),
    }
  );

  // Tool 2: String reverser
  const reverserTool = tool(
    async (input) => {
      return input.text.split("").reverse().join("");
    },
    {
      name: "string_reverser",
      description: "Reverse a string. Input: text to reverse",
      schema: z.object({
        text: z.string().describe("The text to reverse"),
      }),
    }
  );

  // Tool 3: Word counter
  const wordCounterTool = tool(
    async (input) => {
      const words = input.text.trim().split(/\s+/);
      return `${words.length} words`;
    },
    {
      name: "word_counter",
      description: "Count words in a text. Input: text to count",
      schema: z.object({
        text: z.string().describe("The text to count words in"),
      }),
    }
  );

  // Tool 4: Search (simulated)
  const searchTool = tool(
    async (input) => {
      // Simulated search results
      const results: Record<string, string> = {
        "capital of France": "Paris",
        "largest ocean": "Pacific Ocean",
        "speed of light": "299,792,458 meters per second",
        "inventor of telephone": "Alexander Graham Bell",
      };

      const lowerInput = input.query.toLowerCase();
      for (const [key, value] of Object.entries(results)) {
        if (lowerInput.includes(key)) {
          return `Search result: ${value}`;
        }
      }

      return `No specific information found for: ${input.query}`;
    },
    {
      name: "search",
      description: "Search for information. Input: search query",
      schema: z.object({
        query: z.string().describe("The search query"),
      }),
    }
  );

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    temperature: 0,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  const agent = createReactAgent({
    llm: model,
    tools: [calculatorTool, reverserTool, wordCounterTool, searchTool],
  });

  // Complex multi-step questions
  const questions = [
    "What is 25 * 4, and then reverse the result as a string?",
    "Search for the capital of France, then count the words in the result",
    "Calculate 100 + 50, reverse it, then count how many characters are in the reversed string",
    "What's the largest ocean? Count the words in your answer.",
  ];

  for (const question of questions) {
    console.log("\n" + "=".repeat(80));
    console.log(`\n❓ ${question}\n`);

    const response = await agent.invoke({
      messages: [new HumanMessage(question)],
    });

    const lastMessage = response.messages[response.messages.length - 1];
    console.log(`\n✅ Final Answer: ${lastMessage.content}\n`);
  }

  console.log("=".repeat(80));
  console.log("\n💡 Multi-Tool Agent Observations:");
  console.log("   - Agent chains tools together logically");
  console.log("   - Decides which tool to use based on context");
  console.log("   - Can solve multi-step problems");
  console.log("   - ReAct pattern: Reason → Act → Observe → Repeat");
}

main().catch(console.error);
