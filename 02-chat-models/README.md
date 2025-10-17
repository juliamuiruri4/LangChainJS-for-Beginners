# Chapter 2: Chat Models & Basic Interactions

In this chapter, you'll master the art of having natural conversations with AI models. You'll learn how to maintain conversation context across multiple exchanges, stream responses in real-time for better user experience, and handle errors gracefully with retry logic. You'll also explore key parameters like temperature to control AI creativity and understand token usage for cost optimization.

## Prerequisites

- Completed [Chapter 1](../01-introduction/README.md)

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:

- ✅ Have multi-turn conversations with AI
- ✅ Stream responses for better user experience
- ✅ Handle errors gracefully
- ✅ Control model behavior with parameters
- ✅ Understand token usage

---

## 📖 The Knowledgeable Friend Analogy

**Imagine you're having coffee with a knowledgeable friend.**

When you talk to them:
- 💬 **You have a back-and-forth conversation** (not just one question)
- 🧠 **They remember what you said earlier** (conversation context)
- 🗣️ **They speak as they think** (streaming responses)
- 😊 **They adjust their tone** based on your preferences (model parameters)
- ⚠️ **Sometimes they need clarification** (error handling)

**Chat models work the same way!**

Unlike the simple one-off questions in Chapter 1, chat models excel at:
- Multi-turn conversations
- Maintaining context
- Streaming responses in real-time
- Adapting their behavior

This chapter teaches you how to have natural, interactive conversations with AI.

---

## 💬 Multi-Turn Conversations

In Chapter 1, we sent single messages. But real conversations have multiple exchanges.

### How Conversation History Works

Chat models don't actually "remember" previous messages. Instead, you send the entire conversation history with each new message.

**Think of it like this**: Every time you send a message, you're showing the AI the entire conversation thread so far.

### Example 1: Multi-Turn Conversation

The following example shows you how to maintain conversation context across multiple exchanges by storing message history and referencing previous interactions.

**Code**: [`code/01-multi-turn.ts`](./code/01-multi-turn.ts)
**Run**: `tsx 02-chat-models/code/01-multi-turn.ts`

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import "dotenv/config";

async function main() {
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY
  });

  // Conversation history
  const messages = [
    new SystemMessage("You are a helpful coding tutor."),
    new HumanMessage("What is TypeScript?"),
  ];

  // First exchange
  const response1 = await model.invoke(messages);
  console.log("AI:", response1.content);

  // Add AI response to history
  messages.push(new AIMessage(response1.content));

  // Second exchange - AI remembers context
  messages.push(new HumanMessage("Can you show me a simple example?"));
  const response2 = await model.invoke(messages);
  console.log("\nAI:", response2.content);
}

main().catch(console.error);
```

> **🤖 Try with [GitHub Copilot](https://github.com/features/copilot) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "Why do we need to push AIMessage to the messages array after each response?"
> - "How would I implement a loop to keep the conversation going with user input?"
> - "What happens if I don't include the SystemMessage at the beginning?"

### Expected Output

When you run this example with `tsx 02-chat-models/code/01-multi-turn.ts`, you'll see:

```
AI: TypeScript is a superset of JavaScript that adds static typing to the language. It was developed by Microsoft and helps catch errors during development rather than at runtime. TypeScript code compiles down to plain JavaScript that can run in any JavaScript environment.

AI: Sure! Here's a simple TypeScript example:

```typescript
// Define an interface
interface Person {
  name: string;
  age: number;
}

// Use the interface
function greet(person: Person): string {
  return `Hello, ${person.name}! You are ${person.age} years old.`;
}

// This works - matches the interface
const user = { name: "Alice", age: 30 };
console.log(greet(user));
```

Notice how the second response references "TypeScript" from the first exchange and provides a relevant example!

### How It Works

**Key Points**:
1. **Messages array holds the entire conversation** - We create an array that stores all messages (system, human, and AI)
2. **Each response is added to the history** - After getting a response, we push it to the messages array
3. **The AI can reference earlier messages** - When we ask "Can you show me a simple example?", the AI knows we're talking about TypeScript from the first exchange
4. **Full history is sent each time** - With every `invoke()` call, we send the complete conversation history

**Why this matters**: The AI doesn't actually "remember" anything. It only knows what's in the messages array you send. This is why maintaining conversation history is crucial for multi-turn conversations.

---

## ⚡ Streaming Responses

When you ask a complex question, waiting for the entire response can feel slow. Streaming sends the response word-by-word as it's generated.

**Like watching a friend think out loud** instead of waiting for them to finish their entire thought.

