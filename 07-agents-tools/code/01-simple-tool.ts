/**
 * Example 1: Creating a Simple Tool
 *
 * Learn how to create custom tools that agents can use.
 *
 * Run: npx tsx 07-agents-tools/code/01-simple-tool.ts
 */

import { DynamicTool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import "dotenv/config";

async function main() {
  console.log("🛠️  Simple Tool Creation Example\n");

  // Create a calculator tool
  const calculatorTool = new DynamicTool({
    name: "calculator",
    description:
      "Useful for performing mathematical calculations. Input should be a math expression like '2 + 2' or '10 * 5'.",
    func: async (input: string) => {
      try {
        // Note: eval is used for demo only. Use a safe math parser in production!
        const result = eval(input);
        return `The result is: ${result}`;
      } catch (error) {
        return "Error: Invalid mathematical expression";
      }
    },
  });

  // Test the tool directly
  console.log("🧪 Testing tool directly:\n");
  const testResult = await calculatorTool.invoke("15 * 7 + 3");
  console.log(`   ${testResult}\n`);

  console.log("=".repeat(80));
  console.log("\n🤖 Using tool with an agent:\n");

  // Create agent
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    temperature: 0,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  const tools = [calculatorTool];

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant with access to a calculator tool. Use it when needed."],
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const agent = await createReactAgent({
    llm: model,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });

  // Test questions
  const questions = [
    "What is 25 multiplied by 4?",
    "Calculate 100 divided by 4, then add 17",
    "What's the square root of 144?", // May or may not work depending on eval
  ];

  for (const question of questions) {
    console.log(`\n❓ ${question}\n`);

    const response = await agentExecutor.invoke({
      input: question,
    });

    console.log(`\n✅ Final Answer: ${response.output}\n`);
    console.log("─".repeat(80));
  }

  console.log("\n💡 Key Observations:");
  console.log("   - Agent decides when to use the tool");
  console.log("   - Tool description guides agent's decision");
  console.log("   - Agent can chain multiple tool calls");
}

main().catch(console.error);
