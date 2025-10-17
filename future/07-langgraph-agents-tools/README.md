# Chapter 7: LangGraph: Agents & Tools

In this chapter, you'll learn to build AI agents that can reason about problems and use tools to solve them autonomously. You'll create custom tools with type-safe schemas, build ReAct (Reasoning + Acting) agents using LangGraph, and combine multiple tools for complex tasks. Agents give your AI applications the ability to take actions, making them far more powerful than simple chat interactions.

## Prerequisites

- Completed [Chapter 6](../06-rag-systems/README.md)

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Understand what AI agents are and how they work
- Create custom tools for agents to use with LangGraph
- Build a ReAct (Reasoning + Acting) agent
- Handle tool errors and edge cases
- Combine multiple tools for complex tasks

---

## 📖 The Manager with Specialists Analogy

**Imagine you're a project manager with a team of specialists:**

- 📊 Data Analyst - can query databases
- 🔍 Researcher - can search the web
- 🧮 Accountant - can do calculations
- ✉️ Assistant - can send emails

When someone asks: *"What's our revenue growth this quarter compared to last year?"*

You (the manager) don't do everything yourself. You:
1. **Reason**: "I need data from the database and calculations"
2. **Act**: Ask the Data Analyst for revenue data
3. **Reason**: "Now I need to calculate the percentage change"
4. **Act**: Ask the Accountant to do the math
5. **Reason**: "Now I have the answer"
6. **Respond**: Give the final answer

**AI Agents work the same way!**

They:
- **Think** about what needs to be done
- **Choose** the right tool
- **Use** the tool
- **Evaluate** the result
- **Repeat** until they have the answer

---

## 🤖 What Are Agents?

### Standard LLM (No Agency)

```
User: "What's the weather in Paris?"
LLM: "I can't check current weather data..."
```

### Agent with Tools

```
User: "What's the weather in Paris?"
Agent: [Thinks] "I need to use the weather tool"
Agent: [Uses] Weather API for Paris
Agent: [Responds] "It's 18°C and partly cloudy in Paris"
```

### Key Components

1. **Agent** - The decision maker (LLM)
2. **Tools** - Actions the agent can take
3. **State** - Conversation history and data
4. **Graph** - Workflow orchestrating the agent loop

---

## 🛠️ Creating Tools with LangGraph

In modern LangChain.js, we use the `tool()` function with Zod schemas for type-safe tool creation.

### Example 1: Simple Calculator Tool

**Code**: [`code/01-simple-tool.ts`](./code/01-simple-tool.ts)

```typescript
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import "dotenv/config";

// Create a calculator tool with schema validation
const calculatorTool = tool(
  async (input) => {
    const sanitized = input.expression.replace(/[^0-9+\-*/().\s]/g, "");
    const result = Function(`"use strict"; return (${sanitized})`)();
    return `The result is: ${result}`;
  },
  {
    name: "calculator",
    description: "Useful for performing mathematical calculations.",
    schema: z.object({
      expression: z.string().describe("The mathematical expression to evaluate"),
    }),
  }
);

// Create agent with LangGraph
const model = new ChatOpenAI({
  model: process.env.AI_MODEL || "gpt-5-mini",
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY,
});

const agent = createReactAgent({
  llm: model,
  tools: [calculatorTool],
});

// Use the agent
const response = await agent.invoke({
  messages: [new HumanMessage("What is 25 * 17?")],
});

console.log(response.messages[response.messages.length - 1].content);
```

**Key Differences from Old Pattern**:
- ✅ Uses `tool()` function instead of `DynamicTool` class
- ✅ Uses `createReactAgent` from `@langchain/langgraph/prebuilt`
- ✅ No separate `AgentExecutor` needed
- ✅ Built on LangGraph for production flexibility

---

## 🔧 Structured Tools

All tools now use Zod schemas for type-safe inputs:

### Example 2: Structured Tool with Multiple Parameters

**Code**: [`code/02-structured-tool.ts`](./code/02-structured-tool.ts)

