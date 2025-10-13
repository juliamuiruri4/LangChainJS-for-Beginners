# Chapter 5: Function Calling & Tooling

In this chapter, you'll learn how to extend AI capabilities beyond text generation by enabling function calling and tooling. You'll discover how LLMs can invoke functions with structured arguments, create type-safe tools using Zod schemas, and build systems where AI can trigger real-world actions like API calls, database queries, or calculations. This foundational skill bridges the gap between AI reasoning and practical application capabilities.

## Prerequisites

- Completed [Chapter 4](../04-documents-embeddings-semantic-search/README.md)

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Understand what function calling is and why it matters
- Create tools with Zod schemas for type safety
- Bind tools to chat models
- Invoke tools and handle responses
- Build systems with multiple tools
- Apply best practices for tool design

---

## 📖 The Restaurant Staff Analogy

**Imagine you're a restaurant manager coordinating your team.**

When a customer orders "I'd like the daily special with no onions, a side salad, and sparkling water," you don't do everything yourself. Instead:

1. **You understand the request** (what they want)
2. **You delegate to specialists**:
   - 👨‍🍳 Chef: "Make the daily special, no onions" (function: prepare_meal)
   - 🥗 Salad station: "Prepare a side salad" (function: make_salad)
   - 🍷 Bar: "Serve sparkling water" (function: serve_beverage)
3. **Each specialist confirms** what they're doing
4. **You coordinate the response** back to the customer

**Function calling in AI works exactly the same way!**

