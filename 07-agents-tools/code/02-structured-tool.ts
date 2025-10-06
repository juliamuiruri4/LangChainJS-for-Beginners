/**
 * Example 2: Structured Tool with Schema
 *
 * Create tools with typed inputs using Zod schemas.
 *
 * Run: npx tsx 07-agents-tools/code/02-structured-tool.ts
 */

import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { z } from "zod";
import "dotenv/config";

async function main() {
  console.log("🏗️  Structured Tool Example\n");

  // Create a weather tool with structured input
  const weatherTool = new DynamicStructuredTool({
    name: "get_weather",
    description: "Get the current weather for a specific city. Use this when user asks about weather conditions.",
    schema: z.object({
      city: z.string().describe("The city name, e.g., 'Paris', 'Tokyo'"),
      country: z.string().optional().describe("Optional country code, e.g., 'US', 'JP'"),
      units: z.enum(["celsius", "fahrenheit"]).default("celsius").describe("Temperature units"),
    }),
    func: async ({ city, country, units }) => {
      // Simulated weather API call
      const temp = Math.floor(Math.random() * 30) + 5;
      const conditions = ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][
        Math.floor(Math.random() * 4)
      ];
      const unit = units === "celsius" ? "°C" : "°F";

      const location = country ? `${city}, ${country}` : city;
      return `Weather in ${location}: ${temp}${unit}, ${conditions}`;
    },
  });

  // Create a user info tool
  const userInfoTool = new DynamicStructuredTool({
    name: "get_user_info",
    description: "Get information about a user by their ID",
    schema: z.object({
      userId: z.string().describe("The user's unique identifier"),
      fields: z
        .array(z.enum(["name", "email", "location", "preferences"]))
        .describe("Which fields to retrieve"),
    }),
    func: async ({ userId, fields }) => {
      // Simulated user database
      const users: Record<string, any> = {
        "123": {
          name: "Alice Johnson",
          email: "alice@example.com",
          location: "Seattle",
          preferences: "Likes TypeScript and hiking",
        },
        "456": {
          name: "Bob Smith",
          email: "bob@example.com",
          location: "Austin",
          preferences: "Enjoys coffee and reading",
        },
      };

      const user = users[userId];
      if (!user) return `User ${userId} not found`;

      const result: Record<string, any> = {};
      fields.forEach((field) => {
        result[field] = user[field];
      });

      return JSON.stringify(result, null, 2);
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

  const tools = [weatherTool, userInfoTool];

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful assistant. Use the available tools to answer questions accurately.",
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
    maxIterations: 5,
  });

  // Test queries
  const queries = [
    "What's the weather like in Paris?",
    "Get the name and email for user 123",
    "What's the weather in Tokyo, Japan in fahrenheit?",
  ];

  for (const query of queries) {
    console.log("\n" + "=".repeat(80));
    console.log(`\n❓ ${query}\n`);

    const response = await agentExecutor.invoke({ input: query });

    console.log(`\n✅ ${response.output}\n`);
  }

  console.log("=".repeat(80));
  console.log("\n💡 Structured Tool Benefits:");
  console.log("   - Type-safe inputs with Zod");
  console.log("   - Better error messages");
  console.log("   - Auto-generated parameter descriptions");
  console.log("   - Input validation built-in");
}

main().catch(console.error);
