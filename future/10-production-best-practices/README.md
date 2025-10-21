# Chapter 10: Production Best Practices

In this chapter, you'll learn production-ready strategies for deploying AI applications including provider-agnostic architecture, Azure AI Foundry deployment, and monitoring with LangSmith. You'll implement error handling with fallback strategies, optimize costs with caching, and learn to switch between AI providers without code changes. These practices ensure your AI applications are reliable, scalable, and cost-effective in production environments.

## Prerequisites

- Completed [Chapter 9](../09-langgraph-patterns/README.md)

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Switch between different AI providers easily
- Deploy applications using Azure AI Foundry
- Implement monitoring with LangSmith
- Handle errors and fallbacks
- Evaluate and test LLM outputs
- Use LLM-as-judge for quality assessment
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
  model: process.env.AI_MODEL || "gpt-5-mini",
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
AI_MODEL=gpt-5-mini

# Switch to Azure AI Foundry
AI_API_KEY=your_azure_key
AI_ENDPOINT=https://your-resource.openai.azure.com
AI_MODEL=gpt-5-mini

# Or use OpenAI directly
AI_API_KEY=your_openai_key
AI_ENDPOINT=https://api.openai.com/v1
AI_MODEL=gpt-5-mini
```

**Zero code changes needed!** 🎉

### Example 1: Extended Provider Patterns

**Code**: [`code/01-model-switching.ts`](./code/01-model-switching.ts)

This example shows extended patterns like:
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
2. **Deploy** a model (GPT-5, GPT-5-mini, etc.)
3. **Get** your endpoint and API key from the Azure Portal

### Switching to Azure AI Foundry

Update your `.env` file (that's it!):

```bash
# Change these three values:
AI_API_KEY=your_azure_openai_api_key
AI_ENDPOINT=https://your-resource.openai.azure.com
AI_MODEL=gpt-5-mini

# All course examples now use Azure AI Foundry!
```

**Your endpoint** looks like: `https://YOUR-RESOURCE-NAME.openai.azure.com`

**Model name** matches your deployment name in Azure (e.g., `gpt-5-mini`, `gpt-5`)

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
  model: process.env.AI_MODEL || "gpt-5-mini",
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
  model: process.env.AI_MODEL || "gpt-5",
  configuration: {
    baseURL: process.env.AI_ENDPOINT,
  },
  apiKey: process.env.AI_API_KEY,
});

const fallbackModel = new ChatOpenAI({
  model: process.env.AI_MODEL || "gpt-5-mini",
  configuration: {
    baseURL: process.env.AI_ENDPOINT,
  },
  apiKey: process.env.AI_API_KEY,
});

// Create model with fallback
const modelWithFallback = primaryModel.withFallbacks({
  fallbacks: [fallbackModel],
});

// If gpt-5 fails, automatically uses gpt-5-mini
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
  model: process.env.AI_MODEL || "gpt-5-mini",
});

// First call hits API
await model.invoke("What is LangChain?");

// Second call uses cache (free!)
await model.invoke("What is LangChain?");
```

### 2. Use Smaller Models

```typescript
// Expensive
const gpt4o = new ChatOpenAI({ model: process.env.AI_MODEL || "gpt-5" });

// 10x cheaper for simple tasks
const gpt4omini = new ChatOpenAI({ model: process.env.AI_MODEL || "gpt-5-mini" });
```

### 3. Streaming

Stream responses to show users progress:

```typescript
for await (const chunk of await model.stream("Long question...")) {
  process.stdout.write(chunk.content);
}
```

---

## 🧪 Evaluation & Testing

Testing AI applications is different from testing traditional software. You need to evaluate quality, not just correctness.

### The Restaurant Quality Control Analogy

**Traditional Software Testing (Binary)**:
```
✅ Order total = $25.50? → Pass
❌ Order total = $25.49? → Fail
```

**AI Testing (Quality-based)**:
```
Question: "Explain photosynthesis"

Output A: "Plants use sunlight..." → How good? (1-5)
Output B: "Green stuff makes energy..." → How good? (1-5)
Output C: "Photosynthesis is the process..." → How good? (1-5)

