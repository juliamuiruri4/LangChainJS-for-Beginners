# Chapter 8 Assignment: Memory & Conversations

## Overview

Practice implementing conversation memory to build stateful chatbots that remember context.

## Prerequisites

- Completed [Chapter 8](./README.md)
- Run all code examples
- Understand different memory types

---

## Challenge 1: Memory Types Comparison 🔬

**Goal**: Compare all memory types side-by-side.

**Tasks**:
1. Create `memory-comparison.ts` in the `08-memory-conversations/code/` folder
2. Build 3 chatbots with different memory:
   - Buffer Memory (stores all)
   - Window Memory (last 4 messages)
   - Summary Memory (summarizes)
3. Have the SAME conversation with all three:
   ```
   - "My name is Sam"
   - "I love programming"
   - "I work at TechCorp"
   - "I have two cats"
   - "I live in Boston"
   ```
4. Then ask each: "Tell me everything you know about me"
5. Compare and analyze results

**Success Criteria**:
- All 3 memory types implemented
- Same conversation for fair comparison
- Clear output showing differences
- Analysis of which works best when

---

## Challenge 2: Stateful Personal Assistant 🤖

**Goal**: Build a chatbot that remembers user preferences.

**Tasks**:
1. Create `personal-assistant.ts`
2. Implement features:
   - Remember user's name, preferences, and context
   - Track conversation topics
   - Refer back to previous information
   - Maintain context across session
3. Support commands:
   - `/memory` - Show current memory
   - `/clear` - Clear memory
   - `/summary` - Get conversation summary
4. Build interactive CLI interface

**Example Conversation**:
```
Bot: Hi! I'm your assistant. What's your name?
User: I'm Alex
Bot: Nice to meet you, Alex!
User: I prefer concise answers
Bot: Got it, I'll keep responses brief.
User: What's my name?
Bot: Alex
User: /memory
Bot: [Shows stored information]
```

**Success Criteria**:
- Remembers information across conversation
- Supports all commands
- Interactive and responsive
- Clear memory management

---

## Challenge 3: Multi-User Chat System 💬

**Goal**: Handle separate conversation histories for different users.

**Tasks**:
1. Create `multi-user-chat.ts`
2. Implement session-based memory:
   ```typescript
   const sessions: Record<string, ChatMessageHistory> = {};

   function getMemory(userId: string) {
     if (!sessions[userId]) {
       sessions[userId] = new ChatMessageHistory();
     }
     return sessions[userId];
   }
   ```
3. Support multiple concurrent users
4. Each user has independent memory
5. CLI switches between users

**Test Scenario**:
```
[User: Alice]
Alice: My favorite color is blue

[User: Bob]
Bob: I love hiking

[User: Alice]
Alice: What's my favorite color?
Bot: Blue

[User: Bob]
Bob: What do I love?
Bot: Hiking
```

**Success Criteria**:
- Separate memory per user
- No cross-contamination
- Easy user switching
- Persistent across session

---

## Challenge 4: Smart Memory Optimizer 🧠

**Goal**: Build a system that automatically chooses the best memory type.

**Tasks**:
1. Create `smart-memory.ts`
2. Implement logic to switch memory types based on:
   - Conversation length
   - Token usage
   - User preference
3. Start with Buffer, switch to Window when too long, switch to Summary if even longer
4. Track metrics:
   - Messages stored
   - Tokens used
   - Memory type in use
5. Display memory optimization decisions

**Algorithm**:
```typescript
if (messageCount < 10) {
  use BufferMemory
} else if (messageCount < 30) {
  use BufferWindowMemory
} else {
  use ConversationSummaryMemory
}
```

**Success Criteria**:
- Automatically optimizes memory type
- Displays current memory stats
- Smooth transitions between types
- Explains optimization decisions

---

## Bonus Challenge: Persistent Memory with Database 💾

**Goal**: Save conversation history to disk/database.

**Tasks**:
1. Create `persistent-memory.ts`
2. Implement file-based persistence:
   ```typescript
   // Save to JSON file
   async function saveMemory(userId: string, messages: Message[]) {
     await writeFile(`./memory/${userId}.json`, JSON.stringify(messages));
   }

   // Load from file
   async function loadMemory(userId: string) {
     const data = await readFile(`./memory/${userId}.json`);
     return JSON.parse(data);
   }
   ```
3. Features:
   - Auto-save after each exchange
   - Load previous conversations on startup
   - Clear/export conversation history
4. (Optional) Use SQLite or other DB

**Success Criteria**:
- Saves conversations to disk
- Loads previous conversations
- Survives app restarts
- Export functionality works

---

## Submission Checklist

Before moving to Chapter 9:

- [ ] Challenge 1: Memory comparison complete
- [ ] Challenge 2: Personal assistant with memory
- [ ] Challenge 3: Multi-user system works
- [ ] Challenge 4: Smart memory optimizer
- [ ] Bonus: Persistent memory (optional)

---

## Solutions

Solutions available in [`solution/`](./solution/) folder. Try on your own first!

---

## Need Help?

- **Buffer memory**: Review example 1
- **Window memory**: Check example 2
- **Summary memory**: See example 3
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## Next Steps

Ready for [Chapter 9: Production Best Practices](../09-production-best-practices/README.md)!

Excellent work on conversation memory! 🎉
