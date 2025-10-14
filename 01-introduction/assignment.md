# Chapter 1 Assignment: Introduction to LangChain.js

## Overview

Now that you've learned the basics of LangChain.js, it's time to practice! These challenges will help reinforce what you've learned about models, messages, and making your first LLM calls.

## Prerequisites

- Completed [Course Setup](../00-course-setup/README.md)
- Read [Chapter 1](./README.md)
- Run all three code examples

---

## Challenge: Experiment with System Prompts 🎭

**Goal**: Learn how SystemMessage affects AI behavior.

**Tasks**:
1. Create a file called `personality-test.ts`
2. Test the same question with three different system prompts:
   - A pirate personality
   - A professional business analyst
   - A friendly teacher for kids
3. Display all three responses side-by-side

**Example System Prompts**:
- Pirate: `"You are a pirate. Answer all questions in pirate speak with 'Arrr!' and nautical terms."`
- Analyst: `"You are a professional business analyst. Give precise, data-driven answers."`
- Teacher: `"You are a friendly teacher explaining concepts to 8-year-old children."`

**Question to Test**: "What is artificial intelligence?"

**Success Criteria**:
- Same question gets three very different response styles
- You understand how SystemMessage shapes the AI's personality

**Hints**:
```typescript
// 1. Import required modules
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import "dotenv/config";

// 2. Create the model (outside the loop, reuse for all personalities)
const model = new ChatOpenAI({
  model: process.env.AI_MODEL || "gpt-4o-mini",
  configuration: {
    baseURL: process.env.AI_ENDPOINT,
    defaultQuery: process.env.AI_API_VERSION
      ? { "api-version": process.env.AI_API_VERSION }
      : undefined,
  },
  apiKey: process.env.AI_API_KEY,
});

// 3. Define personalities array
const personalities = [
  { name: "Pirate", system: "You are a pirate..." },
  { name: "Analyst", system: "You are a business analyst..." },
  // ... more personalities
];

const question = "What is artificial intelligence?";

// 4. Loop through personalities
for (const personality of personalities) {
  const messages = [
    new SystemMessage(personality.system),
    new HumanMessage(question)
  ];

  const response = await model.invoke(messages);
  console.log(response.content);
}
```

---

## Bonus Challenge: Model Performance Comparison 🔬

**Goal**: Compare multiple models on the same task.

**Tasks**:
1. Create a file called `model-performance.ts`
2. Test at least 3 models available on GitHub Models:
   - `gpt-4o`
   - `gpt-4o-mini`
   - `gpt-4` (if available)
3. For each model, measure:
   - Response time
   - Response length (character count)
   - Response quality (your subjective assessment)
4. Create a simple table showing the results

**Test Question**: "Explain the difference between machine learning and deep learning."

**Expected Output**:
```
📊 Model Performance Comparison
─────────────────────────────────────────────
Model          | Time    | Length | Quality
─────────────────────────────────────────────
gpt-4o         | 1234ms  | 456ch  | ⭐⭐⭐⭐⭐
gpt-4o-mini    | 567ms   | 234ch  | ⭐⭐⭐⭐
```

**Success Criteria**:
- Script compares at least 3 models
- Results are displayed in a clear format
- You can explain which model you'd choose for different use cases

**Hints**:
```typescript
// 1. Import required modules
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

// 2. Define question and models array
const question = "Explain the difference between machine learning and deep learning.";

const models = [
  { name: "gpt-4o", description: "Most capable" },
  { name: "gpt-4o-mini", description: "Fast and efficient" },
];

// 3. Create a function to test each model
async function testModel(modelName: string) {
  const model = new ChatOpenAI({
    model: modelName,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  const startTime = Date.now();
  const response = await model.invoke(question);
  const endTime = Date.now();

  return {
    name: modelName,
    time: endTime - startTime,
    length: response.content.toString().length,
    response: response.content.toString(),
  };
}

// 4. Loop through models and collect results
for (const modelInfo of models) {
  const result = await testModel(modelInfo.name);
  // Display results with padEnd for table formatting
  console.log(`${result.name.padEnd(15)} | ${result.time}ms`.padEnd(8));
}
```

---

## Submission Checklist

Before moving to Chapter 2, make sure you've completed:

- [ ] Challenge: System prompt experiment shows personality differences
- [ ] Bonus: Model comparison displays results (optional)

---

## Solutions

Solutions for all challenges are available in the [`solution/`](./solution/) folder. Try to complete the challenges on your own first before looking at the solutions!

**Additional Examples**: Check out the [`samples/`](./samples/) folder for more example solutions that demonstrate other useful concepts!

---

## Need Help?

- **Stuck on code**: Review the examples in [`code/`](./code/)
- **Error messages**: Check [Course Setup](../00-course-setup/README.md) troubleshooting
- **Concepts unclear**: Re-read the [Chapter 1 README](./README.md)
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## Next Steps

Once you've completed these challenges, you're ready for:

**[Chapter 2: Chat Models & Basic Interactions](../02-chat-models/README.md)**

Great job! You've taken your first steps with LangChain.js! 🎉
