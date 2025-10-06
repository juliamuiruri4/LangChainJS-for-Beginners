# Chapter 1: Introduction to LangChain.js

Welcome to your first step in building AI-powered applications with LangChain.js!

## ⏱️ Lesson Overview

- **Estimated Time**: 45 minutes
- **Prerequisites**: Completed [Course Setup](../00-course-setup/README.md)
- **Difficulty**: Beginner

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Understand what LangChain.js is and why it exists
- Recognize common AI application patterns
- Set up a development environment
- Make your first LLM call using GitHub Models

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
- ✅ **Provider abstraction** - Switch between OpenAI, Azure, Anthropic with minimal code changes
- ✅ **Prompt templates** - Reusable, testable prompts
- ✅ **Chains** - Combine multiple operations seamlessly
- ✅ **Memory** - Built-in conversation history
- ✅ **Agents** - Decision-making AI that can use tools

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

**Code**: [`code/01-hello-world.ts`](./code/01-hello-world.ts)

This example shows the simplest possible LangChain.js application:

```typescript
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function main() {
  console.log("🚀 Hello LangChain.js!\n");

  // Create a model instance
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    configuration: {
      baseURL: "https://models.inference.ai.azure.com",
    },
    apiKey: process.env.GITHUB_TOKEN,
  });

  // Make your first AI call!
  const response = await model.invoke("What is LangChain in one sentence?");

  console.log("🤖 AI Response:", response.content);
  console.log("\n✅ Success! You just made your first LangChain.js call!");
}

main().catch(console.error);
```

**Try it yourself**:
```bash
npx tsx 01-introduction/code/01-hello-world.ts
```

**What's happening here?**
1. We import `ChatOpenAI` (works with GitHub Models)
2. We create a model instance pointing to GitHub Models
3. We call `invoke()` with a simple string prompt
4. We get back a response with the AI's answer

---

## 💬 Understanding Messages

LLMs work best with structured conversations. LangChain.js provides message types for this.

### Example 2: Message Types

**Code**: [`code/02-message-types.ts`](./code/02-message-types.ts)

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import "dotenv/config";

async function main() {
  console.log("🎭 Understanding Message Types\n");

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    configuration: {
      baseURL: "https://models.inference.ai.azure.com",
    },
    apiKey: process.env.GITHUB_TOKEN,
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

**Message Types**:
- **SystemMessage**: Sets the AI's behavior and personality
- **HumanMessage**: User input
- **AIMessage**: The AI's responses (usually added automatically)

**Why use messages instead of strings?**
- Better control over AI behavior
- Maintains conversation context
- More powerful and flexible

---

## 🔄 Comparing Models

GitHub Models gives you access to multiple AI models. Let's compare them!

### Example 3: Model Comparison

**Code**: [`code/03-model-comparison.ts`](./code/03-model-comparison.ts)

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
        baseURL: "https://models.inference.ai.azure.com",
      },
      apiKey: process.env.GITHUB_TOKEN,
    });

    const response = await model.invoke(prompt);
    console.log(`Response: ${response.content}`);
  }

  console.log("\n✅ Comparison complete!");
}

compareModels().catch(console.error);
```

**Try it yourself**:
```bash
npx tsx 01-introduction/code/03-model-comparison.ts
```

**What you'll notice**:
- Different models have different response styles
- Some are more detailed, others more concise
- `gpt-4o` is more capable, `gpt-4o-mini` is faster and cheaper

---

## 🎓 Key Takeaways

Let's review what you learned:

- ✅ **LangChain.js is an abstraction layer** - It provides a consistent interface across different LLM providers
- ✅ **Built on composable components** - Models, prompts, chains, agents, and memory work together
- ✅ **GitHub Models offers free access** - Perfect for learning and prototyping
- ✅ **Messages have types** - SystemMessage, HumanMessage, and AIMessage serve different purposes
- ✅ **Provider flexibility** - Switch between models with minimal code changes

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Setup Challenge** - Verify your environment
2. **First Interaction** - Build a simple Q&A program
3. **Message Types Exploration** - Experiment with system prompts
4. **Model Comparison** - Compare different models' outputs

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

💬 **Questions or stuck?** Join our [Discord community](https://aka.ms/foundry/discord) or open a [GitHub Discussion](https://github.com/yourusername/langchainjs-for-beginners/discussions)!
