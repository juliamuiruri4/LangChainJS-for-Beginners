# LangChain.js v1 Updates Plan

## Overview
This plan documents the updates needed to align the course with LangChain.js v1 official documentation and best practices.

## Completed Tasks ✅

### 1. Package Updates
- ✅ Updated all packages to v1.0-alpha versions using `@next` tags
- ✅ Installed: `langchain@next` (1.0.0-alpha.9), `@langchain/core@next`, `@langchain/openai@next`, `@langchain/anthropic@next`
- ✅ Removed unused `@langchain/community` package

### 2. Build Fixes
- ✅ Fixed message typing errors (added `type BaseMessage` and explicit array typing)
- ✅ Updated token usage API from `response_metadata.tokenUsage` to `usage_metadata.input_tokens/output_tokens`
- ✅ Migrated all import paths:
  - Messages: `@langchain/core/messages` → `langchain`
  - Tools: `@langchain/core/tools` → `langchain`
  - Document loaders: → `@langchain/classic/document_loaders/*`
  - Vector stores: → `@langchain/classic/vectorstores/*`
  - Chains: → `@langchain/classic/chains/*`
  - Zod: `{ z }` → `* as z`

### 3. Pure V1 Package Migrations
- ✅ Text Splitters: Migrated from `@langchain/classic/text_splitter` to `@langchain/textsplitters`
- ✅ Document Class: Migrated from `@langchain/classic/document` to `@langchain/core/documents`
- ✅ Verified build passes (64 files, 0 errors)

### 4. @langchain/classic Investigation
**Findings:**
- `@langchain/classic@1.0.0-alpha.1` is an official v1 package (not legacy v0.x code)
- Description: "Old abstractions from LangChain.js"
- These components MUST stay in @langchain/classic (no v1 alternatives):
  - Document Loaders: `@langchain/classic/document_loaders/*`
  - Vector Stores: `@langchain/classic/vectorstores/memory`
  - Chains: `@langchain/classic/chains/*`

---

## Pending Content Updates

### Chapter 2: Chat Models & Basic Interactions

#### 1. Add "Understanding Messages" Section
**Location:** 02-chat-models/README.md

**Content to Add:**
Based on https://docs.langchain.com/oss/javascript/langchain/messages

- Explain the v1 message architecture
- SystemMessage: Sets behavior and context for the model
- HumanMessage: Represents user input
- AIMessage: Model responses (can include tool_calls)
- ToolMessage: Results from tool/function execution
- Message content types: string vs. structured content
- Emphasis on how messages maintain conversation context

**Code Sample to Create:**
```typescript
// File: 02-chat-models/code/02-understanding-messages.ts
/**
 * Understanding Message Types
 * Run: npx tsx 02-chat-models/code/02-understanding-messages.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
  type BaseMessage
} from "langchain";
import "dotenv/config";

async function main() {
  console.log("📨 Understanding Message Types\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
  });

  // 1. System Message - Sets the assistant's behavior
  console.log("1️⃣  SystemMessage: Sets behavior and personality\n");
  const messages1: BaseMessage[] = [
    new SystemMessage("You are a pirate captain. Speak like one!"),
    new HumanMessage("What's the weather like today?"),
  ];

  const response1 = await model.invoke(messages1);
  console.log("🏴‍☠️ Pirate response:", response1.content);

  // 2. Building Conversation Context
  console.log("\n2️⃣  Building Multi-Turn Conversations\n");
  const messages2: BaseMessage[] = [
    new SystemMessage("You are a helpful coding assistant."),
    new HumanMessage("What is recursion?"),
  ];

  const response2 = await model.invoke(messages2);
  console.log("👤 User: What is recursion?");
  console.log("🤖 AI:", response2.content);

  // Add AI response to history
  messages2.push(new AIMessage(String(response2.content)));

  // Follow-up question
  messages2.push(new HumanMessage("Can you show an example?"));
  const response3 = await model.invoke(messages2);
  console.log("\n👤 User: Can you show an example?");
  console.log("🤖 AI:", response3.content);

  // 3. Message Structure
  console.log("\n3️⃣  Message Structure and Properties\n");
  console.log("Message type:", response3.constructor.name);
  console.log("Message content type:", typeof response3.content);
  console.log("Has metadata:", !!response3.response_metadata);

  console.log("\n✅ Key Points:");
  console.log("   - SystemMessage controls AI behavior");
  console.log("   - HumanMessage represents user input");
  console.log("   - AIMessage stores model responses");
  console.log("   - Messages maintain conversation context");
}

main().catch(console.error);
```

