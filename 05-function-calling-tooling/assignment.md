# Chapter 5 Assignment: Function Calling & Tooling

## Overview

Practice creating type-safe tools with Zod schemas, implementing the complete tool execution pattern, and building multi-tool systems that extend AI capabilities.

## Prerequisites

- Completed [Chapter 5](./README.md)
- Run all four code examples
- Understand tool creation, binding, and execution

---

## Challenge: Weather Tool with Complete Execution Loop ⛅

**Goal**: Build a weather tool and implement the complete 3-step execution pattern (generate → execute → respond).

**Tasks**:
1. Create `weather-tool.ts` in the `05-function-calling-tooling/code/` folder
2. Build a weather tool with Zod schema that accepts:
   - `city` (string, required) - The city name
   - `units` (enum: "celsius" or "fahrenheit", optional, default: "fahrenheit") - Temperature unit
3. Implement the tool to return simulated weather data for at least 5 cities
4. Implement the complete 3-step execution pattern:
   - **Step 1**: Get tool call from LLM
   - **Step 2**: Execute the tool
   - **Step 3**: Send result back to LLM for final response
5. Test with multiple queries using different cities and units

**Example Queries**:
- "What's the weather in Tokyo?"
- "Tell me the temperature in Paris in celsius"
- "Is it raining in London?"

**Success Criteria**:
- Tool uses proper Zod schema with `.describe()` for parameters
- Handles both celsius and fahrenheit units
- Implements all 3 steps of tool execution
- LLM generates natural language responses based on tool results
- Clear console output showing each step

**Hints**:
```typescript
// 1. Import required modules
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { ToolMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { z } from "zod";
import "dotenv/config";

// 2. Create the model
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

// 3. Define tool with Zod schema
const weatherTool = tool(
  async (input) => {
    // Your tool implementation
    return `Current weather in ${input.city}: ...`;
  },
  {
    name: "getWeather",
    description: "Get current weather information for a city.",
    schema: z.object({
      city: z.string().describe("City name, e.g., 'Tokyo' or 'Paris'"),
      units: z.enum(["celsius", "fahrenheit"]).optional().describe("Temperature unit")
    }),
  }
);

// 4. Bind tool to model
const modelWithTools = model.bindTools([weatherTool]);

// 5. Execute 3-step pattern
// Step 1: Get tool call from LLM
const response1 = await modelWithTools.invoke([new HumanMessage(query)]);
const toolCall = response1.tool_calls[0];

// Step 2: Execute the tool
const toolResult = await weatherTool.invoke(toolCall);

// Step 3: Send result back to LLM
const messages = [
  new HumanMessage(query),
  new AIMessage({ content: response1.content, tool_calls: response1.tool_calls }),
  new ToolMessage({ content: String(toolResult), tool_call_id: toolCall.id || "" })
];
const finalResponse = await model.invoke(messages);
```

---

## Bonus Challenge: Multi-Tool Travel Assistant 🌍

**Goal**: Build a system with multiple tools where the LLM automatically selects the appropriate tool for travel-related queries.

**Tasks**:
1. Create `travel-assistant.ts`
2. Build three specialized tools:
   - **Currency Converter**: Convert amounts between currencies (USD, EUR, GBP, JPY)
   - **Distance Calculator**: Calculate distance between two cities in miles or kilometers
   - **Time Zone Tool**: Get current time in a city and calculate time difference
3. Each tool should have:
   - Clear, descriptive name
   - Detailed description explaining when to use it
   - Proper Zod schema with parameter descriptions
4. Bind all three tools to the model
5. Test with queries that require different tools:
   - "Convert 100 USD to EUR"
   - "What's the distance between New York and London?"
   - "What time is it in Tokyo right now?"
   - "If it's 3pm in Seattle, what time is it in Paris?"

**Success Criteria**:
- All three tools work correctly
- LLM automatically chooses the right tool for each query
- Tool descriptions are clear enough to guide LLM selection
- Returns accurate simulated results
- Handles edge cases (invalid currencies, unknown cities)

**Hints**:
```typescript
// 1. Import required modules
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import "dotenv/config";

// 2. Create model
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

// 3. Define multiple tools
const currencyConverter = tool(
  async (input) => {
    // Conversion logic
    return `${input.amount} ${input.from} equals approximately ${result} ${input.to}`;
  },
  {
    name: "currencyConverter",
    description: "Convert amounts between currencies. Use when user asks about exchange rates.",
    schema: z.object({
      amount: z.number().describe("Amount to convert"),
      from: z.string().describe("Source currency code"),
      to: z.string().describe("Target currency code")
    })
  }
);

// Define other tools (distanceCalculator, timeZoneTool) similarly...

// 4. Bind all tools to model
const modelWithTools = model.bindTools([
  currencyConverter,
  distanceCalculator,
  timeZoneTool
]);

// 5. LLM automatically selects the right tool
const response = await modelWithTools.invoke(query);
const toolCall = response.tool_calls[0];
console.log(`LLM chose: ${toolCall.name}`);
```

**Advanced Feature** (Optional):
Add error handling that returns helpful error messages when:
- Invalid currency code provided
- Unknown city name
- Invalid input format

**Example Output**:
```
Query: "Convert 50 EUR to JPY"
→ LLM chose: currencyConverter
→ Args: { amount: 50, from: "EUR", to: "JPY" }
→ Result: "50 EUR equals approximately 8,100 JPY"

Query: "What's the distance from Paris to Rome?"
→ LLM chose: distanceCalculator
→ Args: { from: "Paris", to: "Rome", units: "kilometers" }
→ Result: "The distance from Paris to Rome is approximately 1,430 kilometers"
```

---

## Submission Checklist

Before moving to Chapter 6, make sure you've completed:

- [ ] Challenge: Weather tool with complete 3-step execution
- [ ] Bonus: Multi-tool travel assistant (optional)

---

## Solutions

Solutions for all challenges are available in the [`solution/`](./solution/) folder. Try to complete the challenges on your own first!

---

## Need Help?

- **Tool creation**: Review Example 1 in [`code/01-simple-tool.ts`](./code/01-simple-tool.ts)
- **Execution pattern**: Check Example 3 in [`code/03-tool-execution.ts`](./code/03-tool-execution.ts)
- **Multiple tools**: See Example 4 in [`code/04-multiple-tools.ts`](./code/04-multiple-tools.ts)
- **Zod schemas**: Review the [Zod section](./README.md#🛠️-creating-tools-with-zod) in the README
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## Next Steps

Once you've completed these challenges, you're ready for:

**[Chapter 6: Building RAG Systems](../06-rag-systems/README.md)**

Great work mastering function calling and tooling! 🚀
