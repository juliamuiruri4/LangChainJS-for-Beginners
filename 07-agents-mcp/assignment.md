# Chapter 7 Assignment: Agents & MCP

## Overview

Practice building autonomous AI agents using the ReAct pattern, implementing agent loops that iterate until solving problems, and creating multi-tool systems where agents decide which tools to use and when.

## Prerequisites

- Completed [Chapter 7](./README.md)
- Run both code examples
- Understand the ReAct pattern and agent loops
- Completed Chapter 5 (Function Calling & Tooling)

---

## Challenge: Research Agent with ReAct Loop 🔍

**Goal**: Build an agent from scratch that uses the ReAct (Reasoning + Acting) pattern to answer questions requiring web search and calculations.

**Tasks**:
1. Create `research-agent.ts` in the `07-agents-mcp/code/` folder
2. Create two tools:
   - **Search Tool**: Simulates web search (return pre-defined results for common queries)
   - **Calculator Tool**: Performs mathematical calculations
3. Implement a manual agent loop (like Example 1) with:
   - Maximum 5 iterations
   - Clear console output showing each iteration's Thought → Action → Observation
   - Proper stopping condition when no more tool calls are needed
4. Build conversation history correctly (AIMessage + ToolMessage pattern)
5. Test with queries that require multiple steps

**Example Queries**:
- "What is the population of Tokyo multiplied by 2?"
  - Step 1: Search for Tokyo population
  - Step 2: Calculate population * 2
  - Step 3: Provide answer
- "Search for the capital of France and tell me how many letters are in its name"
  - Step 1: Search for capital of France
  - Step 2: Calculate letters in "Paris"
  - Step 3: Provide answer

**Success Criteria**:
- Agent implements complete ReAct loop (Reason → Act → Observe → Repeat)
- Console clearly shows each iteration with:
  - Iteration number
  - Thought (which tool the agent decided to use)
  - Action (tool name and arguments)
  - Observation (tool result)
- Agent stops when it has enough information (no more tool_calls)
- Correctly handles multi-step queries
- Maintains conversation history properly

**Hints**:
```typescript
// 1. Import required modules
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
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

// 3. Define tools
const searchTool = tool(
  async (input) => {
    // Simulated search
    return "Tokyo has a population of approximately 14 million";
  },
  {
    name: "search",
    description: "Find factual information.",
    schema: z.object({ query: z.string() })
  }
);

// 4. Bind tools to model
const modelWithTools = model.bindTools([searchTool, calculatorTool]);

// 5. Implement agent loop
let messages: any[] = [new HumanMessage(query)];
let iteration = 1;
const maxIterations = 5;

while (iteration <= maxIterations) {
  const response = await modelWithTools.invoke(messages);

  // Check if done (no more tool calls)
  if (!response.tool_calls || response.tool_calls.length === 0) {
    console.log(`Final Answer: ${response.content}`);
    break;
  }

  // Execute tool
  const toolCall = response.tool_calls[0];
  const toolResult = await searchTool.invoke(toolCall);

  // Add to conversation history
  messages.push(
    new AIMessage({ content: response.content, tool_calls: response.tool_calls }),
    new ToolMessage({ content: String(toolResult), tool_call_id: toolCall.id || "" })
  );

  iteration++;
}
```

**Expected Console Output**:
```
User: What is the population of Tokyo multiplied by 2?

Iteration 1:
  Thought: I should use the search tool
  Action: search({"query":"population of Tokyo"})
  Observation: Tokyo has a population of approximately 14 million

Iteration 2:
  Thought: I should use the calculator tool
  Action: calculator({"expression":"14000000 * 2"})
  Observation: 28000000

Iteration 3:
  Final Answer: The population of Tokyo multiplied by 2 is 28 million.
```

**Hints**:
- Use the agent loop structure from Example 1 in the chapter
- Remember to add both AIMessage and ToolMessage to conversation history
- Set maxIterations to prevent infinite loops

---

## Bonus Challenge: Multi-Step Planning Agent 🎯

**Goal**: Build an agent with multiple specialized tools that requires multi-step reasoning to solve complex queries.

**Tasks**:
1. Create `planning-agent.ts`
2. Create four specialized tools:
   - **Search Tool**: Find factual information
   - **Calculator Tool**: Perform calculations
   - **Unit Converter Tool**: Convert between units (miles/km, USD/EUR, etc.)
   - **Comparison Tool**: Compare two values and determine which is larger/smaller
3. Implement the agent loop with better formatting:
   - Color-coded output (use console colors if desired)
   - Summary at the end showing total iterations and tools used
   - Clear separation between iterations
4. Test with complex multi-step queries

**Complex Query Examples**:
- "What's the distance between London and Paris in miles, and is that more or less than 500 miles?"
  - Step 1: Search for distance (gets: ~343 km)
  - Step 2: Convert km to miles (gets: ~213 miles)
  - Step 3: Compare with 500 miles (gets: less than)
  - Step 4: Answer with complete information

