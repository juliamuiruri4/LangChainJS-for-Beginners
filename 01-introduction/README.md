# Chapter 1: Introduction to LangChain.js

Welcome to your first step in building AI-powered applications with LangChain.js! In this chapter, you'll learn what LangChain.js is and why it exists, explore its core concepts like models, prompts, and chains, and make your first AI call using GitHub Models. By the end, you'll understand how LangChain.js provides a consistent interface across different AI providers, making it easy to switch between them with just environment variables.

## Prerequisites

- Completed [Course Setup](../00-course-setup/README.md)

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:

- ✅ Understand what LangChain.js is and why it exists
- ✅ Recognize common AI application patterns
- ✅ Set up a development environment
- ✅ Make your first LLM call using GitHub Models

---

## 📖 Introduction: The Hardware Store Analogy

**Imagine you're building a house.** You could manufacture your own bricks, create cement from scratch, and forge your own tools—or you could use a hardware store that provides quality materials and proven tools.

**LangChain.js is the hardware store for AI development.**

Just like a hardware store provides:
- 🔨 **Pre-made tools** (hammers, saws, drills)
- 🧱 **Quality materials** (lumber, nails, paint)
- 📋 **Blueprints** (how-to guides)
- 🔄 **Interchangeable parts** (standard sizes that work together)

LangChain.js provides:
- 🔨 **Pre-built components** (chat models, prompts, chains)
- 🧱 **Quality abstractions** (works with any LLM provider)
- 📋 **Patterns** (common AI application designs)
- 🔄 **Composability** (components that work together seamlessly)

**The result?** You can focus on building your application, not reinventing the wheel.

---

## 🧠 What is LangChain.js?

LangChain.js is a **framework for building AI-powered applications** using Large Language Models (LLMs).

### The Problem It Solves

Without LangChain.js, you'd need to:
- Write different code for each LLM provider (OpenAI, Anthropic, Azure, etc.)
- Build your own prompt management system
- Create custom chains for multi-step operations
- Implement memory and conversation handling from scratch
- Build agent systems without any structure

### The LangChain.js Solution

With LangChain.js, you get:

- **Provider abstraction** - Switch between OpenAI, Azure, Anthropic with minimal code changes
- **Prompt templates** - Reusable, testable prompts
- **Chains** - Combine multiple operations seamlessly
- **Memory** - Built-in conversation history
- **Agents** - Decision-making AI that can use tools

---

## 🏗️ Core Concepts Overview

LangChain.js is built around 5 main concepts:

### 1. Models

Models are the AI "brains" that generate text, embeddings, or other outputs.

**Types**:
- **Chat Models**: Conversational AI (GPT-4o, Claude, etc.)
- **LLMs**: Text completion models
- **Embedding Models**: Convert text to vector representations

### 2. Prompts

Prompts are instructions you give to the model.

**LangChain.js helps with**:
- Template creation
- Variable substitution
- Few-shot examples
- Prompt composition

### 3. Chains (LCEL - LangChain Expression Language)

Chains connect multiple operations together.

**Example**: Retrieve documents → Format them → Send to LLM → Parse output

### 4. Agents

Agents are AI systems that can make decisions and use tools.

**Example**: An agent that can search the web, perform calculations, and send emails.

### 5. Memory

Memory allows AI to remember conversation context.

**Example**: A chatbot that remembers your name and previous questions.

---

## 💻 Hands-On: Your First LLM Call

Let's make your first AI call using LangChain.js and GitHub Models!

### Example 1: Hello World

In this example, you'll create your first LangChain.js program that sends a simple message to an AI model and displays the response.

**Code**: [`code/01-hello-world.ts`](./code/01-hello-world.ts)
**Run**: `tsx 01-introduction/code/01-hello-world.ts`

This example shows the simplest possible LangChain.js application:

```typescript
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function main() {
  console.log("🚀 Hello LangChain.js!\n");

  // Create a model instance using environment variables
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Make your first AI call!
  const response = await model.invoke("What is LangChain in one sentence?");

  console.log("🤖 AI Response:", response.content);
  console.log("\n✅ Success! You just made your first LangChain.js call!");
}

main().catch(console.error);
```

### Expected Output

When you run this example with `tsx 01-introduction/code/01-hello-world.ts`, you'll see:

```
🚀 Hello LangChain.js!

🤖 AI Response: LangChain is a framework for building applications powered by large language models (LLMs).

✅ Success! You just made your first LangChain.js call!
```

