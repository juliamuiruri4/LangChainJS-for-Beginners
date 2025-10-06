# Chapter 8: Memory & Conversations

## ⏱️ Lesson Overview

- **Estimated Time**: 60 minutes
- **Prerequisites**: Completed [Chapter 7](../07-agents-tools/README.md)
- **Difficulty**: Beginner

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Understand different types of memory in LangChain
- Implement conversation history management
- Use buffer, window, and summary memory
- Build stateful chatbots
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

**Memory fixes this:**

```typescript
// With memory
User: "My name is Sarah"
Bot: "Nice to meet you, Sarah!"

User: "What's my name?"
Bot: "Your name is Sarah!"  // Remembers!
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
**Cons**: May lose details in summary

**Use when**: Very long conversations, need efficiency

---

## 💻 Implementing Memory

### Example 1: Buffer Memory

**Code**: [`code/01-buffer-memory.ts`](./code/01-buffer-memory.ts)

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import "dotenv/config";

const model = new ChatOpenAI({
  model: process.env.AI_MODEL || "gpt-4o-mini",
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY,
});

const memory = new BufferMemory();

const chain = new ConversationChain({ llm: model, memory });

// First exchange
await chain.call({ input: "Hi, my name is Alice and I'm a developer." });

// Later exchange - bot remembers!
const response = await chain.call({ input: "What's my name and occupation?" });
console.log(response.response);
// Output: "Your name is Alice and you're a developer."

// View memory
console.log(await memory.loadMemoryVariables({}));
```

---

### Example 2: Window Memory

**Code**: [`code/02-window-memory.ts`](./code/02-window-memory.ts)

```typescript
import { BufferWindowMemory } from "langchain/memory";

// Keep only last 4 messages (2 exchanges)
const memory = new BufferWindowMemory({ k: 4 });

const chain = new ConversationChain({ llm: model, memory });

await chain.call({ input: "My favorite color is blue." });
await chain.call({ input: "I have a cat named Whiskers." });
await chain.call({ input: "I work in Seattle." });
await chain.call({ input: "I love hiking." });

// This will remember recent info but may have forgotten about blue
const response = await chain.call({ input: "Tell me about myself." });
console.log(response.response);
```

---

### Example 3: Summary Memory

**Code**: [`code/03-summary-memory.ts`](./code/03-summary-memory.ts)

```typescript
import { ConversationSummaryMemory } from "langchain/memory";

const memory = new ConversationSummaryMemory({
  llm: model,
  maxTokenLimit: 100,
});

const chain = new ConversationChain({ llm: model, memory });

// Have a long conversation
await chain.call({ input: "I'm planning a trip to Japan next month." });
await chain.call({ input: "I want to visit Tokyo, Kyoto, and Osaka." });
await chain.call({ input: "I'm interested in temples and traditional food." });

// Memory is summarized
console.log(await memory.loadMemoryVariables({}));
// Output: "User is planning trip to Japan (Tokyo, Kyoto, Osaka), interested in temples and food."
```

---

## 💬 Building a Stateful Chatbot

### Example 4: Full Chatbot

**Code**: [`code/04-stateful-chatbot.ts`](./code/04-stateful-chatbot.ts)

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import "dotenv/config";

const model = new ChatOpenAI({
  model: process.env.AI_MODEL || "gpt-4o-mini",
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant. Remember user preferences."],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

const chain = prompt.pipe(model);

// Session-based memory
const messageHistories: Record<string, ChatMessageHistory> = {};

const withHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: async (sessionId) => {
    if (!messageHistories[sessionId]) {
      messageHistories[sessionId] = new ChatMessageHistory();
    }
    return messageHistories[sessionId];
  },
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

// Use with session ID
const config = { configurable: { sessionId: "user-123" } };

await withHistory.invoke({ input: "I prefer short answers." }, config);
await withHistory.invoke({ input: "Explain quantum computing." }, config);
// Bot will give a short answer because it remembers the preference!
```

---

## 🏭 Production Considerations

### 1. Persistent Storage

In production, use a database:

```typescript
import { RedisChatMessageHistory } from "langchain/stores/message/redis";

const messageHistory = new RedisChatMessageHistory({
  sessionId: "user-123",
  config: { url: process.env.REDIS_URL },
});
```

### 2. Memory Limits

Set token limits to control costs:

```typescript
const memory = new BufferMemory({ maxTokenLimit: 2000 });
```

### 3. Clear Memory

Allow users to start fresh:

```typescript
await memory.clear();
```

---

## 🎓 Key Takeaways

- ✅ **LLMs have no memory by default**: You must implement it
- ✅ **Buffer memory**: Stores everything (simple but can be expensive)
- ✅ **Window memory**: Keeps last N messages (efficient)
- ✅ **Summary memory**: Summarizes old messages (balanced)
- ✅ **Session-based**: Use session IDs for multi-user apps
- ✅ **Persistent storage**: Use databases in production

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

- [Memory Documentation](https://js.langchain.com/docs/modules/memory/)
- [Message History](https://js.langchain.com/docs/modules/memory/chat_messages/)

---

## 🗺️ Navigation

- **Previous**: [07-agents-tools](../07-agents-tools/README.md)
- **Next**: [09-production-best-practices](../09-production-best-practices/README.md)
- **Home**: [Course Home](../README.md)

---

💬 **Questions or stuck?** Join our [Discord community](https://aka.ms/foundry/discord)!
