# Chapter 1 Assignment: Introduction to LangChain.js

## Overview

Now that you've learned the basics of LangChain.js, it's time to practice! These challenges will help reinforce what you've learned about models, messages, and making your first LLM calls.

## Prerequisites

- Completed [Course Setup](../00-course-setup/README.md)
- Read [Chapter 1](./README.md)
- Run all three code examples

---

## Challenge 1: Verify Your Setup ⚙️

**Goal**: Ensure your environment is correctly configured.

**Tasks**:
1. Create a file called `verify-setup.ts` in the `01-introduction/code/` folder
2. Write a script that:
   - Checks if `AI_API_KEY` is set
   - Makes a simple call to `gpt-4o-mini`
   - Prints "✅ Setup verified!" if successful
   - Prints helpful error messages if something fails

**Success Criteria**:
- Script runs without errors
- You see a response from the AI model

---

## Challenge 2: Build a Simple Q&A Program 💬

**Goal**: Create a program that asks the user for a question and gets an AI response.

**Tasks**:
1. Create a file called `qa-program.ts`
2. Use Node.js `readline` or prompts to get user input
3. Send the user's question to the AI
4. Display the response in a friendly format

**Example Interaction**:
```
❓ Ask me anything: What is TypeScript?
🤖 AI: TypeScript is a programming language...
```

**Bonus**:
- Add a loop so users can ask multiple questions
- Add a "quit" or "exit" command

**Hints**:
```typescript
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Your question: ', (answer) => {
  // Your code here
  rl.close();
});
```

---

## Challenge 3: Experiment with System Prompts 🎭

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

---

## Challenge 4: Model Performance Comparison 🔬

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

---

## Bonus Challenge: Create Your Own Example 🎯

**Goal**: Apply what you've learned to solve a real problem.

**Task**:
Think of a simple use case where an LLM could help you, then build it!

**Ideas**:
- Code comment generator
- Email subject line suggester
- Recipe idea generator based on ingredients
- Study guide creator from topics
- Simple chatbot for a specific domain

**Requirements**:
- Use LangChain.js
- Include at least one SystemMessage
- Add error handling
- Document your code with comments

---

## Submission Checklist

Before moving to Chapter 2, make sure you've completed:

- [ ] Challenge 1: Setup verification script works
- [ ] Challenge 2: Q&A program accepts user input
- [ ] Challenge 3: System prompt experiment shows personality differences
- [ ] Challenge 4: Model comparison displays results
- [ ] Bonus: Created your own useful example (optional)

---

## Solutions

Solutions for all challenges are available in the [`solution/`](./solution/) folder. Try to complete the challenges on your own first before looking at the solutions!

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
