/**
 * Example 3: Multi-Tool Agent
 *
 * Build an agent that can use multiple tools to solve complex tasks.
 *
 * Run: npx tsx 07-agents-tools/code/03-multi-tool-agent.ts
 */

import { DynamicTool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import "dotenv/config";

async function main() {
  console.log("🎯 Multi-Tool Agent Example\n");

  // Tool 1: Calculator
  const calculatorTool = new DynamicTool({
    name: "calculator",
    description: "Perform mathematical calculations. Input: math expression",
    func: async (input: string) => {
      try {
        const result = eval(input);
        return `${result}`;
      } catch (error) {
        return "Error in calculation";
      }
    },
  });

  // Tool 2: String reverser
  const reverserTool = new DynamicTool({
    name: "string_reverser",
    description: "Reverse a string. Input: text to reverse",
    func: async (input: string) => {
      return input.split("").reverse().join("");
    },
  });

  // Tool 3: Word counter
  const wordCounterTool = new DynamicTool({
    name: "word_counter",
    description: "Count words in a text. Input: text to count",
    func: async (input: string) => {
      const words = input.trim().split(/\s+/);
      return `${words.length} words`;
    },
  });

  // Tool 4: Search (simulated)
  const searchTool = new DynamicTool({
    name: "search",
    description: "Search for information. Input: search query",
    func: async (input: string) => {
      // Simulated search results
      const results: Record<string, string> = {
        "capital of France": "Paris",
        "largest ocean": "Pacific Ocean",
        "speed of light": "299,792,458 meters per second",
        "inventor of telephone": "Alexander Graham Bell",
      };

      const lowerInput = input.toLowerCase();
      for (const [key, value] of Object.entries(results)) {
        if (lowerInput.includes(key)) {
          return `Search result: ${value}`;
        }
      }

      return `No specific information found for: ${input}`;
    },
  });

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    configuration: {
      baseURL: "https://models.inference.ai.azure.com",
    },
    apiKey: process.env.GITHUB_TOKEN,
  });

  const tools = [calculatorTool, reverserTool, wordCounterTool, searchTool];

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful assistant with access to multiple tools:
- calculator: for math
- string_reverser: to reverse text
- word_counter: to count words
- search: to find information

Choose the right tool for each task. You can use multiple tools to solve complex problems.`,
    ],
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
    maxIterations: 10,
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

    const response = await agentExecutor.invoke({ input: question });

    console.log(`\n✅ Final Answer: ${response.output}\n`);
  }

  console.log("=".repeat(80));
  console.log("\n💡 Multi-Tool Agent Observations:");
  console.log("   - Agent chains tools together logically");
  console.log("   - Decides which tool to use based on context");
  console.log("   - Can solve multi-step problems");
  console.log("   - ReAct pattern: Reason → Act → Observe → Repeat");
}

main().catch(console.error);
