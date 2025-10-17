/**
 * Chapter 5 Example 2: Binding and Invoking Tools
 *
 * Run: npx tsx 05-function-calling-tooling/code/02-tool-calling.ts
 *
 * 🤖 Try asking GitHub Copilot Chat (https://github.com/features/copilot):
 * - "What does bindTools() do and how does it change the model's behavior?"
 * - "Why does the LLM generate tool_calls instead of executing them directly?"
 * - "How do I extract and use the tool call arguments from the response?"
 */

import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import "dotenv/config";

const calculatorTool = tool(
  async (input) => {
    const sanitized = input.expression.replace(/[^0-9+\-*/().\s]/g, "");
    const result = Function(`"use strict"; return (${sanitized})`)();
    return `${result}`;
  },
  {
    name: "calculator",
    description: "Perform mathematical calculations",
    schema: z.object({
      expression: z.string().describe("Math expression to evaluate"),
    }),
  }
);

async function main() {
  console.log("🔗 Tool Calling Demo\n");
  console.log("=".repeat(80) + "\n");

  // Create model and bind tools
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY
  });

  const modelWithTools = model.bindTools([calculatorTool]);

  console.log("🤖 Asking: What is 25 * 17?\n");

  // Invoke with a question
  const response = await modelWithTools.invoke("What is 25 * 17?");

  console.log("Response content:", response.content);
  console.log("\nTool calls:", JSON.stringify(response.tool_calls, null, 2));

  if (response.tool_calls && response.tool_calls.length > 0) {
    console.log("\n" + "─".repeat(80));
    console.log("\n✅ The LLM generated a tool call!");
    console.log("\nTool name:", response.tool_calls[0].name);
    console.log("Arguments:", response.tool_calls[0].args);
    console.log("Tool call ID:", response.tool_calls[0].id);
  }

  console.log("\n" + "=".repeat(80) + "\n");
  console.log("💡 Key Takeaways:");
  console.log("   • Use bindTools() to make tools available");
  console.log("   • LLM generates tool calls with arguments");
  console.log("   • Tool calls include name, args, and ID");
  console.log("   • Your code executes the actual function");
}

main().catch(console.error);