All are "correct" but vary in quality!
```

**Think of it like restaurant quality control:**
- ✅ Food safety (must pass) = Traditional tests
- 📊 Taste, presentation, service = AI evaluation

### Why Evaluate LLM Outputs?

- ✅ **Catch hallucinations**: Ensure factual accuracy
- ✅ **Maintain quality**: Consistent response quality
- ✅ **Compare prompts**: A/B test different approaches
- ✅ **Detect regressions**: Ensure updates don't break things
- ✅ **Optimize costs**: Find the cheapest model that meets quality standards

### Types of Evaluation

#### 1. Manual Evaluation (Human Review)

Good for initial development, small scale.

```typescript
// Generate responses and manually review
const responses = [
  await model.invoke("Question 1"),
  await model.invoke("Question 2"),
  await model.invoke("Question 3"),
];

// Manually rate each response
// 1 = Poor, 5 = Excellent
```

#### 2. Automated Metrics

Check specific criteria programmatically.

**Example 5: Automated Evaluation**

**Code**: [`code/05-evaluation.ts`](./code/05-evaluation.ts)

```typescript
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function evaluateResponse(question: string, answer: string) {
  // Check response length
  const hasMinLength = answer.length >= 50;

  // Check for key terms
  const hasRelevantTerms = question.toLowerCase().split(" ").some(term =>
    answer.toLowerCase().includes(term)
  );

  // Check response time
  const startTime = Date.now();
  // ... generate response ...
  const responseTime = Date.now() - startTime;
  const isFast = responseTime < 5000; // Under 5 seconds

  return {
    length: hasMinLength ? "✅" : "❌",
    relevance: hasRelevantTerms ? "✅" : "❌",
    speed: isFast ? "✅" : "❌",
    score: [hasMinLength, hasRelevantTerms, isFast].filter(Boolean).length / 3,
  };
}

// Test multiple responses
const testCases = [
  { question: "What is TypeScript?", expectedKeywords: ["typescript", "type", "javascript"] },
  { question: "Explain RAG systems", expectedKeywords: ["retrieval", "generation", "documents"] },
];

for (const test of testCases) {
  const answer = await model.invoke(test.question);
  const evaluation = await evaluateResponse(test.question, answer.content);

  console.log(`Question: ${test.question}`);
  console.log(`Evaluation:`, evaluation);
  console.log(`Score: ${(evaluation.score * 100).toFixed(0)}%`);
}
```

#### 3. LLM-as-Judge Evaluation

Use another LLM to evaluate responses!

**Example 6: LLM-as-Judge**

**Code**: [`code/06-llm-judge.ts`](./code/06-llm-judge.ts)

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as z from "zod";
import "dotenv/config";

async function evaluateWithLLM(question: string, answer: string) {
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-5-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Define evaluation schema
  const EvaluationSchema = z.object({
    accuracy: z.number().min(1).max(5).describe("Factual accuracy (1-5)"),
    completeness: z.number().min(1).max(5).describe("How complete is the answer (1-5)"),
    clarity: z.number().min(1).max(5).describe("How clear and well-written (1-5)"),
    relevance: z.number().min(1).max(5).describe("How relevant to the question (1-5)"),
    reasoning: z.string().describe("Brief explanation of the scores"),
  });

  const evaluator = model.withStructuredOutput(EvaluationSchema);

  const evaluationPrompt = ChatPromptTemplate.fromTemplate(`
You are an expert evaluator. Rate the following answer on a scale of 1-5 for each criterion.

Question: {question}
Answer: {answer}

Provide scores and brief reasoning.`);

  const chain = evaluationPrompt.pipe(evaluator);

  const evaluation = await chain.invoke({ question, answer });

  const averageScore = (
    evaluation.accuracy +
    evaluation.completeness +
    evaluation.clarity +
    evaluation.relevance
  ) / 4;

  return {
    ...evaluation,
    averageScore,
  };
}

// Test it
const question = "What is machine learning?";
const answer = await model.invoke(question);

const evaluation = await evaluateWithLLM(question, answer.content);

console.log("📊 Evaluation Results:");
console.log(`   Accuracy: ${evaluation.accuracy}/5`);
console.log(`   Completeness: ${evaluation.completeness}/5`);
console.log(`   Clarity: ${evaluation.clarity}/5`);
console.log(`   Relevance: ${evaluation.relevance}/5`);
console.log(`   Average: ${evaluation.averageScore.toFixed(2)}/5`);
console.log(`\n💭 Reasoning: ${evaluation.reasoning}`);
```

