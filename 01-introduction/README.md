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

LangChain.js is built around 5 main concepts that work together to create powerful AI applications. You'll learn each concept hands-on throughout this course. Here's a quick overview:

### 1. Models

**Models** are the AI "brains" that process your inputs and generate outputs. They're the foundation of every AI application. LangChain.js provides a consistent interface to work with different AI providers (OpenAI, Anthropic, Azure, etc.) using the same code.

You'll start using models in this chapter and use them throughout the course.

### 2. Prompts

**Prompts** are how you communicate with AI models. LangChain.js helps you create reusable prompt templates instead of hardcoding strings, making your prompts testable, maintainable, and secure.

**Simple example**: `"Translate {text} from {source_lang} to {target_lang}"` - Define once, reuse with different values.

You'll learn prompt engineering and templates in [Chapter 3](../03-prompt-templates/README.md).

### 3. Chains (LCEL)

**Chains** connect multiple operations into pipelines. Think of them as assembly lines where the output of one step becomes the input to the next.

**Example flow**: `User Question → Retrieve Docs → Format → LLM → Parse Answer`

LCEL (LangChain Expression Language) uses the pipe operator to chain operations:
```typescript
const chain = prompt | model | outputParser;
```

You'll build chains in [Chapter 6](../06-rag-systems/README.md) when creating RAG systems.

### 4. Agents

**Agents** are AI systems that can reason, decide which actions to take, and iterate until they solve a task. Unlike chains (which follow a fixed path), agents make dynamic decisions.

**Key difference**: Chains are deterministic (A → B → C), while agents are dynamic (Think → Choose Tool → Execute → Observe → Repeat).

You'll build agents from scratch in [Chapter 7](../07-agents-mcp/README.md).

### 5. Memory

**Memory** enables AI applications to remember context across multiple interactions. Without memory, the AI forgets everything after each response.

You maintain conversation history and send it with each new message, allowing the AI to reference previous parts of the conversation.

You'll implement memory in [Chapter 2](../02-chat-models/README.md) when building multi-turn conversations.

---

### How These Concepts Work Together

As you progress through the course, you'll see how these concepts combine:

```
User Input → [Memory] → [Prompts] → [Chains/Agents] → [Models] → Response
```

**Don't worry about understanding everything now!** You'll learn each concept hands-on, building progressively more sophisticated applications. Let's start with your first AI call.

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

  // Create a chat model instance
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY
  });

  // Make your first AI call!
  const response = await model.invoke("What is LangChain in one sentence?");

  console.log("🤖 AI Response:", response.content);
  console.log("\n✅ Success! You just made your first LangChain.js call!");
}

main().catch(console.error);
```

> **🤖 Try with [GitHub Copilot](https://github.com/features/copilot) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "What does the invoke() method return and how do I access different properties?"
> - "How does the configuration baseURL work with different AI providers?"
> - "What happens if the environment variables are not set?"

### Expected Output

When you run this example with `tsx 01-introduction/code/01-hello-world.ts`, you'll see:

```
🚀 Hello LangChain.js!

🤖 AI Response: LangChain is a framework for building applications powered by large language models (LLMs).

✅ Success! You just made your first LangChain.js call!
```

### How It Works

**What's happening here?**
1. We import `ChatOpenAI` from the `@langchain/openai` package
2. We create a model instance by instantiating `ChatOpenAI` with configuration
3. We call `invoke()` with a simple string prompt
4. We get back a response with the AI's answer

**Understanding ChatOpenAI Configuration**:

The `ChatOpenAI` constructor takes a configuration object with three key properties:

- **`model`**: Which AI model to use (e.g., `"gpt-4o-mini"`, `"gpt-4o"`)
- **`configuration.baseURL`**: The API endpoint URL for your provider
- **`apiKey`**: Your API key for authentication

We read these values from environment variables (`AI_MODEL`, `AI_ENDPOINT`, `AI_API_KEY`) defined in your `.env` file. This approach:

- Keeps sensitive credentials out of your code
- Allows you to switch between providers (GitHub Models ↔ Azure AI Foundry) by just updating `.env`
- Works seamlessly with both GitHub Models and Azure AI Foundry endpoints
- Makes it easy to use different configurations for development vs production

---

## 💬 Understanding Messages

LLMs work best with structured conversations. LangChain.js provides message types for this.

### Example 2: Message Types

This example shows you how to use structured message types (SystemMessage and HumanMessage) to control AI behavior and maintain conversation context.

**Code**: [`code/02-message-types.ts`](./code/02-message-types.ts)
**Run**: `tsx 01-introduction/code/02-message-types.ts`

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import "dotenv/config";

async function main() {
  console.log("🎭 Understanding Message Types\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY
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

> **🤖 Try with [GitHub Copilot](https://github.com/features/copilot) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "What's the difference between SystemMessage and HumanMessage?"
> - "How would I add an AIMessage to continue this conversation?"
> - "Can I change the SystemMessage personality to be more formal instead of simple?"

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

    // Create a model instance with the specific model name
    const model = new ChatOpenAI({
      model: modelName,
      configuration: { baseURL: process.env.AI_ENDPOINT },
      apiKey: process.env.AI_API_KEY
    });

    const response = await model.invoke(prompt);
    console.log(`Response: ${response.content}`);
  }

  console.log("\n✅ Comparison complete!");
}

compareModels().catch(console.error);
```

> **🤖 Try with [GitHub Copilot](https://github.com/features/copilot) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "Why do we create a new ChatOpenAI instance inside the loop?"
> - "How can I add another model to this comparison?"
> - "What other metrics besides time could I measure for each model?"

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

Notice that our `ChatOpenAI` configuration uses environment variables, making it easy to switch between providers:

```typescript
const model = new ChatOpenAI({
  model: process.env.AI_MODEL,
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY
});
```

This pattern means:

- **No code changes** to switch providers - just update your `.env` file
- **Easy testing** - Use GitHub Models for development, Azure AI Foundry for production
- **Cost optimization** - Switch to different models or providers as needed
- **Works with both providers** - The same configuration works with GitHub Models and Azure AI Foundry endpoints
- **Keeps credentials secure** - API keys and endpoints are in `.env`, not in your code

> **💡 Note**: LangChain.js also provides `initChatModel()` for even more flexible, provider-agnostic initialization. See [Chapter 2 Appendix](../02-chat-models/README.md#-appendix-provider-agnostic-initialization) for details on this advanced pattern.

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
