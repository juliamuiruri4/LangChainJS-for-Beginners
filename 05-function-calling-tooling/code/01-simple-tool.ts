/**
 * Chapter 5 Example 1: Simple Calculator Tool
 *
 * Run: npx tsx 05-function-calling-tooling/code/01-simple-tool.ts
 *
 * 🤖 Try asking GitHub Copilot Chat (https://github.com/features/copilot):
 * - "Why do we use Zod schemas to define tool parameters?"
 * - "How does the tool() function create a callable tool from my code?"
 * - "What security considerations should I have when using Function() to evaluate expressions?"
 */

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import "dotenv/config";

// Define calculator tool
const calculatorTool = tool(
  async (input) => {
    // Sanitize and evaluate expression
    const sanitized = input.expression.replace(/[^0-9+\-*/().\s]/g, "");
    try {
      const result = Function(`"use strict"; return (${sanitized})`)();
      return `The result is: ${result}`;
    } catch (error) {
      return `Error evaluating expression: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: "calculator",
    description:
      "Useful for performing mathematical calculations. Use this when you need to compute numbers.",
    schema: z.object({
      expression: z.string().describe("The mathematical expression to evaluate, e.g., '25 * 4'")
    })
  }
);

async function main() {
  console.log("🧮 Simple Calculator Tool Demo\n");
  console.log("=".repeat(80) + "\n");

  console.log("Tool Name:", calculatorTool.name);
  console.log("Description:", calculatorTool.description);
  console.log("\nSchema:", JSON.stringify(calculatorTool.schema, null, 2));

  console.log("\n" + "=".repeat(80) + "\n");

  // Test the tool directly
  const testExpressions = ["25 * 17", "(100 + 50) / 2", "Math.sqrt(144)"];

  for (const expr of testExpressions) {
    console.log(`\nExpression: ${expr}`);
    const result = await calculatorTool.invoke({ expression: expr });
    console.log(`Result: ${result}`);
  }

  console.log("\n" + "=".repeat(80) + "\n");
  console.log("✅ Tool created successfully!");
  console.log("\n💡 Key Takeaways:");
  console.log("   • Tools are created with tool() function");
  console.log("   • Zod schemas define parameters");
  console.log("   • Descriptions help LLMs understand when to use tools");
}

main().catch(console.error);
