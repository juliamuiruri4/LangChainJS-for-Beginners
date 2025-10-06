# Chapter 9: Production Best Practices

## ⏱️ Lesson Overview

- **Estimated Time**: 90 minutes
- **Prerequisites**: Completed [Chapter 8](../08-memory-conversations/README.md)
- **Difficulty**: Beginner-Intermediate

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Switch between different AI providers easily
- Deploy applications using Azure AI Foundry
- Implement monitoring with LangSmith
- Handle errors and fallbacks
- Optimize for cost and performance
- Cache responses for efficiency

---

## 📖 The Power Company Analogy

**Imagine building a factory that needs electricity.**

**Bad Approach** (Vendor Lock-in):
```
❌ Hard-wire everything to one power company
❌ If they have an outage, you're completely down
❌ Can't switch if they raise prices
❌ No backup plan
```

**Good Approach** (Provider Flexibility):
```
✅ Use a standard plug interface
✅ Can switch power companies if needed
✅ Have backup generators (fallbacks)
✅ Monitor usage and costs
✅ Optimize consumption
```

**Your AI app should work the same way!**

Don't hard-code to one provider—build for flexibility from day one.

---

## 🔄 Provider-Agnostic Architecture

### You've Been Using It All Along!

**Good news**: Every example in this course has been provider-agnostic from Chapter 1!

All examples use this pattern:

```typescript
const model = new ChatOpenAI({
  model: process.env.AI_MODEL || "gpt-4o-mini",
  configuration: {
    baseURL: process.env.AI_ENDPOINT,
  },
  apiKey: process.env.AI_API_KEY,
});
```

**Switching providers is as simple as updating `.env`:**

```bash
# GitHub Models (Free)
AI_API_KEY=ghp_your_github_token
AI_ENDPOINT=https://models.inference.ai.azure.com
AI_MODEL=gpt-4o-mini

# Switch to Azure AI Foundry
AI_API_KEY=your_azure_key
AI_ENDPOINT=https://your-resource.openai.azure.com
AI_MODEL=gpt-4o-mini

# Or use OpenAI directly
AI_API_KEY=your_openai_key
AI_ENDPOINT=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

**Zero code changes needed!** 🎉

### Example 1: Advanced Provider Patterns

**Code**: [`code/01-model-switching.ts`](./code/01-model-switching.ts)

This example shows advanced patterns like:
- Runtime provider selection
- Provider-specific configurations
- Fallback strategies

**Benefits**:
- ✅ Switch providers instantly
- ✅ Easy A/B testing
- ✅ No vendor lock-in
- ✅ Cost optimization
- ✅ Disaster recovery

---

## ☁️ Azure AI Foundry Deployment

Azure AI Foundry is Microsoft's platform for deploying production AI applications.

### Why Azure AI Foundry?

- ✅ **Production-ready**: Enterprise-grade infrastructure
- ✅ **Global scale**: Deploy worldwide
- ✅ **Integrated**: Works with Azure services
- ✅ **Cost-effective**: Pay only for what you use
- ✅ **Secure**: Enterprise security and compliance
- ✅ **Monitoring**: Built-in observability

### Setup Azure AI Foundry

1. **Create** an Azure AI Foundry project at [ai.azure.com](https://ai.azure.com)
2. **Deploy** a model (GPT-4o, GPT-4o-mini, etc.)
3. **Get** your endpoint and API key from the Azure Portal

### Switching to Azure AI Foundry

Update your `.env` file (that's it!):

```bash
# Change these three values:
AI_API_KEY=your_azure_openai_api_key
AI_ENDPOINT=https://your-resource.openai.azure.com
AI_MODEL=gpt-4o-mini

# All course examples now use Azure AI Foundry!
```

**Your endpoint** looks like: `https://YOUR-RESOURCE-NAME.openai.azure.com`

**Model name** matches your deployment name in Azure (e.g., `gpt-4o-mini`, `gpt-4o`)

---

## 📊 Monitoring with LangSmith

LangSmith is LangChain's observability platform.

### What LangSmith Provides