The LLM:
- **Understands** the user's request
- **Generates structured function calls** with proper arguments
- **Returns** the function details (but doesn't execute them)
- **Processes** the function results to form a response

The key: The LLM doesn't *do* the actions—it *describes* which functions to call and with what parameters. Your code executes them.

---

## 🎯 What is Function Calling?

### The Problem

**Standard LLM**:
```
User: "What's the weather in Seattle?"
LLM: "I cannot access real-time weather data..."
```

**With Function Calling**:
```
User: "What's the weather in Seattle?"
LLM: [Generates] { function: "get_weather", args: { city: "Seattle" } }
Your Code: [Executes] Weather API call → 62°F, cloudy
LLM: [Responds] "It's currently 62°F and cloudy in Seattle."
```

### Key Characteristics

- **LLM generates** function calls (doesn't execute them)
- **Structured output** with type-safe parameters
- **Your code executes** the actual functions
- **Results go back** to the LLM for final response

---

## 🛠️ Creating Tools with Zod

In LangChain.js, tools are created using the `tool()` function with Zod schemas for type safety.

### Example 1: Simple Calculator Tool

**Code**: [`code/01-simple-tool.ts`](./code/01-simple-tool.ts)

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import "dotenv/config";

// Define calculator tool
const calculatorTool = tool(
  async (input) => {
    // Implement the actual function
    const sanitized = input.expression.replace(/[^0-9+\-*/().\s]/g, "");
    const result = Function(`"use strict"; return (${sanitized})`)();
    return `The result is: ${result}`;
  },
  {
    name: "calculator",
    description: "Useful for performing mathematical calculations. Use this when you need to compute numbers.",
    schema: z.object({
      expression: z.string().describe("The mathematical expression to evaluate, e.g., '25 * 4'"),
    }),
  }
);

console.log("Tool created:", calculatorTool.name);
console.log("Schema:", calculatorTool.schema);
```

**Key Components**:
- **Implementation function**: What the tool actually does
- **Name**: How the LLM refers to the tool
- **Description**: Helps the LLM decide when to use it
- **Schema**: Zod object defining parameters

---

## 🔗 Binding Tools to Models

Use `bindTools()` to make tools available to the LLM.

### Example 2: Binding and Invoking Tools

**Code**: [`code/02-tool-calling.ts`](./code/02-tool-calling.ts)

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import "dotenv/config";

const calculatorTool = tool(
  async (input) => {
    const result = eval(input.expression);
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

// Create model and bind tools
const model = new ChatOpenAI({
  model: process.env.AI_MODEL || "gpt-4o-mini",
  configuration: {
    baseURL: process.env.AI_ENDPOINT,
    defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
  },
  apiKey: process.env.AI_API_KEY,
});

const modelWithTools = model.bindTools([calculatorTool]);

// Invoke with a question
const response = await modelWithTools.invoke("What is 25 * 17?");

console.log("Response:", response);
console.log("\nTool calls:", response.tool_calls);

// The LLM returns structured tool calls:
// {
//   name: "calculator",
//   args: { expression: "25 * 17" },
//   id: "call_abc123"
// }
```

**What Happens**:
1. LLM sees the tool description
2. LLM generates a tool call with arguments
3. You execute the tool with those arguments
4. Pass results back to LLM for final answer

---

## 🔄 Handling Tool Execution

### Example 3: Complete Tool Call Loop

**Code**: [`code/03-tool-execution.ts`](./code/03-tool-execution.ts)

```typescript
const weatherTool = tool(
  async (input) => {
    // Simulate API call
    const temps = { Seattle: 62, Paris: 18, Tokyo: 24 };
    const temp = temps[input.city] || 72;
    return `Current temperature in ${input.city}: ${temp}°F`;
  },
  {
    name: "get_weather",
    description: "Get current weather for a city",
    schema: z.object({
      city: z.string().describe("City name"),
    }),
  }
);

const modelWithTools = model.bindTools([weatherTool]);

// Step 1: Get tool call from LLM
const response1 = await modelWithTools.invoke("What's the weather in Seattle?");
console.log("Tool call:", response1.tool_calls[0]);

// Step 2: Execute the tool
const toolCall = response1.tool_calls[0];
const toolResult = await weatherTool.invoke(toolCall.args);
console.log("Tool result:", toolResult);

// Step 3: Send result back to LLM
const messages = [
  { role: "user", content: "What's the weather in Seattle?" },
  response1, // LLM's tool call
  { role: "tool", content: toolResult, tool_call_id: toolCall.id },
];

const finalResponse = await model.invoke(messages);
console.log("Final answer:", finalResponse.content);
```

---

## 🎛️ Multiple Tools

LLMs can choose from multiple tools based on the query.

### Example 4: Multi-Tool System

**Code**: [`code/04-multiple-tools.ts`](./code/04-multiple-tools.ts)

```typescript
const calculatorTool = tool(
  async (input) => String(eval(input.expression)),
  {
    name: "calculator",
    description: "Perform mathematical calculations",
    schema: z.object({ expression: z.string() }),
  }
);

const searchTool = tool(
  async (input) => {
    // Simulated search
    const results = {
      "capital of France": "Paris",
      "population of Tokyo": "14 million",
    };
    return results[input.query] || "No results found";
  },
  {
    name: "search",
    description: "Search for factual information",
    schema: z.object({ query: z.string() }),
  }
);

const weatherTool = tool(
  async (input) => `Weather in ${input.city}: 72°F, sunny`,
  {
    name: "get_weather",
    description: "Get current weather",
    schema: z.object({ city: z.string() }),
  }
);

const modelWithTools = model.bindTools([calculatorTool, searchTool, weatherTool]);

// The LLM will choose the appropriate tool
const queries = [
  "What is 125 * 8?",
  "What's the capital of France?",
  "What's the weather in Tokyo?",
];

for (const query of queries) {
  const response = await modelWithTools.invoke(query);
  console.log(`\nQuery: ${query}`);
  console.log("Chosen tool:", response.tool_calls[0]?.name);
  console.log("Args:", response.tool_calls[0]?.args);
}
```

---

## ✅ Best Practices

### 1. Clear Tool Descriptions

```typescript
// ❌ Poor
description: "Does weather stuff"

// ✅ Good
description: "Get current weather for a specific city. Returns temperature, conditions, and humidity."
```

### 2. Descriptive Parameter Names

```typescript
// ❌ Poor
schema: z.object({
  x: z.string(),
  y: z.number(),
})

// ✅ Good
schema: z.object({
  city: z.string().describe("The city name, e.g., 'Paris' or 'Tokyo'"),
  units: z.enum(["celsius", "fahrenheit"]).describe("Temperature unit to return"),
})
```

### 3. Error Handling

```typescript
const safeTool = tool(
  async (input) => {
    try {
      const result = await dangerousOperation(input);
      return result;
    } catch (error) {
      return `Error: ${error.message}. Please try again with different parameters.`;
    }
  },
  {
    name: "safe_tool",
    description: "Performs operation with error handling",
    schema: z.object({ param: z.string() }),
  }
);
```

### 4. Validation

```typescript
const emailTool = tool(
  async (input) => {
    // Zod validates this automatically
    if (!input.email.includes("@")) {
      throw new Error("Invalid email format");
    }
    return `Email sent to ${input.email}`;
  },
  {
    name: "send_email",
    description: "Send an email",
    schema: z.object({
      email: z.string().email().describe("Valid email address"),
      subject: z.string().min(1).describe("Email subject"),
      body: z.string().describe("Email body content"),
    }),
  }
);
```

---

## 🎓 Key Takeaways

- ✅ **Function calling** lets LLMs trigger real-world actions
- ✅ **LLMs generate** function calls, but don't execute them
- ✅ **Tools** are created with `tool()` and Zod schemas
- ✅ **bindTools()** makes tools available to the model
- ✅ **Type safety** with Zod prevents errors
- ✅ **Clear descriptions** help LLMs choose the right tool
- ✅ **Error handling** makes tools robust
- ✅ **Multiple tools** enable complex capabilities

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Weather API Tool** - Create a weather tool with multiple parameters
2. **Database Query Tool** - Build a tool for data retrieval
3. **Multi-Tool System** - Combine calculation, search, and conversion tools
4. **Error Handling** - Build robust tools with validation

---

## 📚 Additional Resources

- [Tool Calling Documentation](https://js.langchain.com/docs/how_to/tool_calling/)
- [Custom Tools Guide](https://js.langchain.com/docs/how_to/custom_tools/)
- [Zod Documentation](https://zod.dev/)

---

## 🗺️ Navigation

- **Previous**: [04-documents-embeddings-semantic-search](../04-documents-embeddings-semantic-search/README.md)
- **Next**: [06-rag-systems](../06-rag-systems/README.md)
- **Home**: [Course Home](../README.md)

---

💬 **Questions or stuck?** Join our [Discord community](https://aka.ms/foundry/discord) or open a [GitHub Discussion](https://github.com/microsoft/langchainjs-for-beginners/discussions)!
