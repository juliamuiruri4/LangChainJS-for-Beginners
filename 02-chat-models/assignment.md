# Chapter 2 Assignment: Chat Models & Basic Interactions

## Overview

Practice multi-turn conversations, streaming, parameters, and error handling to build robust AI applications.

## Prerequisites

- Completed [Chapter 2](./README.md)
- Run all four code examples
- Understand conversation history management

---

## Challenge: Interactive Chatbot 🤖

**Goal**: Build a chatbot that maintains conversation history across multiple exchanges.

**Tasks**:
1. Create `chatbot.ts` in the `02-chat-models/code/` folder
2. Implement an interactive chatbot that:
   - Accepts user input in a loop
   - Maintains conversation history
   - Allows users to type "quit" to exit
   - Shows the conversation history length after each exchange
3. Use a SystemMessage to give the bot a personality (you choose!)

**Example Interaction**:
```
🤖 Chatbot: Hello! I'm your helpful assistant. Ask me anything!

You: What is Node.js?
🤖: Node.js is a JavaScript runtime...

You: Can you show me an example?
🤖: Sure! Here's a simple Node.js example...

You: quit
👋 Goodbye! We had 5 messages in our conversation.
```

**Success Criteria**:
- Bot remembers previous messages
- Conversation history is maintained correctly
- User can exit gracefully

**Hints**:
```typescript
// 1. Import required modules
import { createChatModel } from "@/scripts/create-model.js";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import readline from "readline";
import "dotenv/config";

// 2. Create the model
const model = createChatModel();

// 3. Initialize conversation history with a system message
const messages: (SystemMessage | HumanMessage | AIMessage)[] = [
  new SystemMessage("Your bot personality here"),
];

// 4. Set up readline for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 5. Add messages to history as conversation progresses
messages.push(new HumanMessage(userInput));
const response = await model.invoke(messages);
messages.push(new AIMessage(String(response.content)));
```

---

## Bonus Challenge: Temperature Experiment 🌡️

**Goal**: Understand how temperature affects AI creativity and consistency.

**Tasks**:
1. Create `temperature-lab.ts`
2. Test the same creative prompt with 5 different temperature values: 0, 0.5, 1, 1.5, 2
3. Run each temperature 3 times to see variability
4. Display results in a readable format
5. Add your analysis of which temperature works best for different use cases

**Creative Prompt Ideas**:
- "Write a tagline for a coffee shop"
- "Create a name for a tech startup"
- "Suggest a title for a mystery novel"

**Expected Output**:
```
🌡️ Temperature: 0
─────────────────────────────────────
Try 1: "Brew Your Best Day"
Try 2: "Brew Your Best Day"
Try 3: "Brew Your Best Day"

🌡️ Temperature: 2
─────────────────────────────────────
Try 1: "Caffeinated Dreams Await"
Try 2: "Sip the Extraordinary"
Try 3: "Where Magic Meets Mocha"

📊 Analysis:
- Temperature 0: Perfect for factual, consistent responses
- Temperature 2: Great for creative brainstorming
```

**Success Criteria**:
- Tests at least 5 temperature values
- Shows variability clearly
- Includes your analysis of results

**Hints**:
```typescript
// 1. Import required modules
import { createChatModel } from "@/scripts/create-model.js";
import "dotenv/config";

// 2. Define temperatures to test
const temperatures = [0, 0.5, 1, 1.5, 2];
const prompt = "Write a catchy tagline for a coffee shop.";

// 3. Loop through temperatures
for (const temp of temperatures) {
  console.log(`\n🌡️ Temperature: ${temp}`);

  // Create model with current temperature (inside loop!)
  const model = createChatModel({
    temperature: temp, // Use loop variable
  });

  // 4. Run multiple trials for this temperature
  for (let trial = 1; trial <= 3; trial++) {
    const response = await model.invoke(prompt);
    console.log(`Try ${trial}: "${response.content}"`);
  }
}
```

---

## Submission Checklist

Before moving to Chapter 3, make sure you've completed:

- [ ] Challenge: Interactive chatbot with history
- [ ] Bonus: Temperature comparison experiment (optional)

---

## Solutions

Solutions for all challenges are available in the [`solution/`](./solution/) folder. Try to complete the challenges on your own first!

**Additional Examples**: Check out the [`samples/`](./samples/) folder for more example solutions covering streaming, error handling, and token tracking!

---

## Need Help?

- **Code issues**: Review examples in [`code/`](./code/)
- **Errors**: Check Chapter 2 README error handling section
- **Concepts**: Re-read the [Chapter 2 README](./README.md)
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## Next Steps

Once you've completed these challenges, you're ready for:

**[Chapter 3: Prompt Engineering with Templates](../03-prompt-templates/README.md)**

You're making great progress! 🚀