```typescript
const weatherTool = tool(
  async (input) => {
    const temp = Math.floor(Math.random() * 30) + 5;
    const conditions = ["Sunny", "Cloudy", "Rainy"][Math.floor(Math.random() * 3)];
    const unit = input.units === "celsius" ? "°C" : "°F";

    const location = input.country ? `${input.city}, ${input.country}` : input.city;
    return `Weather in ${location}: ${temp}${unit}, ${conditions}`;
  },
  {
    name: "get_weather",
    description: "Get current weather for a city.",
    schema: z.object({
      city: z.string().describe("The city name, e.g., 'Paris', 'Tokyo'"),
      country: z.string().optional().describe("Optional country code"),
      units: z.enum(["celsius", "fahrenheit"]).default("celsius"),
    }),
  }
);
```

**Benefits of Modern Tool Pattern**:
- ✅ Type-safe inputs with Zod validation
- ✅ Better error messages
- ✅ Auto-generated parameter descriptions
- ✅ Validation built-in before tool execution

---

## 🧠 ReAct Pattern

ReAct = **Rea**soning + **Act**ing

The agent follows this loop:

```
1. Thought: What should I do?
2. Action: Use a tool
3. Observation: What did the tool return?
4. (Repeat or finish)
5. Final Answer: Respond to user
```

### Example 3: Multi-Tool Agent

**Code**: [`code/03-multi-tool-agent.ts`](./code/03-multi-tool-agent.ts)

```typescript
const calculatorTool = tool(async (input) => {
  const sanitized = input.expression.replace(/[^0-9+\-*/().\s]/g, "");
  return Function(`"use strict"; return (${sanitized})`)();
}, {
  name: "calculator",
  description: "Perform mathematical calculations",
  schema: z.object({ expression: z.string() }),
});

const searchTool = tool(async (input) => {
  // Simulated search
  return `Search result for: ${input.query}`;
}, {
  name: "search",
  description: "Search for information",
  schema: z.object({ query: z.string() }),
});

const agent = createReactAgent({
  llm: model,
  tools: [calculatorTool, searchTool],
});

// Agent will automatically choose which tools to use
const response = await agent.invoke({
  messages: [new HumanMessage("What is 25 * 4, then reverse the result?")],
});

// Agent process:
// 1. Thought: Need to calculate 25 * 4
// 2. Action: Use calculator tool with "25 * 4"
// 3. Observation: Result is 100
// 4. Thought: Need to reverse "100"
// 5. Action: Use string reverser tool with "100"
// 6. Observation: Result is "001"
// 7. Final Answer: "001"
```

---

## ⚠️ Error Handling

Agents can make mistakes. The modern pattern handles them gracefully:

```typescript
// LangGraph's createReactAgent has built-in error handling
const agent = createReactAgent({
  llm: model,
  tools: [tool1, tool2],
  // Optional: customize behavior
  messageModifier: systemPrompt,  // Add custom instructions
});

// The agent automatically:
// - Validates tool inputs with Zod
// - Handles tool execution errors
// - Prevents infinite loops
// - Provides clear error messages
```

---

## 🎓 Key Takeaways

- ✅ **Agents make decisions**: They choose which tools to use
- ✅ **Tools extend capabilities**: Give LLMs superpowers
- ✅ **Modern pattern**: Use `tool()` + `createReactAgent` from LangGraph
- ✅ **Type safety**: Zod schemas validate all inputs
- ✅ **ReAct pattern**: Reason → Act → Observe → Repeat
- ✅ **Production ready**: Built on LangGraph for flexibility
- ✅ **No deprecated APIs**: Uses latest LangChain.js patterns

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Personal Assistant** - Build an agent with multiple tools
2. **Research Agent** - Create a web research assistant
3. **Data Analysis Agent** - Build a data processing agent
4. **Error-Resilient Agent** - Handle edge cases

---

## 📚 Additional Resources

- [LangGraph Agents Documentation](https://langchain-ai.github.io/langgraphjs/)
- [Tool Creation Guide](https://js.langchain.com/docs/how_to/custom_tools/)
- [ReAct Paper](https://arxiv.org/abs/2210.03629)

---

## 🗺️ Navigation

- **Previous**: [06-rag-systems](../06-rag-systems/README.md)
- **Next**: [08-langgraph-memory-conversations](../08-langgraph-memory-conversations/README.md)
- **Home**: [Course Home](../README.md)

---

## 💬 Questions or stuck? Join our [Discord community](https://aka.ms/foundry/discord)!