#### 2. Add .batch() Method Section
**Location:** 02-chat-models/README.md

**Content to Add:**
- Explain batch processing for efficiency
- Use cases: processing multiple independent queries
- Performance benefits vs. sequential calls
- Cost and rate limiting considerations

**Code Sample to Create:**
```typescript
// File: 02-chat-models/code/07-batch-processing.ts
/**
 * Batch Processing with .batch()
 * Run: npx tsx 02-chat-models/code/07-batch-processing.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function main() {
  console.log("⚡ Batch Processing Example\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
  });

  // Sequential processing (slower)
  console.log("1️⃣  Sequential Processing:\n");
  console.time("Sequential");

  const questions = [
    "What is TypeScript?",
    "What is Python?",
    "What is Rust?",
  ];

  const sequentialResults = [];
  for (const question of questions) {
    const response = await model.invoke(question);
    sequentialResults.push(response.content);
  }

  console.timeEnd("Sequential");
  console.log(`Processed ${questions.length} questions sequentially\n`);

  // Batch processing (faster)
  console.log("2️⃣  Batch Processing:\n");
  console.time("Batch");

  const batchResults = await model.batch(questions);

  console.timeEnd("Batch");
  console.log(`Processed ${questions.length} questions in parallel\n`);

  // Display results
  console.log("📊 Results:\n");
  batchResults.forEach((result, i) => {
    console.log(`Q${i + 1}: ${questions[i]}`);
    console.log(`A${i + 1}: ${result.content.substring(0, 100)}...\n`);
  });

  console.log("✅ Benefits of batch processing:");
  console.log("   - Faster execution (parallel processing)");
  console.log("   - More efficient API usage");
  console.log("   - Better for processing multiple independent queries");
}

main().catch(console.error);
```

#### 3. Update Chapter 2 Assignment
**Location:** 02-chat-models/assignment.md

**Updates to Make:**
- Add exercise on using different message types
- Add exercise on batch processing
- Update solution to use proper v1 imports

---

### Chapter 7: Agents & Tools

#### 1. Add createAgent() Production Pattern
**Location:** 07-agents-mcp/README.md (or create new 07-agents/ chapter)

**Content to Add:**
Based on https://docs.langchain.com/oss/javascript/langchain/agents

- Explain `createAgent()` as the v1 recommended approach
- Differences from legacy `createReactAgent` (v0.x pattern)
- Setting up agent with tools
- Configuring agent behavior
- Production best practices