### How It Works

**What's happening here?**
1. We import `ChatOpenAI` from LangChain
2. We create a model instance using environment variables (`AI_API_KEY`, `AI_ENDPOINT`, `AI_MODEL`)
3. We call `invoke()` with a simple string prompt
4. We get back a response with the AI's answer

**Why environment variables?** This allows you to switch between providers (GitHub Models, Azure AI Foundry, OpenAI) by just changing your `.env` file - no code changes needed!

---

## 💬 Understanding Messages

LLMs work best with structured conversations. LangChain.js provides message types for this.

### Example 2: Message Types

This example shows you how to use structured message types (SystemMessage and HumanMessage) to control AI behavior and maintain conversation context.

**Code**: [`code/02-message-types.ts`](./code/02-message-types.ts)
**Run**: `tsx 01-introduction/code/02-message-types.ts`

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import "dotenv/config";

async function main() {
  console.log("🎭 Understanding Message Types\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Using structured messages
  const messages = [
    new SystemMessage("You are a helpful AI assistant who explains things simply."),
    new HumanMessage("Explain quantum computing to a 10-year-old."),
  ];

  const response = await model.invoke(messages);
  console.log("🤖 AI Response:", response.content);
}

main().catch(console.error);
```

### Expected Output

When you run this example with `tsx 01-introduction/code/02-message-types.ts`, you'll see:

```
🎭 Understanding Message Types

🤖 AI Response: Quantum computing is like having a super-fast magic box that can try many different solutions to a puzzle at the same time! While regular computers look at one answer at a time, quantum computers can explore lots of possibilities all at once, which helps them solve really hard problems much faster.
```

### How It Works

**Message Types**:
- **SystemMessage**: Sets the AI's behavior and personality
- **HumanMessage**: User input
- **AIMessage**: The AI's responses (usually added automatically)

**What's happening**:
1. The SystemMessage tells the AI to explain things simply (like to a beginner)
2. The HumanMessage contains the user's question about quantum computing
3. The AI crafts a response that matches the system instruction (simple explanation)
4. Because we set the personality in the SystemMessage, the response is age-appropriate and clear

**Why use messages instead of strings?**
- Better control over AI behavior
- Maintains conversation context
- More powerful and flexible

---

## 🔄 Comparing Models

GitHub Models gives you access to multiple AI models. Let's compare them!

### Example 3: Model Comparison

Here you'll compare responses from different AI models (gpt-4o vs gpt-4o-mini) to understand their capabilities, speed, and output quality differences.

**Code**: [`code/03-model-comparison.ts`](./code/03-model-comparison.ts)
**Run**: `tsx 01-introduction/code/03-model-comparison.ts`

```typescript
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function compareModels() {
  console.log("🔬 Comparing AI Models\n");

  const prompt = "Explain recursion in programming in one sentence.";
  const models = ["gpt-4o", "gpt-4o-mini"];

  for (const modelName of models) {
    console.log(`\n📊 Testing: ${modelName}`);
    console.log("─".repeat(50));

    const model = new ChatOpenAI({
      model: modelName,
      configuration: {
        baseURL: process.env.AI_ENDPOINT,
      },
      apiKey: process.env.AI_API_KEY,
    });

    const response = await model.invoke(prompt);
    console.log(`Response: ${response.content}`);
  }

  console.log("\n✅ Comparison complete!");
}

compareModels().catch(console.error);
```

### Expected Output

When you run this example with `tsx 01-introduction/code/03-model-comparison.ts`, you'll see:

```
🔬 Comparing AI Models


📊 Testing: gpt-4o
──────────────────────────────────────────────────
Response: Recursion in programming is a technique where a function calls itself to solve smaller instances of the same problem until it reaches a base case.


📊 Testing: gpt-4o-mini
──────────────────────────────────────────────────
Response: Recursion is when a function calls itself to solve a problem by breaking it down into smaller, similar sub-problems.

✅ Comparison complete!
```

### How It Works

**What's happening**:
1. We define a single prompt asking about recursion
2. We loop through two different models: `gpt-4o` and `gpt-4o-mini`
3. For each model, we create a new `ChatOpenAI` instance with that model name
4. We invoke the same prompt on each model
5. We display the response from each model for comparison

**What you'll notice**:
- Different models have different response styles
- `gpt-4o` tends to be more detailed and sophisticated
- `gpt-4o-mini` is more concise but still accurate
- Both answers are correct, just expressed differently
- `gpt-4o` is more capable for complex tasks, `gpt-4o-mini` is faster and cheaper for simple tasks

---

## 🔄 Switching to Azure AI Foundry (Optional)

**Want to use Azure AI Foundry instead of GitHub Models?** Great news - all the code you just wrote will work with zero changes!

### Why Switch to Azure AI Foundry?

- **Production-ready**: Enterprise-grade infrastructure and SLAs
- **Higher limits**: More requests per minute than free tiers
- **Advanced features**: Private endpoints, content filtering, monitoring
- **Azure integration**: Works seamlessly with other Azure services

### How to Switch

Simply update your `.env` file with three values:

```bash
# OLD: GitHub Models (Free)
AI_API_KEY=ghp_your_github_token
AI_ENDPOINT=https://models.inference.ai.azure.com
AI_MODEL=gpt-4o-mini

# NEW: Azure AI Foundry (Production)
AI_API_KEY=your_azure_openai_api_key
AI_ENDPOINT=https://your-resource.openai.azure.com
AI_MODEL=gpt-4o-mini
```

**That's it!** All examples in this chapter (and the entire course) now use Azure AI Foundry.

### Getting Your Azure AI Foundry Credentials

1. **Create** an Azure AI Foundry project at [ai.azure.com](https://ai.azure.com)
2. **Deploy** a model (e.g., gpt-4o-mini)
3. **Copy** your endpoint and API key from the Azure Portal

**Your endpoint** looks like: `https://YOUR-RESOURCE-NAME.openai.azure.com`

**Model name** matches your deployment name (e.g., `gpt-4o-mini`, `gpt-4o`)

### The Magic of Provider Abstraction ✨

Notice that your code uses environment variables:

```typescript
const model = new ChatOpenAI({
  model: process.env.AI_MODEL || "gpt-4o-mini",
  configuration: {
    baseURL: process.env.AI_ENDPOINT,
  },
  apiKey: process.env.AI_API_KEY,
});
```

This pattern means:

- **No code changes** to switch providers
- **Easy testing** - Use GitHub Models for learning, Azure for learning or real-world production scenarios
- **Cost optimization** - Switch to cheaper providers when appropriate
- **Disaster recovery** - Fallback to alternative providers if one is down

> **💡 Note**: LangChain.js also provides `initChatModel()` for even more flexible, provider-agnostic initialization. You'll learn about this alternative pattern in [Chapter 2](../02-chat-models/README.md#-provider-agnostic-initialization-with-initchatmodel).

You'll learn more about production deployment strategies in [Chapter 10](../10-production-best-practices/README.md).

---

## 🎓 Key Takeaways

Let's review what you learned:

- **LangChain.js is an abstraction layer** - It provides a consistent interface across different LLM providers
- **Built on composable components** - Models, prompts, chains, agents, and memory work together
- **GitHub Models offers free access** - Perfect for learning and prototyping
- **Azure AI Foundry is production-ready** - Switch anytime with just environment variables
- **Messages have types** - SystemMessage, HumanMessage, and AIMessage serve different purposes
- **Provider flexibility** - Switch between models and providers with zero code changes

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **System Prompts Experiment** - Learn how SystemMessage affects AI behavior
2. **Model Performance Comparison** (Bonus) - Compare multiple models on the same task

---

## 📚 Additional Resources

- [LangChain.js Concepts](https://js.langchain.com/docs/concepts/)
- [GitHub Models Marketplace](https://github.com/marketplace/models)
- [Chat Models Documentation](https://js.langchain.com/docs/integrations/chat/)

---

## 🗺️ Navigation

- **Previous**: [00-course-setup](../00-course-setup/README.md)
- **Next**: [02-chat-models](../02-chat-models/README.md)
- **Home**: [Course Home](../README.md)

---

## 💬 Questions or stuck?

If you get stuck or have any questions about building AI apps, join:

[![Azure AI Foundry Discord](https://img.shields.io/badge/Discord-Azure_AI_Foundry_Community_Discord-blue?style=for-the-badge&logo=discord&color=5865f2&logoColor=fff)](https://aka.ms/foundry/discord)

If you have product feedback or errors while building visit:

[![Azure AI Foundry Developer Forum](https://img.shields.io/badge/GitHub-Azure_AI_Foundry_Developer_Forum-blue?style=for-the-badge&logo=github&color=000000&logoColor=fff)](https://aka.ms/foundry/forum)
