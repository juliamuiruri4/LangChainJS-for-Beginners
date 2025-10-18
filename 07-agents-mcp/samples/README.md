# Agent Samples - Advanced Manual Patterns

This folder contains advanced examples showing how to build agents manually without using `createAgent()`. These are educational resources for understanding how agents work under the hood.

## When to Use These Examples

**Use the manual loop patterns** if you:
- Want to understand the ReAct pattern implementation details
- Need complete control over the agent loop for custom logic
- Are building non-standard agent behaviors
- Want to debug agent decision-making step-by-step

**Use `createAgent()` (main course examples)** if you:
- Want production-ready agents with best practices built-in
- Prefer less boilerplate code
- Need standard agent behaviors
- Are building typical AI applications

## Available Samples

### 01-basic-agent-manual-loop.ts

Demonstrates the complete ReAct (Reasoning + Acting) pattern implemented manually:
- Manual iteration loop
- Explicit tool binding
- Manual message history management
- Step-by-step logging of Thought → Action → Observation

**Run**: `tsx 07-agents-mcp/samples/01-basic-agent-manual-loop.ts`

**What you'll learn**:
- How the ReAct pattern works internally
- Why agents need message history
- How tool calls are executed
- How agents decide when they're done

### 02-multi-tool-agent-manual.ts

Shows manual tool selection without the full agent loop:
- How models choose between multiple tools
- The role of tool descriptions in selection
- Tool binding with `bindTools()`

**Run**: `tsx 07-agents-mcp/samples/02-multi-tool-agent-manual.ts`

**What you'll learn**:
- How tool descriptions guide selection
- The difference between tool binding and execution
- When to use specific vs. general tool descriptions

## Comparison: Manual vs createAgent()

### Manual Loop Pattern
```typescript
const modelWithTools = model.bindTools([calculatorTool]);
let messages = [new HumanMessage(query)];
let iteration = 1;

while (iteration <= maxIterations) {
  const response = await modelWithTools.invoke(messages);

  if (!response.tool_calls || response.tool_calls.length === 0) {
    console.log(`Final Answer: ${response.content}`);
    break;
  }

  const toolCall = response.tool_calls[0];
  const toolResult = await calculatorTool.invoke(toolCall.args);

  messages.push(
    new AIMessage({ content: response.content, tool_calls: response.tool_calls }),
    new ToolMessage({ content: String(toolResult), tool_call_id: toolCall.id })
  );

  iteration++;
}
```

**Pros**:
- ✅ Full control over loop logic
- ✅ Custom logging and debugging
- ✅ Can modify agent behavior at each step
- ✅ Educational - see every detail

**Cons**:
- ❌ More boilerplate code
- ❌ Easy to make mistakes
- ❌ Must handle edge cases yourself
- ❌ Not the v1 recommended pattern

### createAgent() Pattern (Recommended)
```typescript
const agent = createAgent({
  model,
  tools: [calculatorTool]
});

const response = await agent.invoke({ messages: [new HumanMessage(query)] });
const lastMessage = response.messages[response.messages.length - 1];
console.log(lastMessage.content);
```

**Pros**:
- ✅ V1 recommended approach
- ✅ Less boilerplate
- ✅ Production-ready error handling
- ✅ Supports middleware for advanced patterns
- ✅ Consistent with LangChain.js ecosystem

**Cons**:
- ❌ Hides implementation details
- ❌ Less control over individual steps

## Key Takeaway

**For learning**: Study these manual examples to understand how agents work.

**For building**: Use `createAgent()` from the main course examples for production code.

The best approach is to understand the fundamentals (these samples), then use the abstractions (`createAgent()`) with confidence knowing what's happening under the hood!

---

Return to [Chapter 7 Main Examples](../README.md)
