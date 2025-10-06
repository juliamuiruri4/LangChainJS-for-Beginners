# Chapter 7 Assignment: Agents & Tools

## Overview

Practice creating AI agents that can use tools to solve complex, multi-step problems.

## Prerequisites

- Completed [Chapter 7](./README.md)
- Run all code examples
- Understand ReAct pattern and tool creation

---

## Challenge 1: Personal Assistant Agent 🤖

**Goal**: Build an agent with tools for common tasks.

**Tasks**:
1. Create `personal-assistant.ts` in the `07-agents-tools/code/` folder
2. Implement at least 4 tools:
   - **Date/Time tool**: Get current date, time, or both
   - **Reminder tool**: Save reminders (in-memory array)
   - **Note taker**: Save and retrieve notes
   - **Unit converter**: Convert between units (miles/km, F/C, etc.)
3. Build an agent that can:
   - Answer questions using multiple tools
   - Chain tool calls when needed
   - Provide helpful responses
4. Test with various queries

**Example Queries**:
- "What time is it?"
- "Set a reminder to call mom at 3pm"
- "Convert 100 miles to kilometers"
- "Save a note about tomorrow's meeting"

**Success Criteria**:
- All 4+ tools work correctly
- Agent uses appropriate tools
- Handles multi-step requests
- Clear, helpful responses

---

## Challenge 2: Research Agent 📚

**Goal**: Create an agent that can research topics and provide summaries.

**Tasks**:
1. Create `research-agent.ts`
2. Implement tools:
   - **Web search** (can simulate with pre-defined knowledge)
   - **Summarizer** (use LLM to summarize text)
   - **Citation formatter** (format sources)
3. Agent should:
   - Search for information
   - Summarize findings
   - Provide citations
4. Handle queries like:
   - "Research the history of JavaScript"
   - "Find information about machine learning and summarize it"

**Tool Examples**:
```typescript
const searchTool = new DynamicTool({
  name: "web_search",
  description: "Search for information online",
  func: async (query) => {
    // Your implementation or simulation
  }
});

const summarizerTool = new DynamicTool({
  name: "summarize",
  description: "Summarize long text into key points",
  func: async (text) => {
    const summary = await llm.invoke(`Summarize: ${text}`);
    return summary.content;
  }
});
```

**Success Criteria**:
- Searches for information
- Generates summaries
- Provides formatted output
- Includes source citations

---

## Challenge 3: Data Analysis Agent 📊

**Goal**: Build an agent that analyzes data and answers questions.

**Tasks**:
1. Create `data-analyst-agent.ts`
2. Create sample dataset (array of objects):
   ```typescript
   const salesData = [
     { product: "Widget A", sales: 150, revenue: 3000, month: "Jan" },
     { product: "Widget B", sales: 200, revenue: 5000, month: "Jan" },
     // ... more data
   ];
   ```
3. Implement tools:
   - **Filter data**: Filter by criteria
   - **Calculate stats**: Sum, average, min, max
   - **Find top items**: Top N by metric
   - **Compare**: Compare two items/periods
4. Agent answers analytical questions

**Example Questions**:
- "What was the total revenue in January?"
- "Which product had the highest sales?"
- "What's the average revenue per product?"
- "Compare Widget A and Widget B sales"

**Success Criteria**:
- Data tools work correctly
- Agent answers analytical questions
- Calculations are accurate
- Clear, formatted results

---

## Challenge 4: Error-Resilient Agent 🛡️

**Goal**: Build an agent that handles errors gracefully.

**Tasks**:
1. Create `resilient-agent.ts`
2. Create tools that sometimes fail:
   ```typescript
   const unreliableTool = new DynamicTool({
     name: "unreliable_api",
     description: "API that sometimes fails",
     func: async (input) => {
       if (Math.random() < 0.3) {
         throw new Error("API Error");
       }
       return "Success";
     }
   });
   ```
3. Implement error handling:
   - Try-catch in tools
   - Fallback tools
   - Retry logic
   - User-friendly error messages
4. Test resilience with intentional failures

**Features to Implement**:
- Tool-level error handling
- Agent-level fallbacks
- Maximum retry attempts
- Clear error reporting to user

**Success Criteria**:
- Handles tool failures gracefully
- Retries when appropriate
- Falls back to alternative approaches
- Never crashes, always responds

---

## Bonus Challenge: Multi-Agent System 🤝

**Goal**: Create multiple agents that collaborate.

**Tasks**:
1. Create `multi-agent-system.ts`
2. Build 3 specialized agents:
   - **Researcher**: Finds information
   - **Analyzer**: Analyzes data
   - **Writer**: Formats final output
3. Implement coordination:
   - Router decides which agent handles what
   - Agents can call each other
   - Final response combines all insights
4. Test with complex queries requiring multiple specializations

**Architecture**:
```typescript
// Coordinator agent decides which specialist to use
const coordinator = createAgent([
  researcherTool,
  analyzerTool,
  writerTool
]);

// Each tool is actually another agent
const researcherTool = new DynamicTool({
  name: "researcher",
  description: "Research information",
  func: async (query) => {
    return await researcherAgent.invoke(query);
  }
});
```

**Success Criteria**:
- Multiple specialized agents created
- Coordination works correctly
- Agents collaborate effectively
- Complex queries handled well

---

## Submission Checklist

Before moving to Chapter 8:

- [ ] Challenge 1: Personal assistant with 4+ tools
- [ ] Challenge 2: Research agent with search and summary
- [ ] Challenge 3: Data analysis agent
- [ ] Challenge 4: Error-resilient agent
- [ ] Bonus: Multi-agent system (optional)

---

## Solutions

Solutions available in [`solution/`](./solution/) folder. Try on your own first!

---

## Need Help?

- **Tool creation**: Review examples 1 & 2
- **Multi-tool agents**: Check example 3
- **Agent patterns**: Re-read the ReAct section
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## Next Steps

Ready for [Chapter 8: LangGraph: Memory & Conversations](../08-langgraph-memory-conversations/README.md)!

Amazing work building intelligent agents! 🎉