**Code Sample to Create:**
```typescript
// File: 07-agents-mcp/code/04-create-agent-pattern.ts
/**
 * Modern createAgent() Pattern (LangChain.js v1)
 * Run: npx tsx 07-agents-mcp/code/04-create-agent-pattern.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { tool, createAgent } from "langchain";
import * as z from "zod";
import "dotenv/config";

async function main() {
  console.log("🤖 Modern createAgent() Pattern\n");

  // 1. Define tools with proper schemas
  const calculatorTool = tool(
    async ({ expression }) => {
      try {
        // In production, use a safe math parser like mathjs
        const result = eval(expression);
        return `Result: ${result}`;
      } catch (error) {
        return `Error: Invalid expression`;
      }
    },
    {
      name: "calculator",
      description: "Performs mathematical calculations. Input should be a valid mathematical expression.",
      schema: z.object({
        expression: z.string().describe("The mathematical expression to evaluate"),
      }),
    }
  );

  const weatherTool = tool(
    async ({ location }) => {
      // Simulated weather API
      return `The weather in ${location} is sunny and 72°F`;
    },
    {
      name: "get_weather",
      description: "Gets current weather for a location",
      schema: z.object({
        location: z.string().describe("City name (e.g., 'Seattle')"),
      }),
    }
  );

  // 2. Create model
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
    temperature: 0,
  });

  // 3. Create agent with createAgent()
  const agent = createAgent({
    llm: model,
    tools: [calculatorTool, weatherTool],
  });

  // 4. Use the agent
  console.log("Testing agent with multiple tools:\n");

  const query = "What's 15 * 24, and what's the weather in Seattle?";
  console.log(`❓ Query: ${query}\n`);

  const result = await agent.invoke({ input: query });
  console.log("💡 Response:", result.output);

  console.log("\n✅ Key Points:");
  console.log("   - createAgent() is the v1 recommended pattern");
  console.log("   - Uses tool() function with Zod schemas");
  console.log("   - Cleaner API than legacy patterns");
  console.log("   - Better type safety and validation");
}

main().catch(console.error);
```

#### 2. Add Agent Memory/Checkpointer
**Location:** 07-agents-mcp/README.md

**Content to Add:**
Based on https://docs.langchain.com/oss/javascript/langchain/short-term-memory

- Explain agent memory for stateful agents
- MemorySaver for in-memory persistence
- PostgresSaver for production
- Checkpointing pattern for conversation continuity

**Code Sample to Create:**
```typescript
// File: 07-agents-mcp/code/05-agent-with-memory.ts
/**
 * Agent with Memory (Checkpointer Pattern)
 * Run: npx tsx 07-agents-mcp/code/05-agent-with-memory.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { tool, createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import * as z from "zod";
import "dotenv/config";

async function main() {
  console.log("💾 Agent with Memory\n");

  // Define a simple tool
  const noteTool = tool(
    async ({ note }) => {
      return `Saved note: "${note}"`;
    },
    {
      name: "save_note",
      description: "Saves a note for later reference",
      schema: z.object({
        note: z.string().describe("The note to save"),
      }),
    }
  );

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
  });

  // Create checkpointer for memory
  const checkpointer = new MemorySaver();

  // Create agent with memory
  const agent = createAgent({
    llm: model,
    tools: [noteTool],
    checkpointer,
  });

  // Session configuration
  const sessionConfig = { configurable: { thread_id: "user-123" } };

  // First interaction
  console.log("1️⃣  First message:\n");
  const response1 = await agent.invoke(
    { input: "My favorite color is blue" },
    sessionConfig
  );
  console.log("🤖:", response1.output);

  // Second interaction - agent remembers!
  console.log("\n2️⃣  Second message (agent has memory):\n");
  const response2 = await agent.invoke(
    { input: "What's my favorite color?" },
    sessionConfig
  );
  console.log("🤖:", response2.output);

  console.log("\n✅ Key Points:");
  console.log("   - MemorySaver provides in-memory conversation persistence");
  console.log("   - thread_id maintains separate conversations per user");
  console.log("   - For production, use PostgresSaver");
  console.log("   - Agent maintains context across invocations");
}

main().catch(console.error);
```

#### 3. Add LangGraph Brief Mention
**Location:** 07-agents-mcp/README.md

**Content to Add:**
- Brief introduction to LangGraph as the future of complex agent workflows
- Mention that it's covered in detail in Chapter 10
- Show simple example of why you'd need LangGraph (complex multi-step workflows)
- Point to official LangGraph documentation