- "Find the population of New York and Tokyo, calculate the difference, and tell me the result in millions"
  - Step 1: Search NY population
  - Step 2: Search Tokyo population
  - Step 3: Calculate difference
  - Step 4: Convert to millions
  - Step 5: Answer

**Success Criteria**:
- All four tools work correctly
- Agent uses multiple tools in sequence
- Each tool call builds on previous results
- Clear output showing the reasoning chain
- Handles queries requiring 3+ tool calls
- Summary shows agent's "thought process"

**Hints**:
```typescript
// 1. Import required modules (same as challenge)
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import "dotenv/config";

// 2. Create model (same as challenge)

// 3. Define four specialized tools
const searchTool = tool(/* ... */);
const calculatorTool = tool(/* ... */);
const unitConverter = tool(
  async (input) => {
    // Convert between units
    const result = input.value * conversionRate;
    return `${input.value} ${input.from} equals ${result} ${input.to}`;
  },
  {
    name: "unitConverter",
    description: "Convert between units (km/miles, USD/EUR).",
    schema: z.object({
      value: z.number(),
      from: z.string(),
      to: z.string()
    })
  }
);

const comparisonTool = tool(
  async (input) => {
    if (input.operation === "less") {
      return input.value1 < input.value2
        ? `${input.value1} is less than ${input.value2}`
        : `${input.value1} is not less than ${input.value2}`;
    }
    // Handle other operations...
  },
  {
    name: "comparisonTool",
    description: "Compare two values.",
    schema: z.object({
      value1: z.number(),
      value2: z.number(),
      operation: z.enum(["less", "greater", "equal", "difference"])
    })
  }
);

// 4. Bind all tools
const modelWithTools = model.bindTools([
  searchTool, calculatorTool, unitConverter, comparisonTool
]);

// 5. Track tools used
const toolsUsed: string[] = [];
toolsUsed.push(toolCall.name);

// 6. Display summary at end
console.log("📊 Agent Summary:");
console.log(`   • Total iterations: ${iteration - 1}`);
console.log(`   • Tools used: ${[...new Set(toolsUsed)].join(", ")}`);
```

**Advanced Features** (Optional):
- Add a `maxIterations` check that provides a helpful message if exceeded
- Implement error recovery (if a tool fails, agent should try an alternative)
- Add a `verbose` flag to show/hide detailed iteration information

**Example Output**:
```
🤖 Planning Agent: Multi-Step Query

Query: "What's the distance from London to Paris in miles, and is that more or less than 500 miles?"

Iteration 1:
  🤔 Thought: I need to find the distance between London and Paris
  🎬 Action: search({ query: "distance London to Paris" })
  👁️ Observation: The distance is approximately 343 kilometers

Iteration 2:
  🤔 Thought: I need to convert 343 km to miles
  🎬 Action: unitConverter({ value: 343, from: "km", to: "miles" })
  👁️ Observation: 343 kilometers equals 213 miles

Iteration 3:
  🤔 Thought: I need to compare 213 miles with 500 miles
  🎬 Action: comparisonTool({ value1: 213, value2: 500, operation: "less" })
  👁️ Observation: 213 is less than 500

Iteration 4:
  ✅ Final Answer: The distance from London to Paris is approximately 213 miles, which is less than 500 miles.

─────────────────────────────────────────────
📊 Agent Summary:
   • Total iterations: 4
   • Tools used: search, unitConverter, comparisonTool
   • Query solved successfully!
```

---

## Submission Checklist

Before finishing the course, make sure you've completed:

- [ ] Challenge: Research agent with ReAct loop
- [ ] Bonus: Multi-step planning agent (optional)

---

## Solutions

Solutions for all challenges are available in the [`solution/`](./solution/) folder. Try to complete the challenges on your own first!

---

## Need Help?

- **Agent loops**: Review Example 1 in [`code/01-basic-agent.ts`](./code/01-basic-agent.ts)
- **Tool selection**: Check Example 2 in [`code/02-multi-tool-agent.ts`](./code/02-multi-tool-agent.ts)
- **ReAct pattern**: Re-read the [ReAct section](./README.md#🧠-the-react-pattern) in the README
- **Message types**: Review how AIMessage and ToolMessage work in Example 1
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## What's Next?

Congratulations on completing the LangChain.js for Beginners course! 🎉

You've learned:
- ✅ Chat models and conversations
- ✅ Prompt engineering with templates
- ✅ Documents, embeddings, and semantic search
- ✅ Function calling and tooling
- ✅ RAG systems with LCEL
- ✅ Autonomous agents with ReAct pattern

### Continue Your Learning:

1. **Build a Real Project** - Apply what you've learned to solve actual problems
2. **Explore LangGraph** - For complex, stateful agents with branching logic
3. **Join the Community** - Share your projects and learn from others

**[Return to Course Home](../README.md)** | **[Visit Azure AI Foundry Discord](https://aka.ms/foundry/discord)**
