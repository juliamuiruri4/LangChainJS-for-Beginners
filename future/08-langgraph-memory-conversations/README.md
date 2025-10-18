# Chapter 8: LangGraph: Memory & Conversations

In this chapter, you'll learn to build stateful chatbots that remember conversation history using LangGraph's MemorySaver. You'll explore different memory patterns (buffer, window, and summary), implement thread-based conversations for multi-user applications, and learn production-ready persistence strategies using database checkpointers. Memory transforms simple one-off AI interactions into natural, context-aware conversations.

## Prerequisites

- Completed [Chapter 7](../07-langgraph-agents-tools/README.md)

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Understand different types of memory in LangChain
- Implement conversation history with LangGraph
- Use buffer, window, and summary memory patterns
- Build stateful chatbots with MemorySaver
- Manage memory in production

---

## 📖 The Amnesia Analogy

**Imagine talking to someone with amnesia:**

```
You: "Hi, I'm Alex. I love hiking."
Them: "Nice to meet you!"

You: "What's my name?"
Them: "I... don't know. Who are you?"
```

😞 Frustrating, right?

**This is how LLMs work by default!** Each request is independent:

```
User: "My name is Sarah"
Bot: "Nice to meet you, Sarah!"

User: "What's my name?"
Bot: "I don't have information about your name"
```

**Memory fixes this with LangGraph:**

```typescript
// With MemorySaver
User: "My name is Sarah"
Bot: "Nice to meet you, Sarah!"

User: "What's my name?"
Bot: "Your name is Sarah!"  // Remembers via checkpointer!
```

---

## 🧠 Types of Memory

### 1. Buffer Memory

Stores **all** messages in the conversation.

**Pros**: Full context, nothing lost
**Cons**: Can exceed token limits, expensive
**Use when**: Short conversations, need full history

### 2. Window Memory

Stores only the **last N** messages.

**Pros**: Fixed memory size, efficient
**Cons**: Forgets older context
**Use when**: Long conversations, want recent context only

### 3. Summary Memory

Summarizes old messages, keeps recent ones.

**Pros**: Balance between context and efficiency
**Cons**: May lose details in summarization
**Use when**: Very long conversations, need efficiency

---

## 💻 Implementing Memory with LangGraph

Modern LangChain.js uses **LangGraph with `MemorySaver`** for conversation memory.

### Example 1: Buffer Memory

**Code**: [`code/01-buffer-memory.ts`](./code/01-buffer-memory.ts)

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, START, END, MemorySaver, MessagesAnnotation } from "@langchain/langgraph";
import { HumanMessage } from "langchain";
import "dotenv/config";

const model = new ChatOpenAI({
  model: process.env.AI_MODEL || "gpt-5-mini",
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY,
});

// Define chatbot node
const callModel = async (state: typeof MessagesAnnotation.State) => {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
};

// Create workflow with memory
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

// Compile with MemorySaver for automatic persistence
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

// Use with thread ID for conversation tracking
const config = { configurable: { thread_id: "conversation-1" } };

// First exchange
await app.invoke(
  { messages: [new HumanMessage("Hi, my name is Alice and I'm a developer.")] },
  config
);

// Later exchange - bot remembers!
const response = await app.invoke(
  { messages: [new HumanMessage("What's my name and occupation?")] },
  config
);

console.log(response.messages[response.messages.length - 1].content);
// Output: "Your name is Alice and you're a developer."
```

**Key Features**:
- ✅ `MemorySaver` automatically stores conversation history
- ✅ Thread-based conversation tracking with `thread_id`
- ✅ No manual memory management needed
- ✅ Production-ready pattern

---

### Example 2: Window Memory

**Code**: [`code/02-window-memory.ts`](./code/02-window-memory.ts)

```typescript
import { trimMessages } from "langchain";

// Create message trimmer to keep only last N messages
const trimmer = trimMessages({
  maxTokens: 200,
  strategy: "last",
  tokenCounter: model,
});

// Define chatbot node with trimming
const callModel = async (state: typeof MessagesAnnotation.State) => {
  const trimmedMessages = await trimmer.invoke(state.messages);
  const response = await model.invoke(trimmedMessages);
  return { messages: [response] };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

const app = workflow.compile({ checkpointer: new MemorySaver() });

// Full history is stored, but only last ~200 tokens are sent to the model
await app.invoke({ messages: [new HumanMessage("I love hiking.")] }, config);
await app.invoke({ messages: [new HumanMessage("I work in Seattle.")] }, config);

// Model only sees recent messages, but full history is preserved
```

**Benefits**:
- ✅ Controls token usage while preserving full history
- ✅ Prevents hitting model token limits
- ✅ Flexible token management per call

---

### Example 3: Summary Memory

**Code**: [`code/03-summary-memory.ts`](./code/03-summary-memory.ts)

```typescript
import { Annotation } from "@langchain/langgraph";

const ConversationState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (left, right) => left.concat(right),
    default: () => [],
  }),
  summary: Annotation<string>({
    reducer: (_, right) => right ?? "",
    default: () => "",
  }),
});

// Node to summarize old messages
const summarizeConversation = async (state: typeof ConversationState.State) => {
  if (state.messages.length < 6) return {};

  const messagesToSummarize = state.messages.slice(0, -4);
  const recentMessages = state.messages.slice(-4);

  const summaryPrompt = `Summarize: ${messagesToSummarize.map(m => m.content).join('\n')}`;
  const summaryResponse = await model.invoke([new HumanMessage(summaryPrompt)]);

  return {
    summary: String(summaryResponse.content),
    messages: recentMessages,
  };
};

