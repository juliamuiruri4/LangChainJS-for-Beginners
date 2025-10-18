/**
 * Run: npx tsx 07-langgraph-agents-tools/code/01-simple-tool.ts
 */

import { tool } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "langchain";
import * as z from "zod";
import "dotenv/config";

async function main() {
  console.log("🛠️  Simple Tool Creation Example\n");

  const calculatorTool = tool(
    async (input) => {
      try {
        // Simple math parser for basic operations (safer than eval)
        const sanitized = input.expression.replace(/[^0-9+\-*/().\s]/g, "");
        const result = Function(`"use strict"; return (${sanitized})`)();
        return `The result is: ${result}`;
      } catch (error) {
        return "Error: Invalid mathematical expression";
      }
    },
    {
      name: "calculator",
      description:
        "Useful for performing mathematical calculations. Input should be a math expression like '2 + 2' or '10 * 5'.",
      schema: z.object({
        expression: z.string().describe("The mathematical expression to evaluate"),
      }),
    }
  );

  console.log("🧪 Testing tool directly:\n");
  const testResult = await calculatorTool.invoke({ expression: "15 * 7 + 3" });
  console.log(`   ${testResult}\n`);

  console.log("=".repeat(80));
  console.log("\n🤖 Using tool with an agent:\n");

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

  const agent = createReactAgent({
    llm: model,
    tools: [calculatorTool],
  });

  const questions = [
    "What is 25 multiplied by 4?",
    "Calculate 100 divided by 4, then add 17",
    "If I have 12 items and each costs $8.50, what's the total?",
  ];

  for (const question of questions) {
    console.log(`\n❓ ${question}\n`);

    const response = await agent.invoke({
      messages: [new HumanMessage(question)],
    });

    const lastMessage = response.messages[response.messages.length - 1];
    console.log(`\n✅ Final Answer: ${lastMessage.content}\n`);
    console.log("─".repeat(80));
  }

  console.log("\n💡 Key Observations:");
  console.log("   - Agent decides when to use the tool");
  console.log("   - Tool description guides agent's decision");
  console.log("   - Agent can chain multiple tool calls");
  console.log("   - Built on LangGraph for flexibility and control");
}

main().catch(console.error);
