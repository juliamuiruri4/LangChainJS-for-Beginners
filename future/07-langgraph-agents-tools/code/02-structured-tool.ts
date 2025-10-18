/**
 * Run: npx tsx 07-langgraph-agents-tools/code/02-structured-tool.ts
 */

import { tool } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "langchain";
import * as z from "zod";
import "dotenv/config";

async function main() {
  console.log("🏗️  Structured Tool Example\n");

  // Create a weather tool with structured input
  const weatherTool = tool(
    async (input) => {
      // Simulated weather API call
      const temp = Math.floor(Math.random() * 30) + 5;
      const conditions = ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][
        Math.floor(Math.random() * 4)
      ];
      const unit = input.units === "celsius" ? "°C" : "°F";

      const location = input.country ? `${input.city}, ${input.country}` : input.city;
      return `Weather in ${location}: ${temp}${unit}, ${conditions}`;
    },
    {
      name: "get_weather",
      description:
        "Get the current weather for a specific city. Use this when user asks about weather conditions.",
      schema: z.object({
        city: z.string().describe("The city name, e.g., 'Paris', 'Tokyo'"),
        country: z.string().optional().describe("Optional country code, e.g., 'US', 'JP'"),
        units: z.enum(["celsius", "fahrenheit"]).default("celsius").describe("Temperature units"),
      }),
    }
  );

  // Create a user info tool
  const userInfoTool = tool(
    async (input) => {
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

      const user = users[input.userId];
      if (!user) return `User ${input.userId} not found`;

      const result: Record<string, any> = {};
      input.fields.forEach((field) => {
        result[field] = user[field];
      });

      return JSON.stringify(result, null, 2);
    },
    {
      name: "get_user_info",
      description: "Get information about a user by their ID",
      schema: z.object({
        userId: z.string().describe("The user's unique identifier"),
        fields: z
          .array(z.enum(["name", "email", "location", "preferences"]))
          .describe("Which fields to retrieve"),
      }),
    }
  );

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
    tools: [weatherTool, userInfoTool],
  });

  const queries = [
    "What's the weather like in Paris?",
    "Get the name and email for user 123",
    "What's the weather in Tokyo, Japan in fahrenheit?",
  ];

  for (const query of queries) {
    console.log("\n" + "=".repeat(80));
    console.log(`\n❓ ${query}\n`);

    const response = await agent.invoke({
      messages: [new HumanMessage(query)],
    });

    const lastMessage = response.messages[response.messages.length - 1];
    console.log(`\n✅ ${lastMessage.content}\n`);
  }

  console.log("=".repeat(80));
  console.log("\n💡 Structured Tool Benefits:");
  console.log("   - Type-safe inputs with Zod");
  console.log("   - Better error messages");
  console.log("   - Auto-generated parameter descriptions");
  console.log("   - Input validation built-in");
}

main().catch(console.error);
