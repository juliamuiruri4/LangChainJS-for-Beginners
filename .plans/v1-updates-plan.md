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

## Status Update (2025-10-17)

**All Core V1 Migration: ✅ COMPLETE**
- All 37 code examples verified working with gpt-5-mini
- All imports using correct v1 patterns
- Build passing (64 files, 0 errors)
- All README code verified to match actual .ts files
- See: `.plans/gpt-5-mini-verification-complete.md`

---

## Optional Content Enhancements

> **Note**: These are educational enhancements, not required for v1 compliance.
> The course is fully functional and v1-compliant without these additions.

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

> **IMPORTANT CORRECTION**: After reviewing v1 docs and current codebase:
> - There is NO `createAgent()` function in LangChain.js v1
> - Current course uses correct v1 pattern: manual ReAct loop with `bindTools()`
> - This is the recommended approach for simple agents
> - For complex workflows, use LangGraph (beyond scope of this course)

**Current Agent Pattern (CORRECT v1 approach):**
```typescript
// What the course already teaches (✅ This is correct!)
const modelWithTools = model.bindTools([calculatorTool]);
let messages = [new HumanMessage(query)];

while (iteration <= maxIterations) {
  const response = await modelWithTools.invoke(messages);
  if (!response.tool_calls) break;

  const toolResult = await calculatorTool.invoke(toolCall.args);
  messages.push(new AIMessage({ content, tool_calls }));
  messages.push(new ToolMessage({ content: toolResult }));
}
```

**Status**: ✅ Chapter 7 already uses correct v1 patterns, no changes needed

#### Optional: Add Agent Memory/Checkpointer (LangGraph)
**Location:** 07-agents-mcp/README.md or dedicated LangGraph chapter

**Why This is Optional:**
- LangGraph is a separate framework (requires @langchain/langgraph)
- Current course scope is LangChain.js basics
- Memory/checkpointing is an advanced topic
- Could be added in an advanced course/chapter

**If Added:**
- Show conversational RAG pattern (already exists in 06-rag-systems/solution/conversational-rag.ts)
- This demonstrates memory at the application level (storing messages array)
- More appropriate for beginners than LangGraph checkpointing

#### Optional: Add LangGraph Brief Mention
**Location:** 07-agents-mcp/README.md

**Content to Add:**
- Brief introduction to LangGraph as the future of complex agent workflows
- Mention that it's covered in detail in Chapter 10
- Show simple example of why you'd need LangGraph (complex multi-step workflows)
- Point to official LangGraph documentation

**Section to Add:**
```markdown
## Beyond Simple Agents: When to Use LangGraph

The agent patterns in this course (manual ReAct loops with `bindTools()`) work great for:
- ✅ Single-tool or few-tool scenarios
- ✅ Straightforward sequential reasoning
- ✅ Educational purposes (understanding how agents work)

But for complex workflows, you need **LangGraph**:
- Multi-step workflows with branching logic
- Human-in-the-loop approvals
- Multi-agent collaboration
- Cyclic workflows (loop until condition met)
- State persistence across sessions

**Example - When You Need LangGraph:**
```typescript
// Simple agent (what this course teaches) ✅
const modelWithTools = model.bindTools([searchTool]);
// Manual ReAct loop...

// Complex workflow (use LangGraph)
// 1. Search for information
// 2. If results uncertain → ask human for clarification
// 3. Based on human input → decide: search again OR summarize OR exit
// 4. Generate final response with memory persistence
```

**Learn More:**
- [LangGraph.js Documentation](https://langchain-ai.github.io/langgraphjs/)
- [LangGraph.js GitHub](https://github.com/langchain-ai/langgraphjs)
```

**Status**: ✅ No changes needed to Chapter 7 - current examples are correct
---

## Current State Summary

### ✅ What's Complete and Correct

**All V1 Compliance:**
- ✅ Package.json using v1.0-alpha packages
- ✅ All imports using correct v1 patterns
- ✅ All 37 examples working with gpt-5-mini
- ✅ Build passing (64 files, 0 errors)
- ✅ README code matches actual .ts files
- ✅ Agent patterns use correct v1 approach (bindTools + manual loop)

**Chapter Coverage:**
- ✅ Chapter 2: Chat models, streaming, parameters, error handling, token tracking
- ✅ Chapter 3: Prompt templates, few-shot, composition, structured outputs
- ✅ Chapter 4: Document loading, splitting, embeddings, vector stores
- ✅ Chapter 5: Function calling, tools with Zod schemas
- ✅ Chapter 6: RAG systems (simple and conversational)
- ✅ Chapter 7: Agents with ReAct pattern, MCP integration

