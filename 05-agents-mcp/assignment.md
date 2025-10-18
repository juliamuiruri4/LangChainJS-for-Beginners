# Chapter 5 Assignment: Agents & MCP

## Overview

Practice building autonomous AI agents using the ReAct pattern, implementing agent loops that iterate until solving problems, and creating multi-tool systems where agents decide which tools to use and when.

## Prerequisites

- Completed [Chapter 5](./README.md)
- Run all code examples
- Understand the ReAct pattern and agent loops
- Completed Chapter 4 (Function Calling & Tools)

---

## Challenge: Research Agent 🔍

**Goal**: Build an agent using `createAgent()` that answers questions requiring web search and calculations.

**Tasks**:
1. Create `research-agent.ts` in the `05-agents-mcp/solution/` folder
2. Create two tools:
   - **Search Tool**: Simulates web search (return pre-defined results for common queries)
   - **Calculator Tool**: Performs mathematical calculations
3. Build an agent using `createAgent()` with both tools
4. Test with queries that require multiple steps
5. Display clear output showing which tools the agent used

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
- Agent uses `createAgent()` (the recommended v1 approach)
- Both tools are properly defined with clear descriptions
- Agent autonomously decides which tool to use for each query
- Agent correctly handles multi-step queries that require using both tools
- Clear console output shows which tools were used
- Agent provides accurate final answers

**Hints**:
```typescript
// 1. Import required modules
import { ChatOpenAI } from "@langchain/openai";
import { createAgent, HumanMessage, tool } from "langchain";
import * as z from "zod";
import "dotenv/config";

// 2. Create the ChatOpenAI model

// 3. Define your two tools using tool():
//    Search Tool - returns simulated search results for common queries
//    Calculator Tool - performs mathematical calculations
//    Each with proper Zod schema, name, and description

// 4. Create agent using createAgent():
//    Pass the model and array of tools
//    createAgent() handles the ReAct loop automatically!

// 5. Test with multi-step queries:
//    Use agent.invoke({ messages: [new HumanMessage(query)] })
//    The agent will autonomously decide which tools to use

// 6. Optional: Check which tools were used by examining:
//    response.messages.filter(msg => msg instanceof AIMessage && msg.tool_calls)
```

**Expected Behavior**:
- Query: "What is the population of Tokyo multiplied by 2?"
- Agent automatically:
  1. Uses search tool to find Tokyo's population (≈14 million)
  2. Uses calculator tool to multiply by 2
  3. Returns: "The population of Tokyo multiplied by 2 is 28 million."

**Hints**:
- Follow the pattern from Examples 1 and 2 in the chapter
- Use createAgent() - it handles the ReAct loop automatically
- Focus on creating well-described tools so the agent knows when to use them
- The agent will iterate through tools until it has enough information to answer

---

## Bonus Challenge: Multi-Step Planning Agent 🎯

**Goal**: Build an agent with multiple specialized tools using `createAgent()` that requires multi-step reasoning to solve complex queries.

**Tasks**:
1. Create `planning-agent.ts`
2. Create four specialized tools:
   - **Search Tool**: Find factual information
   - **Calculator Tool**: Perform calculations
   - **Unit Converter Tool**: Convert between units (miles/km, USD/EUR, etc.)
   - **Comparison Tool**: Compare two values and determine which is larger/smaller
3. Create agent using `createAgent()` with all four tools
4. Add helpful console output showing:
   - Which tools were used
   - Summary at the end showing total tool calls
5. Test with complex multi-step queries

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
- All four tools are properly defined with clear descriptions
- Agent uses `createAgent()` to handle multi-tool selection
- Agent autonomously uses multiple tools in sequence
- Handles queries requiring 3+ tool calls
- Clear output shows which tools were used
- Summary displays total tool usage

**Hints**:
```typescript
// 1. Import required modules (same as challenge)
import { ChatOpenAI } from "@langchain/openai";
import { createAgent, HumanMessage, AIMessage, tool } from "langchain";
import * as z from "zod";
import "dotenv/config";

// 2. Create the ChatOpenAI model

// 3. Define four specialized tools:
//    - Search Tool: Find factual information
//    - Calculator Tool: Perform calculations
//    - Unit Converter: Convert between units (value, from, to parameters)
//    - Comparison Tool: Compare values (value1, value2, operation parameters)
//    Each with clear names, descriptions, and Zod schemas

// 4. Create agent using createAgent():
//    Pass model and all four tools
//    The agent will handle tool selection automatically

// 5. Invoke agent with complex queries

// 6. Optional: Analyze response.messages to see which tools were used:
//    const toolCalls = response.messages
//      .filter(msg => msg instanceof AIMessage && msg.tool_calls)
//      .flatMap(msg => msg.tool_calls.map(tc => tc.name));
//    console.log("Tools used:", [...new Set(toolCalls)]);

// 7. Test with complex multi-step queries requiring 3+ tool calls
```

**Advanced Features** (Optional):
- Add detailed console output showing each tool call
- Display a summary of all tools used after the agent completes
- Track and display total execution time
- Add error handling for tool failures

**Example Output**:
```
🤖 Planning Agent: Multi-Step Query

Query: "What's the distance from London to Paris in miles, and is that more or less than 500 miles?"

🤖 Agent: The distance from London to Paris is approximately 213 miles, which is less than 500 miles.

─────────────────────────────────────────────
📊 Agent Summary:
   • Tools used: search, unitConverter, comparisonTool
   • Total tool calls: 3
   • Query solved successfully!
```

**Note**: The agent handles the ReAct loop internally, so you won't see individual iterations unless you add custom logging.

---

## Submission Checklist

Before moving to Chapter 6, make sure you've completed:

- [ ] Challenge: Research agent with ReAct loop
- [ ] Bonus: Multi-step planning agent (optional)

---

## Solutions

Solutions for all challenges are available in the [`solution/`](./solution/) folder. Try to complete the challenges on your own first!

---

## Need Help?

- **createAgent() basics**: Review Example 1 in [`code/01-create-agent-basic.ts`](./code/01-create-agent-basic.ts)
- **Multi-tool agents**: Check Example 2 in [`code/02-create-agent-multi-tool.ts`](./code/02-create-agent-multi-tool.ts)
- **ReAct pattern**: Re-read the [ReAct section](./README.md#🧠-the-react-pattern) in the README
- **Manual agent loops**: Check the [`samples/`](./samples/) folder for manual loop implementations
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## What's Next?

Now that you can build autonomous agents, you're ready to give them powerful retrieval capabilities!

**[Chapter 6: Documents, Embeddings & Semantic Search](../06-documents-embeddings-semantic-search/README.md)**

In the next chapter, you'll learn how to process documents and create semantic search systems that will become retrieval tools for your agents in Chapter 7!

Great work mastering agents! 🚀
