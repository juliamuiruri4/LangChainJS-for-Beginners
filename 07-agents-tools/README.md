# Chapter 7: Agents & Tools

## ⏱️ Lesson Overview

- **Estimated Time**: 90 minutes
- **Prerequisites**: Completed [Chapter 6](../06-rag-systems/README.md)
- **Difficulty**: Beginner

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Understand what AI agents are and how they work
- Create custom tools for agents to use
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
3. **Memory** - Conversation history
4. **Executor** - Runs the agent loop

---

## 🛠️ Creating Tools

### Example 1: Simple Calculator Tool

**Code**: [`code/01-simple-tool.ts`](./code/01-simple-tool.ts)

```typescript
import { DynamicTool } from "langchain/tools";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import "dotenv/config";

// Create a calculator tool
const calculatorTool = new DynamicTool({
  name: "calculator",
  description: "Performs basic math calculations. Input should be a math expression like '2 + 2' or '10 * 5'.",
  func: async (input: string) => {
    try {
      const result = eval(input);
      return `The result is: ${result}`;
    } catch (error) {
      return "Error: Invalid mathematical expression";
    }
  },
});

// Create agent
const model = new ChatOpenAI({
  model: process.env.AI_MODEL || "gpt-4o-mini",
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY,
});

const tools = [calculatorTool];

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant with access to tools."],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent = await createReactAgent({ llm: model, tools, prompt });
const agentExecutor = new AgentExecutor({ agent, tools });

// Use the agent
const result = await agentExecutor.invoke({
  input: "What is 25 * 17?",
});

console.log(result.output);
```

---

## 🔧 Structured Tools

For more complex tools, use structured input with Zod schemas:

### Example 2: Structured Tool

**Code**: [`code/02-structured-tool.ts`](./code/02-structured-tool.ts)

```typescript
import { DynamicStructuredTool } from "langchain/tools";
import { z } from "zod";

const weatherTool = new DynamicStructuredTool({
  name: "get_weather",
  description: "Get current weather for a city. Use this when user asks about weather.",
  schema: z.object({
    city: z.string().describe("The city name"),
    country: z.string().optional().describe("The country code (e.g., US, UK)"),
  }),
  func: async ({ city, country }) => {
    // Simulated API call
    const temp = Math.floor(Math.random() * 30) + 5;
    const conditions = ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)];

    return `Weather in ${city}${country ? `, ${country}` : ""}: ${temp}°C, ${conditions}`;
  },
});

// Use with agent...
```

**Benefits of Structured Tools**:
- Type-safe inputs
- Better error messages
- Auto-generated descriptions
- Validation built-in

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

### Example 3: Multi-Step Agent

**Code**: [`code/03-multi-tool-agent.ts`](./code/03-multi-tool-agent.ts)

```typescript
const searchTool = new DynamicTool({
  name: "search",
  description: "Search for information on the web",
  func: async (query) => {
    return `Found: ${query} is a topic related to...`;
  },
});

const calculatorTool = new DynamicTool({
  name: "calculator",
  description: "Do math calculations",
  func: async (expr) => eval(expr).toString(),
});

const tools = [searchTool, calculatorTool];

// Agent will automatically choose which tools to use
const result = await agentExecutor.invoke({
  input: "Search for the population of Tokyo, then multiply it by 2",
});

// Agent process:
// 1. Thought: Need to search for Tokyo population
// 2. Action: Use search tool
// 3. Observation: Found population is 14 million
// 4. Thought: Now need to multiply by 2
// 5. Action: Use calculator tool
// 6. Observation: Result is 28 million
// 7. Final Answer: "The population of Tokyo times 2 is 28 million"
```

---

## ⚠️ Error Handling

Agents can make mistakes. Handle them gracefully:

```typescript
const agentExecutor = new AgentExecutor({
  agent,
  tools,
  maxIterations: 5,  // Prevent infinite loops
  handleParsingErrors: true,  // Gracefully handle errors
  verbose: true,  // See what the agent is thinking
});
```

---

## 🎓 Key Takeaways

- ✅ **Agents make decisions**: They choose which tools to use
- ✅ **Tools extend capabilities**: Give LLMs superpowers
- ✅ **ReAct pattern**: Reason → Act → Observe → Repeat
- ✅ **Structured tools**: Use Zod for type-safe inputs
- ✅ **Error handling**: Set limits and handle failures
- ✅ **Multi-step reasoning**: Agents can chain tool uses

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

- [Agents Documentation](https://js.langchain.com/docs/modules/agents/)
- [Tools Guide](https://js.langchain.com/docs/modules/agents/tools/)
- [ReAct Paper](https://arxiv.org/abs/2210.03629)

---

## 🗺️ Navigation

- **Previous**: [06-rag-systems](../06-rag-systems/README.md)
- **Next**: [08-memory-conversations](../08-memory-conversations/README.md)
- **Home**: [Course Home](../README.md)

---

💬 **Questions or stuck?** Join our [Discord community](https://aka.ms/foundry/discord)!