### Optional Enhancements (Not Required for V1)

**Could Add (Educational Value):**
1. Chapter 2: Message types deep-dive (SystemMessage, HumanMessage, AIMessage, ToolMessage)
2. Chapter 2: Batch processing with `.batch()` method
3. Chapter 7: LangGraph introduction (as separate advanced topic)

**Should NOT Add:**
1. ❌ `createAgent()` - doesn't exist in v1
2. ❌ Complex agent patterns - current manual ReAct loop is the v1 way

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

## Implementation Status

**Phase 1: V1 Migration** ✅ **COMPLETE**
1. ✅ Package updates to v1.0-alpha
2. ✅ Build fixes (73 errors → 0 errors)
3. ✅ Import path migrations (messages, tools, document loaders, vector stores, chains)
4. ✅ Pure v1 package migrations (textsplitters, documents)
5. ✅ Token usage API update (response_metadata → usage_metadata)
6. ✅ Message typing (BaseMessage[] with explicit types)

**Phase 2: Verification & Documentation** ✅ **COMPLETE**
1. ✅ All 37 examples verified working
2. ✅ README code verified to match actual files
3. ✅ Fixed multi-turn conversation code mismatch
4. ✅ Updated token counts for gpt-5-mini
5. ✅ Verified all "How It Works" sections accurate
6. ✅ Created comprehensive verification docs

**Phase 3: Optional Enhancements** ⏸️ **ON HOLD**
- Educational content additions (messages deep-dive, batch processing)
- Not required for v1 compliance
- Course is fully functional without these
- Could be added based on student feedback

---

## Notes

### Import Patterns Summary (v1) - VERIFIED WORKING

```typescript
// ✅ Core functionality (messages, tools)
import { SystemMessage, HumanMessage, AIMessage, ToolMessage, type BaseMessage } from "langchain";
import { tool } from "langchain";  // Note: NO createAgent in v1!

// ✅ Models
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";

// ✅ Pure v1 packages
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

// ✅ Classic packages (official v1 location for traditional RAG)
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { createRetrievalChain } from "@langchain/classic/chains/retrieval";
import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents";

// ✅ Prompts
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

// ✅ Embeddings
import { OpenAIEmbeddings } from "@langchain/openai";

// ✅ Zod (for tool schemas)
import * as z from "zod";

// ✅ MCP (for Model Context Protocol)
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
```

### Token Usage API (v1) - VERIFIED
```typescript
// ✅ V1 way (CORRECT)
const usage = response.usage_metadata;
console.log(usage.input_tokens);      // Was: promptTokens
console.log(usage.output_tokens);     // Was: completionTokens
console.log(usage.total_tokens);      // Same name

// ❌ V0 way (OLD - Don't use)
const usage = response.response_metadata?.tokenUsage;
console.log(usage.promptTokens);
console.log(usage.completionTokens);
```

### Agent Pattern (v1) - VERIFIED
```typescript
// ✅ V1 way - Manual ReAct loop (CORRECT approach for simple agents)
const modelWithTools = model.bindTools([tool1, tool2]);
let messages: BaseMessage[] = [new HumanMessage(query)];

while (iteration <= maxIterations) {
  const response = await modelWithTools.invoke(messages);

  if (!response.tool_calls || response.tool_calls.length === 0) {
    // Final answer
    break;
  }

  // Execute tool
  const toolCall = response.tool_calls[0];
  const toolResult = await tool.invoke(toolCall.args);

  // Update conversation
  messages.push(
    new AIMessage({ content: response.content, tool_calls: response.tool_calls }),
    new ToolMessage({ content: String(toolResult), tool_call_id: toolCall.id })
  );

  iteration++;
}

// ❌ There is NO createAgent() function in v1
// The course correctly teaches manual ReAct loops
```

---

## Verification Artifacts

**Documentation Created:**
1. `.plans/readme-fixes-summary.md` - Systematic v1 import updates
2. `.plans/verification-complete-summary.md` - Initial gpt-4o-mini verification
3. `.plans/gpt-5-mini-verification-complete.md` - Complete gpt-5-mini verification

**Test Results:**
- 37 TypeScript examples tested: 37/37 passing ✅
- Build: 64 files, 0 errors ✅
- All README code blocks verified ✅

---

## Conclusion

**The course is now fully v1 compliant and production-ready.**

No further migration work required. Optional educational enhancements could be added based on student feedback, but the core v1 migration is complete and verified.
