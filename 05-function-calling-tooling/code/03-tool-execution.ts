/**
 * Chapter 5 Example 3: Complete Tool Execution Loop
 *
 * Run: npx tsx 05-function-calling-tooling/code/03-tool-execution.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { ToolMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { z } from "zod";
import "dotenv/config";

const weatherTool = tool(
  async (input) => {
    // Simulate API call
    const temps = { Seattle: 62, Paris: 18, Tokyo: 24, London: 14, Sydney: 26 };
    const temp = temps[input.city as keyof typeof temps] || 72;
    return `Current temperature in ${input.city}: ${temp}°F, partly cloudy`;
  },
  {
    name: "getWeather",
    description: "Get current weather for a city",
    schema: z.object({
      city: z.string().describe("City name"),
    }),
  }
);

async function main() {
  console.log("🔄 Complete Tool Execution Loop\n");
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

  const modelWithTools = model.bindTools([weatherTool]);

  const query = "What's the weather in Seattle?";
  console.log(`User: ${query}\n`);

  // Step 1: Get tool call from LLM
  console.log("Step 1: LLM generates tool call...");
  const response1 = await modelWithTools.invoke([new HumanMessage(query)]);

  if (!response1.tool_calls || response1.tool_calls.length === 0) {
    console.log("No tool calls generated");
    return;
  }

  const toolCall = response1.tool_calls[0];
  console.log("  Tool:", toolCall.name);
  console.log("  Args:", toolCall.args);
  console.log("  ID:", toolCall.id);

  // Step 2: Execute the tool
  console.log("\nStep 2: Executing tool...");
  const toolResult = await weatherTool.invoke(toolCall);
  console.log("  Result:", toolResult);

  // Step 3: Send result back to LLM
  console.log("\nStep 3: Sending result back to LLM...");
  const messages = [
    new HumanMessage(query),
    new AIMessage({
      content: response1.content,
      tool_calls: response1.tool_calls,
    }),
    new ToolMessage({
      content: String(toolResult),
      tool_call_id: toolCall.id || "",
    }),
  ];

  const finalResponse = await model.invoke(messages);
  console.log("\nFinal answer:", finalResponse.content);

  console.log("\n" + "=".repeat(80) + "\n");
  console.log("💡 Key Takeaways:");
  console.log("   • LLM generates tool call → Execute tool → Send result back");
  console.log("   • Tool results go in ToolMessage with tool_call_id");
  console.log("   • LLM processes results to generate final answer");
}

main().catch(console.error);