**Section to Add:**
```markdown
## Beyond Simple Agents: Introduction to LangGraph

For simple agent tasks (single tool, straightforward reasoning), the patterns we've covered work great. But what about complex workflows with:
- Multiple decision points and branches
- Human-in-the-loop approvals
- Multi-agent collaboration
- Cyclic workflows (agents that loop until a condition is met)

That's where **LangGraph** comes in. LangGraph is LangChain's framework for building stateful, multi-step agent workflows as graphs.

**Quick Example - When You Need LangGraph:**
```typescript
// Simple agent (what we've learned)
const agent = createAgent({ llm: model, tools: [searchTool] });
await agent.invoke({ input: "Search for something" });

// Complex workflow (needs LangGraph)
// 1. Search for information
// 2. If results uncertain, ask human for clarification
// 3. Based on human input, decide: search again OR summarize OR give up
// 4. Generate final response
```

**LangGraph enables you to:**
- Model workflows as graphs with nodes (actions) and edges (transitions)
- Add conditional logic (if X then go to node A, else node B)
- Implement human-in-the-loop patterns
- Create cyclic workflows with loop detection

We'll dive deep into LangGraph in **Chapter 10**. For now, remember: simple agents use `createAgent()`, complex workflows use LangGraph.

**Learn More:**
- [LangGraph Documentation](https://langchain-ai.github.io/langgraphjs/)
- Chapter 10 of this course
```

#### 4. Update Chapter 7 Assignment
**Location:** 07-agents-mcp/assignment.md

**Updates to Make:**
- Add exercise using `createAgent()` pattern
- Add exercise with MemorySaver
- Update solutions to use v1 patterns

---

## Documentation Sources

All updates based on official LangChain.js v1 documentation:
- Overview: https://docs.langchain.com/oss/javascript/langchain/overview
- Agents: https://docs.langchain.com/oss/javascript/langchain/agents
- Models: https://docs.langchain.com/oss/javascript/langchain/models
- Messages: https://docs.langchain.com/oss/javascript/langchain/messages
- Tools: https://docs.langchain.com/oss/javascript/langchain/tools
- Streaming: https://docs.langchain.com/oss/javascript/langchain/streaming
- Short-term Memory: https://docs.langchain.com/oss/javascript/langchain/short-term-memory

Integration Docs:
- Text Splitters: https://docs.langchain.com/oss/javascript/integrations/splitters
- Vector Stores: https://docs.langchain.com/oss/javascript/integrations/vectorstores
- Text Embeddings: https://docs.langchain.com/oss/javascript/integrations/text_embedding

Migration Guide:
- https://docs.langchain.com/oss/javascript/migrate/langchain-v1

---

## Implementation Order

1. ✅ Package updates and build fixes (COMPLETED)
2. ✅ Pure v1 package migrations (COMPLETED)
3. 🔄 Chapter 2 updates (NEXT)
   - Add Understanding Messages section
   - Create 02-understanding-messages.ts
   - Add batch() method section
   - Create 07-batch-processing.ts
   - Update assignment.md
4. Chapter 7 updates
   - Add createAgent() pattern section
   - Create 04-create-agent-pattern.ts
   - Add agent memory section
   - Create 05-agent-with-memory.ts
   - Add LangGraph mention
   - Update assignment.md

---

## Notes

### Import Patterns Summary (v1)
```typescript
// ✅ Core functionality
import { SystemMessage, HumanMessage, AIMessage, type BaseMessage } from "langchain";
import { tool, createAgent } from "langchain";

// ✅ Models
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";

// ✅ Pure v1 packages (use these!)
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

// ✅ Classic packages (official v1 home for these)
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { createRetrievalChain } from "@langchain/classic/chains/retrieval";

// ✅ Zod (for tool schemas)
import * as z from "zod";

// ✅ LangGraph
import { MemorySaver } from "@langchain/langgraph";
```

### Token Usage API (v1)
```typescript
// ✅ V1 way
const usage = response.usage_metadata;
console.log(usage.input_tokens);
console.log(usage.output_tokens);
console.log(usage.total_tokens);
```
