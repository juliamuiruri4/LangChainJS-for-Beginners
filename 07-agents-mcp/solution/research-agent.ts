/**
 * Chapter 7 Assignment Solution: Research Agent with ReAct Loop
 *
 * Run: npx tsx 07-agents-mcp/solution/research-agent.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import "dotenv/config";

// Search tool - simulates web search
const searchTool = tool(
  async (input) => {
    // Simulated search results
    const searchResults: Record<string, string> = {
      "population of tokyo":
        "Tokyo has a population of approximately 14 million people in the city proper, and over 37 million in the greater metropolitan area.",
      "capital of france": "The capital of France is Paris.",
      "capital of japan": "The capital of Japan is Tokyo.",
      "population of new york":
        "New York City has a population of approximately 8.3 million people.",
      "distance london to paris":
        "The distance between London and Paris is approximately 343 kilometers.",
      "highest mountain":
        "Mount Everest is the highest mountain in the world at 8,849 meters (29,032 feet).",
    };

    const queryLower = input.query.toLowerCase();

    // Find matching result
    for (const [key, value] of Object.entries(searchResults)) {
      if (queryLower.includes(key) || key.includes(queryLower)) {
        return value;
      }
    }

    return `Search results for "${input.query}": No specific information found. This is a simulated search tool with limited data.`;
  },
  {
    name: "search",
    description:
      "Search for factual information on the web. Use this when you need to find facts, statistics, or general knowledge. Good for finding populations, capitals, distances, and other factual data.",
    schema: z.object({
      query: z
        .string()
        .describe("The search query, e.g., 'population of Tokyo' or 'capital of France'"),
    }),
  }
);

// Calculator tool
const calculatorTool = tool(
  async (input) => {
    const sanitized = input.expression.replace(/[^0-9+\-*/().\s]/g, "");
    try {
      const result = Function(`"use strict"; return (${sanitized})`)();
      return String(result);
    } catch (error) {
      return `Error calculating ${input.expression}: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  },
  {
    name: "calculator",
    description:
      "Perform mathematical calculations. Use this for arithmetic operations like addition, subtraction, multiplication, division, and more complex math expressions.",
    schema: z.object({
      expression: z
        .string()
        .describe(
          "The mathematical expression to evaluate, e.g., '14000000 * 2' or '(100 + 50) / 2'"
        ),
    }),
  }
);

async function main() {
  console.log("🔍 Research Agent with ReAct Loop\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
  });

  const modelWithTools = model.bindTools([searchTool, calculatorTool]);

  // Test queries
  const queries = [
    "What is the population of Tokyo multiplied by 2?",
    "Search for the capital of France and tell me how many letters are in its name",
  ];

  for (const query of queries) {
    console.log(`User: ${query}\n`);

    // Agent loop - ReAct pattern
    let messages: any[] = [new HumanMessage(query)];
    let iteration = 1;
    const maxIterations = 5;

    while (iteration <= maxIterations) {
      console.log(`Iteration ${iteration}:`);

      // Reasoning: Model decides what to do
      const response = await modelWithTools.invoke(messages);

      // Check if done (no more tool calls needed)
      if (!response.tool_calls || response.tool_calls.length === 0) {
        console.log(`  Final Answer: ${response.content}\n`);
        break;
      }

      // Acting: Execute the tool
      const toolCall = response.tool_calls[0];
      console.log(`  Thought: I should use the ${toolCall.name} tool`);
      console.log(`  Action: ${toolCall.name}(${JSON.stringify(toolCall.args)})`);

      // Execute the appropriate tool
      let toolResult;
      if (toolCall.name === "search") {
        toolResult = await searchTool.invoke(searchTool.schema.parse(toolCall.args));
      } else if (toolCall.name === "calculator") {
        toolResult = await calculatorTool.invoke(calculatorTool.schema.parse(toolCall.args));
      } else {
        toolResult = `Unknown tool: ${toolCall.name}`;
      }

      console.log(`  Observation: ${toolResult}\n`);

      // Add to conversation history
      messages.push(
        new AIMessage({
          content: response.content,
          tool_calls: response.tool_calls,
        }),
        new ToolMessage({
          content: String(toolResult),
          tool_call_id: toolCall.id || "",
        })
      );

      iteration++;

      if (iteration > maxIterations) {
        console.log(`  ⚠️  Maximum iterations (${maxIterations}) reached. Stopping.\n`);
        break;
      }
    }

    console.log("=".repeat(80) + "\n");
  }

  console.log("💡 Key Concepts:");
  console.log("   • Agent follows ReAct pattern: Reason → Act → Observe");
  console.log("   • Agent iterates until it has enough information");
  console.log("   • Each iteration builds on previous results");
  console.log("   • Conversation history maintains context");
}

main().catch(console.error);