- **Tracing**: See every step of your chain
- **Debugging**: Find where things go wrong
- **Analytics**: Cost, latency, success rates
- **Testing**: Compare prompt variations

### Example 3: LangSmith Setup

**Code**: [`code/03-langsmith.ts`](./code/03-langsmith.ts)

```bash
# .env
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your-langsmith-key
LANGCHAIN_PROJECT=my-project
```

```typescript
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

// Traces are automatically sent to LangSmith!
const model = new ChatOpenAI({
  model: process.env.AI_MODEL || "gpt-4o-mini",
  configuration: {
    baseURL: process.env.AI_ENDPOINT,
  },
  apiKey: process.env.AI_API_KEY,
});

const response = await model.invoke("Test tracing");
// Check LangSmith dashboard to see the trace!
```

---

## 🛡️ Error Handling & Fallbacks

### Example 4: Fallback Strategy

**Code**: [`code/04-fallbacks.ts`](./code/04-fallbacks.ts)

```typescript
import { ChatOpenAI } from "@langchain/openai";

const primaryModel = new ChatOpenAI({
  model: process.env.AI_MODEL || "gpt-4o",
  configuration: {
    baseURL: process.env.AI_ENDPOINT,
  },
  apiKey: process.env.AI_API_KEY,
});

const fallbackModel = new ChatOpenAI({
  model: process.env.AI_MODEL || "gpt-4o-mini",
  configuration: {
    baseURL: process.env.AI_ENDPOINT,
  },
  apiKey: process.env.AI_API_KEY,
});

// Create model with fallback
const modelWithFallback = primaryModel.withFallbacks({
  fallbacks: [fallbackModel],
});

// If gpt-4o fails, automatically uses gpt-4o-mini
const response = await modelWithFallback.invoke("Hello!");
```

---

## 💰 Cost Optimization

### 1. Caching

Cache responses to avoid duplicate API calls:

```typescript
import { InMemoryCache } from "langchain/cache";
import { ChatOpenAI } from "@langchain/openai";

const cache = new InMemoryCache();

const model = new ChatOpenAI({
  cache,
  model: process.env.AI_MODEL || "gpt-4o-mini",
});

// First call hits API
await model.invoke("What is LangChain?");

// Second call uses cache (free!)
await model.invoke("What is LangChain?");
```

### 2. Use Smaller Models

```typescript
// Expensive
const gpt4o = new ChatOpenAI({ model: process.env.AI_MODEL || "gpt-4o" });

// 10x cheaper for simple tasks
const gpt4omini = new ChatOpenAI({ model: process.env.AI_MODEL || "gpt-4o-mini" });
```

### 3. Streaming

Stream responses to show users progress:

```typescript
for await (const chunk of await model.stream("Long question...")) {
  process.stdout.write(chunk.content);
}
```

---

## 🎓 Key Takeaways

- ✅ **Provider flexibility**: Don't lock into one vendor
- ✅ **Azure AI Foundry**: Production-ready deployment
- ✅ **LangSmith**: Monitor and debug your chains
- ✅ **Fallbacks**: Handle failures gracefully
- ✅ **Caching**: Save money on duplicate requests
- ✅ **Optimize models**: Use the right model for each task

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Multi-Provider App** - Build with easy provider switching
2. **Azure Deployment** - Deploy to Azure AI Foundry
3. **Monitoring Dashboard** - Set up LangSmith tracking
4. **Cost Optimizer** - Implement caching and smart model selection

---

## 📚 Additional Resources

- [Azure AI Foundry Documentation](https://learn.microsoft.com/azure/ai-foundry/)
- [LangSmith Guide](https://docs.smith.langchain.com/)
- [Production Checklist](https://js.langchain.com/docs/production/)

---

## 🗺️ Navigation

- **Previous**: [08-memory-conversations](../08-memory-conversations/README.md)
- **Next**: [10-langgraph-intro](../10-langgraph-intro/README.md)
- **Home**: [Course Home](../README.md)

---

💬 **Questions or stuck?** Join our [Discord community](https://aka.ms/foundry/discord)!