### Testing Strategies

#### 1. Golden Dataset Testing

Create a set of test questions with expected characteristics:

```typescript
const goldenDataset = [
  {
    question: "What is TypeScript?",
    expectedKeywords: ["javascript", "type", "static"],
    expectedLength: { min: 100, max: 500 },
  },
  {
    question: "Explain async/await",
    expectedKeywords: ["promise", "asynchronous", "await"],
    expectedLength: { min: 150, max: 600 },
  },
];

// Test all golden examples
for (const test of goldenDataset) {
  const response = await model.invoke(test.question);
  const passes = validateResponse(response, test);
  console.log(`${test.question}: ${passes ? "✅" : "❌"}`);
}
```

#### 2. Regression Testing

Ensure new changes don't break existing functionality:

```typescript
// Save baseline responses
const baseline = {
  "What is RAG?": "Previous response...",
  "Explain LCEL": "Previous response...",
};

// After making changes, compare
for (const [question, oldAnswer] of Object.entries(baseline)) {
  const newAnswer = await model.invoke(question);
  const similarity = calculateSimilarity(oldAnswer, newAnswer.content);

  if (similarity < 0.7) {
    console.warn(`⚠️ Response changed significantly for: ${question}`);
  }
}
```

#### 3. A/B Testing Prompts

Compare different prompt strategies:

```typescript
const promptA = "Explain {topic} in simple terms.";
const promptB = "You are an expert teacher. Explain {topic} clearly with examples.";

const results = {
  A: await evaluateBatch(promptA, testQuestions),
  B: await evaluateBatch(promptB, testQuestions),
};

console.log(`Prompt A average score: ${results.A.avgScore}`);
console.log(`Prompt B average score: ${results.B.avgScore}`);
console.log(`Winner: ${results.B.avgScore > results.A.avgScore ? "B" : "A"}`);
```

### Best Practices

1. **Start with manual evaluation** - Understand what "good" looks like
2. **Build automated checks** - Scale your evaluation
3. **Use LLM-as-judge for quality** - Evaluate nuanced aspects
4. **Track metrics over time** - Monitor for regressions
5. **Test edge cases** - Unusual inputs, long texts, special characters
6. **Evaluate costs** - Balance quality vs. expense

### Evaluation Checklist

Before deploying to production:

- [ ] Manual review of diverse examples
- [ ] Automated tests for critical paths
- [ ] Quality evaluation (LLM-as-judge)
- [ ] Performance benchmarks (latency, cost)
- [ ] Edge case testing
- [ ] Regression tests
- [ ] A/B test different approaches
- [ ] Monitor with LangSmith in staging

---

## 🎓 Key Takeaways

- ✅ **Provider flexibility**: Don't lock into one vendor
- ✅ **Azure AI Foundry**: Production-ready deployment
- ✅ **LangSmith**: Monitor and debug your chains
- ✅ **Evaluation is critical**: Test quality, not just correctness
- ✅ **LLM-as-judge**: Use AI to evaluate AI responses
- ✅ **Automated testing**: Scale evaluation with automated checks
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

- **Previous**: [09-langgraph-patterns](../09-langgraph-patterns/README.md)
- **Home**: [Course Home](../README.md)

---

## 🎉 Congratulations!

You've completed the LangChain.js for Beginners course! You now have the skills to:
- Build AI applications with LangChain.js
- Work with documents and embeddings
- Create RAG systems
- Build agents with tools using LangGraph
- Manage conversation memory with LangGraph
- Create multi-step workflows with LangGraph
- Deploy to production with Azure AI Foundry

**What's next?**
- Build your own AI project
- Join our [Discord community](https://aka.ms/foundry/discord)
- Explore [LangChain patterns](https://js.langchain.com/docs/use_cases/)
- Share what you've built!

---

## 💬 Questions or stuck? Join our [Discord community](https://aka.ms/foundry/discord)!
