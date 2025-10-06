# Chapter 2: Chat Models & Basic Interactions

## ⏱️ Lesson Overview

- **Estimated Time**: 60 minutes
- **Prerequisites**: Completed [Chapter 1](../01-introduction/README.md)
- **Difficulty**: Beginner

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Have multi-turn conversations with AI
- Stream responses for better user experience
- Handle errors gracefully
- Control model behavior with parameters
- Understand token usage and costs

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

**Code**: [`code/01-multi-turn.ts`](./code/01-multi-turn.ts)

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import "dotenv/config";

async function main() {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    configuration: {
      baseURL: "https://models.inference.ai.azure.com",
    },
    apiKey: process.env.GITHUB_TOKEN,
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

**Key Points**:
- Messages array holds the entire conversation
- Each response is added to the history
- The AI can reference earlier messages

---

## ⚡ Streaming Responses

When you ask a complex question, waiting for the entire response can feel slow. Streaming sends the response word-by-word as it's generated.

**Like watching a friend think out loud** instead of waiting for them to finish their entire thought.

### Example 2: Streaming

**Code**: [`code/02-streaming.ts`](./code/02-streaming.ts)

```typescript
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function main() {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    configuration: {
      baseURL: "https://models.inference.ai.azure.com",
    },
    apiKey: process.env.GITHUB_TOKEN,
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

**Benefits of Streaming**:
- Better user experience (immediate feedback)
- Feels more responsive
- Users can start reading while AI generates

**When to Use**:
- ✅ Long responses (articles, explanations, code)
- ✅ User-facing chatbots
- ❌ When you need the full response first (parsing, validation)

---

## 🎛️ Model Parameters

You can control how the AI responds by adjusting parameters.

### Key Parameters

#### Temperature (0.0 - 2.0)

Controls randomness and creativity:

- **0.0 = Deterministic**: Same question → Same answer
  - Use for: Code generation, factual answers
- **1.0 = Balanced** (default): Mix of consistency and variety
  - Use for: General conversation
- **2.0 = Creative**: More random and creative
  - Use for: Creative writing, brainstorming

#### Max Tokens

Limits response length:

- Controls how long responses can be
- 1 token ≈ 4 characters (rough estimate)
- Prevents runaway costs

### Example 3: Model Parameters

**Code**: [`code/03-parameters.ts`](./code/03-parameters.ts)

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
      model: "gpt-4o-mini",
      temperature: temp,
      configuration: {
        baseURL: "https://models.inference.ai.azure.com",
      },
      apiKey: process.env.GITHUB_TOKEN,
    });

    const response = await model.invoke(prompt);
    console.log(response.content);
  }
}

compareTemperatures().catch(console.error);
```

---

## 🛡️ Error Handling

APIs can fail. Networks drop. Rate limits hit. Good error handling is essential.

### Common Errors

- **401 Unauthorized**: Invalid API key
- **429 Too Many Requests**: Rate limit exceeded
- **500 Server Error**: Provider issues
- **Network timeout**: Connection problems

### Example 4: Error Handling

**Code**: [`code/04-error-handling.ts`](./code/04-error-handling.ts)

```typescript
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function robustCall(prompt: string, maxRetries = 3) {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    configuration: {
      baseURL: "https://models.inference.ai.azure.com",
    },
    apiKey: process.env.GITHUB_TOKEN,
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

**Error Handling Best Practices**:
1. Always wrap API calls in try-catch
2. Implement exponential backoff for retries
3. Log errors for debugging
4. Provide helpful error messages to users
5. Have fallback behavior

---

## 📊 Understanding Tokens and Costs

### What are Tokens?

Tokens are pieces of text that models process:
- A token is roughly 4 characters
- "Hello world" ≈ 2 tokens
- Both input (prompt) and output (response) count as tokens

### Why Tokens Matter

- **Cost**: Most AI providers charge per token
- **Limits**: Models have maximum token limits
- **Speed**: More tokens = longer processing time

### Calculating Token Usage

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  // ... config
});

const response = await model.invoke("Hello!");

// Token information is in response metadata
console.log(response.response_metadata?.tokenUsage);
// Output: { promptTokens: 8, completionTokens: 12, totalTokens: 20 }
```

---

## 🎓 Key Takeaways

- ✅ **Multi-turn conversations**: Send entire message history with each call
- ✅ **Streaming**: Display responses as they generate for better UX
- ✅ **Temperature**: Controls randomness (0 = consistent, 2 = creative)
- ✅ **Error handling**: Always use try-catch and implement retries
- ✅ **Tokens**: Impact cost and limits (1 token ≈ 4 characters)
- ✅ **Context window**: Models can only process limited conversation history

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Multi-Turn Chatbot** - Build a conversational bot
2. **Streaming Interface** - Create a streaming chat interface
3. **Temperature Experiment** - Compare different temperature settings
4. **Error Recovery** - Implement robust error handling

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

💬 **Questions or stuck?** Join our [Discord community](https://aka.ms/foundry/discord) or open a [GitHub Discussion](https://github.com/yourusername/langchainjs-for-beginners/discussions)!