### Example 2: Streaming

In this example, you'll learn how to stream AI responses in real-time, displaying words as they're generated instead of waiting for the complete response.

**Code**: [`code/02-streaming.ts`](./code/02-streaming.ts)
**Run**: `tsx 02-chat-models/code/02-streaming.ts`

```typescript
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function main() {
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY
  });

  console.log("🤖 AI (streaming): ");

  // Stream the response
  const stream = await model.stream("Explain how the internet works in 3 paragraphs.");

  for await (const chunk of stream) {
    process.stdout.write(chunk.content);
  }

  console.log("\n\n✅ Stream complete!");
}

main().catch(console.error);
```

> **🤖 Try with [GitHub Copilot](https://github.com/features/copilot) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "How does the 'for await...of' loop work with the stream?"
> - "Can I collect all chunks into a single string while streaming?"
> - "Why does process.stdout.write not add newlines between chunks?"

### Expected Output

When you run this example with `tsx 02-chat-models/code/02-streaming.ts`, you'll see the response appear word-by-word:

```
🤖 AI (streaming):
The internet is a global network of interconnected computers that communicate using standardized protocols, primarily TCP/IP. When you visit a website, your device sends a request to a server, which responds with the data needed to display the page. This data travels through multiple routers and networks before reaching you.

At its core, the internet works through a system of addresses called IP addresses, which uniquely identify each device. Domain names (like google.com) are translated to IP addresses by DNS servers. When you type a URL, your browser contacts these DNS servers to find the right destination.

Data on the internet is broken into small packets that travel independently and are reassembled at the destination. This packet-switching method makes the internet resilient and efficient, allowing information to take different routes if one path is blocked or congested.

✅ Stream complete!
```

You'll notice the text appears progressively, word by word, rather than all at once!

### How It Works

**What's happening**:
1. We call `model.stream()` instead of `model.invoke()`
2. This returns an async iterable that yields chunks as they're generated
3. We loop through each chunk with `for await...of`
4. Each chunk contains a piece of the response (usually a few words)
5. We use `process.stdout.write()` to display text without newlines, creating the streaming effect

**Benefits of Streaming**:
- Better user experience (immediate feedback)
- Feels more responsive - users see progress immediately
- Users can start reading while AI generates the rest
- Perceived performance improvement even if total time is the same

**When to Use**:

- ✅ Long responses (articles, explanations, code)
- ✅ User-facing chatbots and interactive applications
- ✅ When you want to display progress to users
- ❌ When you need the full response first (parsing, validation, post-processing)

> **💡 Note**: The actual file [`02-streaming.ts`](./code/02-streaming.ts) includes additional timing measurements and a comparison between streaming and non-streaming approaches to demonstrate the performance benefits. The code above shows the core streaming concept for clarity.

---

## 🎛️ Model Parameters

You can control how the AI responds by adjusting parameters.

### Key Parameters

#### Temperature (0.0 - 2.0)

[Temperature](../GLOSSARY.md#temperature) controls randomness and creativity:

- **0.0 = Deterministic**: Same question → Same answer
  - Use for: Code generation, factual answers
- **1.0 = Balanced** (default): Mix of consistency and variety
  - Use for: General conversation
- **2.0 = Creative**: More random and creative
  - Use for: Creative writing, brainstorming

#### Max Tokens

**What are tokens?** [Tokens](../GLOSSARY.md#token) are the basic units of text that AI models process. Think of them as pieces of words - roughly 1 token ≈ 4 characters or ¾ of a word. For example, "Hello world!" is about 3 tokens.

Limits response length:

- Controls how long responses can be
- Setting `maxTokens: 100` limits the response to approximately 75 words
- Prevents runaway costs by capping output length

### Example 3: Model Parameters

This sample compares AI responses at different temperature settings (0, 1, 2) to help you understand how parameters control creativity and randomness.

**Code**: [`code/03-parameters.ts`](./code/03-parameters.ts)
**Run**: `tsx 02-chat-models/code/03-parameters.ts`

```typescript
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function compareTemperatures() {
  const prompt = "Write a creative opening line for a sci-fi story.";

  const temperatures = [0, 1, 2];

  for (const temp of temperatures) {
    console.log(`\n🌡️ Temperature: ${temp}`);
    console.log("─".repeat(60));

    const model = new ChatOpenAI({
      model: process.env.AI_MODEL,
      configuration: { baseURL: process.env.AI_ENDPOINT },
      apiKey: process.env.AI_API_KEY,
      temperature: temp
    });

    const response = await model.invoke(prompt);
    console.log(response.content);
  }
}

compareTemperatures().catch(console.error);
```

> **🤖 Try with [GitHub Copilot](https://github.com/features/copilot) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "What temperature value should I use for a customer service chatbot?"
> - "How do I add the temperature and maxTokens parameters to the ChatOpenAI constructor?"
> - "Why might a response be cut off when using maxTokens?"

### Expected Output

When you run this example with `tsx 02-chat-models/code/03-parameters.ts`, you'll see how temperature affects creativity:

```
🌡️ Temperature: 0
────────────────────────────────────────────────────────────
"In the year 2157, humanity had finally broken free from the confines of Earth."

🌡️ Temperature: 1
────────────────────────────────────────────────────────────
"The stars whispered secrets through the observation deck's reinforced glass, but Captain Reeves had stopped listening years ago."

🌡️ Temperature: 2
────────────────────────────────────────────────────────────
"Zyx-9 flickered into existence at precisely the wrong moment—right between the temporal rift and Dr. Kwan's morning coffee."
```

Notice how temperature 0 is straightforward, temperature 1 is more interesting, and temperature 2 is quite creative and unexpected!

### How It Works

**What's happening**:
1. We use the same prompt with three different temperature settings (0, 1, 2)
2. Temperature 0 produces the most predictable, "safe" response
3. Temperature 1 (default) balances consistency with creativity
4. Temperature 2 produces more unusual and creative variations

**Temperature Scale Explained**:
- **0.0**: Almost no randomness - model picks the most likely tokens every time
  - Same input → nearly identical output
  - Best for: Code generation, factual Q&A, structured data extraction
- **1.0**: Balanced - some randomness but still coherent
  - Good for: General conversation, explanations, most use cases
- **2.0**: High randomness - model explores less likely options
  - More creative and unpredictable
  - Best for: Creative writing, brainstorming, generating unique ideas

**Pro tip**: Run the same prompt multiple times at temperature 2 and you'll get very different results each time!

---

## 🛡️ Error Handling

APIs can fail. Networks drop. Rate limits hit. Good error handling is essential.

### Common Errors

- **401 Unauthorized**: Invalid API key
- **429 Too Many Requests**: Rate limit exceeded
- **500 Server Error**: Provider issues
- **Network timeout**: Connection problems

### Example 5: Error Handling

Here you'll implement robust error handling with retry logic and exponential backoff to handle API failures, rate limits, and network issues.

**Code**: [`code/05-error-handling.ts`](./code/05-error-handling.ts)
**Run**: `tsx 02-chat-models/code/05-error-handling.ts`

```typescript
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function robustCall(prompt: string, maxRetries = 3): Promise<string> {
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY
  });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}...`);
      const response = await model.invoke(prompt);
      return response.content;
    } catch (error: any) {
      console.error(`❌ Attempt ${attempt} failed: ${error.message}`);

      // Check if we should retry
      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts`);
      }

      // Wait before retrying (exponential backoff)
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}

async function main() {
  try {
    const response = await robustCall("What is LangChain.js?");
    console.log("\n✅ Success!");
    console.log(response);
  } catch (error: any) {
    console.error("\n❌ All retries failed:", error.message);
  }
}

main();
```

> **🤖 Try with [GitHub Copilot](https://github.com/features/copilot) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "Explain how the exponential backoff calculation works in this retry logic"
> - "How can I add different error handling for rate limit vs network errors?"
> - "What's the purpose of the setTimeout with Promise in the retry logic?"

### Expected Output

When you run this example with `tsx 02-chat-models/code/05-error-handling.ts`, you'll see:

**Success case** (API works normally):
```
Attempt 1...

✅ Success!
LangChain.js is a JavaScript framework for building applications powered by large language models (LLMs). It provides tools and abstractions to easily integrate LLMs into your applications.
```

**Error case** (simulated API failure):
```
Attempt 1...
❌ Attempt 1 failed: Network timeout
⏳ Waiting 2000ms before retry...

Attempt 2...
❌ Attempt 2 failed: Network timeout
⏳ Waiting 4000ms before retry...

Attempt 3...

✅ Success!
LangChain.js is a JavaScript framework...
```

### How It Works

**What's happening**:
1. **Retry loop**: We wrap the API call in a loop that tries up to `maxRetries` times (default 3)
2. **Try-catch**: Each attempt is wrapped in try-catch to catch any errors
3. **Exponential backoff**: Wait time doubles after each failure (2s, 4s, 8s, etc.)
4. **Error logging**: Each failure is logged with details for debugging
5. **Final failure**: If all retries fail, we throw an error

**Exponential Backoff Formula**:
```typescript
waitTime = 2^attempt * 1000ms
// Attempt 1: 2^1 * 1000 = 2000ms (2 seconds)
// Attempt 2: 2^2 * 1000 = 4000ms (4 seconds)
// Attempt 3: 2^3 * 1000 = 8000ms (8 seconds)
```

**Why exponential backoff?** If the API is overloaded, waiting longer each time gives it more time to recover. Immediate retries can make the problem worse.

**Error Handling Best Practices**:
1. Always wrap API calls in try-catch
2. Implement exponential backoff for retries (don't retry immediately)
3. Log errors for debugging and monitoring
4. Provide helpful error messages to users (not raw error objects)
5. Have fallback behavior (e.g., use cached data, different model, or graceful degradation)
6. Set reasonable retry limits to avoid infinite loops

---

## 📊 Token Tracking and Costs

Tokens power AI models, and they directly impact cost and performance. Let's track them!

### Example 6: Tracking Token Usage

This example shows you how to track token usage for cost estimation and monitoring, helping you optimize your AI application expenses.

**Code**: [`code/06-token-tracking.ts`](./code/06-token-tracking.ts)
**Run**: `tsx 02-chat-models/code/06-token-tracking.ts`

```typescript
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function trackTokenUsage() {
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY
  });

  console.log("📊 Token Usage Tracking Example\n");

  // Make a request
  const response = await model.invoke(
    "Explain what TypeScript is in 2 sentences."
  );

  // Extract token usage from metadata
  const usage = response.response_metadata?.tokenUsage;

  if (usage) {
    console.log("Token Breakdown:");
    console.log(`  Prompt tokens:     ${usage.promptTokens}`);
    console.log(`  Completion tokens: ${usage.completionTokens}`);
    console.log(`  Total tokens:      ${usage.totalTokens}`);
  }

  console.log("\n📝 Response:");
  console.log(response.content);
}

trackTokenUsage().catch(console.error);
```

> **🤖 Try with [GitHub Copilot](https://github.com/features/copilot) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "How can I track token usage across multiple API calls in a conversation?"
> - "What's the difference between promptTokens and completionTokens?"
> - "How would I calculate the cost based on token usage?"

### Expected Output

When you run this example with `tsx 02-chat-models/code/06-token-tracking.ts`, you'll see:

```
📊 Token Usage Tracking Example

Token Breakdown:
  Prompt tokens:     12
  Completion tokens: 45
  Total tokens:      57

📝 Response:
TypeScript is a superset of JavaScript that adds static typing to help catch errors during development. It compiles to plain JavaScript and runs in any JavaScript environment.
```

### How It Works

**What's happening**:
1. **Make API call**: Send a prompt to the model
2. **Extract metadata**: Get `response.response_metadata.tokenUsage`
3. **Calculate costs**: Multiply tokens by provider rates
4. **Track spending**: Monitor costs per request

**Key insights**:
- **Prompt tokens**: Your input (question + conversation history)
- **Completion tokens**: AI's output (the response)
- **Total tokens**: Sum of both (what you pay for)

**Why track tokens?**
- 💰 **Cost monitoring**: Understand your API spending
- ⚡ **Performance**: More tokens = slower responses
- 📊 **Optimization**: Identify expensive queries
- 🎯 **Budgeting**: Predict costs for production

---

### Cost Optimization Strategies

- ✅ **Use the right model for the task**
- ✅ **Limit response length**
```typescript
const model = new ChatOpenAI({
  model: process.env.AI_MODEL,
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY,
  maxTokens: 100 // Cap the response length
});
```

- ✅ **Trim conversation history**
```typescript
// Keep only the last 10 messages
const recentMessages = messages.slice(-10);
const response = await model.invoke(recentMessages);
```

- ✅ **Cache responses for common queries**
```typescript
const cache = new Map();

async function getCachedResponse(prompt: string) {
  if (cache.has(prompt)) {
    return cache.get(prompt); // Free!
  }

  const response = await model.invoke(prompt);
  cache.set(prompt, response);
  return response;
}
```

- ✅ **Batch process when possible**
```typescript
// Process multiple items in one call instead of separate calls
const prompt = `Summarize each of these articles:
1. ${article1}
2. ${article2}
3. ${article3}`;

// One API call vs. three separate calls
```

### Why Costs Matter

- **Models have limits**: Most models have token limits (4K-128K tokens)
- **Speed impact**: More tokens = longer processing time
- **Budget planning**: Understand costs before going to production
- **Efficiency**: Optimize prompts to reduce unnecessary tokens

---

## 🎓 Key Takeaways

- **Multi-turn conversations**: Send entire message history with each call
- **Streaming**: Display responses as they generate for better UX
- **Temperature**: Controls randomness (0 = consistent, 2 = creative)
- **Error handling**: Always use try-catch and implement retries
- **Token tracking**: Monitor usage and estimate costs for budgeting
- **Cost optimization**: Choose right models, limit responses, cache results
- **Tokens**: Impact cost and limits (1 token ≈ 4 characters)
- **Context window**: Models can only process limited conversation history

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Multi-Turn Chatbot** - Build a conversational bot with history
2. **Temperature Experiment** (Bonus) - Compare creativity at different settings

---

## 📚 Additional Resources

- [Chat Models Documentation](https://js.langchain.com/docs/integrations/chat/)
- [Streaming Guide](https://js.langchain.com/docs/how_to/streaming/)
- [Model Parameters](https://platform.openai.com/docs/api-reference/chat/create)

---

## 🗺️ Navigation

- **Previous**: [01-introduction](../01-introduction/README.md)
- **Next**: [03-prompt-templates](../03-prompt-templates/README.md)
- **Home**: [Course Home](../README.md)

---

## 💬 Questions or stuck?

If you get stuck or have any questions about building AI apps, join:

[![Azure AI Foundry Discord](https://img.shields.io/badge/Discord-Azure_AI_Foundry_Community_Discord-blue?style=for-the-badge&logo=discord&color=5865f2&logoColor=fff)](https://aka.ms/foundry/discord)

If you have product feedback or errors while building visit:

[![Azure AI Foundry Developer Forum](https://img.shields.io/badge/GitHub-Azure_AI_Foundry_Developer_Forum-blue?style=for-the-badge&logo=github&color=000000&logoColor=fff)](https://aka.ms/foundry/forum)

---

## 📎 Appendix: Provider-Agnostic Initialization

> **💡 Note**: This is a bonus topic. The recommended approach for this course is using `ChatOpenAI` directly, as shown in all the examples above.

### Alternative Pattern: initChatModel()

LangChain.js provides `initChatModel()` for provider-agnostic initialization. Think of it like universal power adapters - instead of different chargers for each device (OpenAI, Anthropic, Google), you have one adapter that works with all of them.

**When `initChatModel()` Shines**:
- 🔄 **Multiple Provider Types**: Switching between OpenAI, Anthropic, Google, etc.
- 🏗️ **Framework Building**: Creating libraries that support many providers
- 🎯 **Provider-Agnostic Code**: Write once, work with any standard provider

**When to Use `ChatOpenAI` (This Course)**:
- ✅ **GitHub Models**: Custom endpoints require specific configuration
- ✅ **Azure OpenAI**: Non-standard API paths work better with ChatOpenAI
- ✅ **Learning**: More explicit and easier to understand
- ✅ **Single Provider**: When you're primarily using one provider

### Example: Provider-Agnostic Patterns

**Code**: [`code/04-init-chat-model.ts`](./code/04-init-chat-model.ts)

```typescript
import { initChatModel } from "langchain/chat_models/universal";
import { ChatOpenAI } from "@langchain/openai";

// Switching between different provider types (conceptual)
const openaiModel = await initChatModel("gpt-4o-mini", {
  modelProvider: "openai",
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropicModel = await initChatModel("claude-3-5-sonnet-20241022", {
  modelProvider: "anthropic",
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Recommended for this course (GitHub Models/Azure)
const model = new ChatOpenAI({
  model: process.env.AI_MODEL,
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY
});
```

> **🤖 Try with [GitHub Copilot](https://github.com/features/copilot) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "What are the advantages of initChatModel over using ChatOpenAI directly?"
> - "How would I switch from OpenAI to Anthropic using initChatModel?"
> - "Why does ChatOpenAI work better with GitHub Models than initChatModel?"

### Comparison

| Feature | `ChatOpenAI` (Recommended) | `initChatModel()` |
|---------|-------------|-------------------|
| **Custom Endpoints** | ✅ Excellent | ⚠️ Limited |
| **Type Safety** | ✅ Excellent | ✅ Good |
| **Learning Curve** | ✅ Easier | 🔄 Moderate |
| **Use Case** | Single provider or custom endpoints | Multiple standard providers |

**For this course**: Stick with `ChatOpenAI`. It's more explicit and works best with GitHub Models and Azure OpenAI.