// Node to handle conversation with summary as context
const callModel = async (state: typeof ConversationState.State) => {
  const contextMessages = [];

  if (state.summary) {
    contextMessages.push(new SystemMessage(`Summary: ${state.summary}`));
  }

  contextMessages.push(...state.messages);
  const response = await model.invoke(contextMessages);
  return { messages: [response] };
};

const workflow = new StateGraph(ConversationState)
  .addNode("summarize", summarizeConversation)
  .addNode("model", callModel)
  .addEdge(START, "summarize")
  .addEdge("summarize", "model")
  .addEdge("model", END);

const app = workflow.compile({ checkpointer: new MemorySaver() });
```

**Advantages**:
- ✅ Balances context retention and token usage
- ✅ Keeps recent messages verbatim
- ✅ Summarizes older context
- ✅ Great for very long conversations

---

## 🏭 Production Considerations

### 1. Thread-Based Conversations

```typescript
// Different conversations for different users
const user1Config = { configurable: { thread_id: "user-123" } };
const user2Config = { configurable: { thread_id: "user-456" } };

await app.invoke({ messages: [new HumanMessage("Hello")] }, user1Config);
await app.invoke({ messages: [new HumanMessage("Hi")] }, user2Config);
```

### 2. Persistent Storage

In production, use a database instead of `MemorySaver`:

```typescript
// PostgreSQL checkpointer (example)
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

const checkpointer = new PostgresSaver({
  connectionString: process.env.DATABASE_URL,
});

const app = workflow.compile({ checkpointer });
```

### 3. Memory Limits

Control conversation size:

```typescript
const trimmer = trimMessages({
  maxTokens: 2000,  // Prevent exceeding model limits
  strategy: "last",
  includeSystem: true,  // Always keep system message
});
```

---

## 🗄️ Production Checkpointers

For development, `MemorySaver` works great. But for production, you'll want persistent storage that survives restarts.

### Available Checkpointers

| Checkpointer | Use Case | Persistence |
|--------------|----------|-------------|
| **MemorySaver** | Development, testing | In-memory only |
| **SqliteSaver** | Local apps, prototypes | SQLite database |
| **PostgresSaver** | Production, cloud | PostgreSQL database |

### Using SqliteSaver

```typescript
import { SqliteSaver } from "@langchain/langgraph-checkpoint-sqlite";

// Create database-backed checkpointer
const checkpointer = SqliteSaver.fromConnString("./checkpoints.db");

const app = workflow.compile({ checkpointer });

// Conversations are now persisted to disk!
// Survives app restarts, process crashes, etc.
```

### Using PostgresSaver

```typescript
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

// For production deployments
const checkpointer = PostgresSaver.fromConnString(
  process.env.POSTGRES_CONNECTION_STRING
);

const app = workflow.compile({ checkpointer });

// Scales to millions of conversations
// Supports distributed deployments
```

### Cross-Thread Memory with Store

For user-level memory that spans multiple conversations:

```typescript
import { InMemoryStore } from "@langchain/langgraph";
import { OpenAIEmbeddings } from "@langchain/openai";

// Create memory store with semantic search
const store = new InMemoryStore();

// Store user preferences across all conversations
await store.put(
  ["user-123", "preferences"],
  "pref-1",
  { favoriteColor: "blue", timezone: "PST" }
);

// Search memories semantically
const memories = await store.search(
  ["user-123", "memories"],
  { query: "What does the user like?", limit: 3 }
);
```

**When to use**:
- ✅ User preferences across sessions
- ✅ Long-term facts about users
- ✅ Semantic search across memories
- ✅ Cross-conversation context

📚 **Learn more**: [LangGraph Persistence Documentation](https://docs.langchain.com/oss/javascript/langgraph/persistence)

---

## 🎓 Key Takeaways

- ✅ **LLMs have no memory by default**: You must implement it
- ✅ **Modern pattern**: Use LangGraph with `MemorySaver`
- ✅ **Buffer memory**: Store full conversation with checkpointer
- ✅ **Window memory**: Use `trimMessages` to limit context
- ✅ **Summary memory**: Custom summarization in state graph
- ✅ **Thread-based**: Use `thread_id` for multi-user apps
- ✅ **Production ready**: Supports database checkpointers
- ✅ **No deprecated APIs**: Uses latest LangChain.js patterns

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Memory Types Comparison** - Test all memory types
2. **Personal Assistant Bot** - Build a stateful chatbot
3. **Session Manager** - Handle multiple users
4. **Memory Optimization** - Implement cost-effective memory

---

## 📚 Additional Resources

- [LangGraph Memory Documentation](https://langchain-ai.github.io/langgraphjs/how-tos/persistence/)
- [Message Trimming Guide](https://js.langchain.com/docs/how_to/trim_messages/)
- [Checkpointers](https://langchain-ai.github.io/langgraphjs/concepts/persistence/)

---

## 🗺️ Navigation

- **Previous**: [07-langgraph-agents-tools](../07-langgraph-agents-tools/README.md)
- **Next**: [09-langgraph-patterns](../09-langgraph-patterns/README.md)
- **Home**: [Course Home](../README.md)

---

## 💬 Questions or stuck? Join our [Discord community](https://aka.ms/foundry/discord)!
