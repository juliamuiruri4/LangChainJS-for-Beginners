# Chapter 10 Assignment: Introduction to LangGraph

## Overview

Practice building stateful AI workflows with LangGraph for complex multi-step agent systems.

## Prerequisites

- Completed [Chapter 10](./README.md)
- Run all code examples
- Understand state graphs and conditional logic

---

## Challenge 1: Customer Support Router 🎯

**Goal**: Build a support ticket routing system using LangGraph.

**Tasks**:
1. Create `support-router.ts` in the `10-langgraph-intro/code/` folder
2. Implement workflow:
   ```
   New Ticket
      ↓
   Classify Category (Technical/Billing/General)
      ↓
   [Branch based on category]
      ↓
   Technical → Engineering Team
   Billing → Finance Team
   General → Customer Service
      ↓
   Assign Priority (High/Medium/Low)
      ↓
   Generate Response
   ```
3. State should track:
   - Ticket content
   - Category
   - Assigned team
   - Priority
   - Response
4. Test with various ticket types

**Example Tickets**:
- "My API key is not working" (Technical, High)
- "Question about my invoice" (Billing, Medium)
- "How do I reset my password?" (General, Low)

**Success Criteria**:
- Correctly routes all ticket types
- Assigns appropriate priority
- Generates team-specific responses
- State properly tracked

---

## Challenge 2: Content Approval Workflow ✅

**Goal**: Create a multi-step approval system for content publishing.

**Tasks**:
1. Create `content-approval.ts`
2. Workflow stages:
   ```
   Draft Content
      ↓
   Auto-Check (grammar, length, keywords)
      ↓
   [If issues found] → Suggest Edits → Back to Draft
   [If clean] → Request Human Approval
      ↓
   [If approved] → Publish
   [If rejected] → Request Revisions → Back to Draft
   ```
3. Implement checks:
   - Min/max length validation
   - Required keywords check
   - Grammar check (simple or use LLM)
4. Track revision history
5. Human approval step

**State Fields**:
- content
- issues[]
- approved
- revisionCount
- status

**Success Criteria**:
- Auto-checks work correctly
- Loops back for revisions
- Human approval required
- Publishes only when approved
- Tracks all revisions

---

## Challenge 3: Research Agent Workflow 🔬

**Goal**: Build an iterative research agent using LangGraph.

**Tasks**:
1. Create `research-agent.ts`
2. Implement ReAct-style loop:
   ```
   Question
      ↓
   Analyze Question
      ↓
   [Needs Research?]
      ↓
   Yes → Search → Analyze Results → [Sufficient?]
                                      ↓
                                   No → Search Again (max 3 times)
                                   Yes → Generate Answer
      ↓
   No → Generate Answer (from existing knowledge)
   ```
3. Features:
   - Iterative research (up to 3 searches)
   - Combine results from multiple searches
   - Final synthesis
4. Simulate search tool (can use pre-defined knowledge base)

**State Tracking**:
- question
- searchCount
- searchResults[]
- needsMoreInfo
- finalAnswer

**Success Criteria**:
- Decides when to research
- Iterates up to max limit
- Combines multiple sources
- Generates comprehensive answer

---

## Challenge 4: Game Flow with LangGraph 🎮

**Goal**: Create a choose-your-own-adventure game using conditional edges.

**Tasks**:
1. Create `adventure-game.ts`
2. Build branching story:
   ```
   Start
      ↓
   Scene 1: Forest Path
      [Go Left] → Scene 2a: Cave
      [Go Right] → Scene 2b: River
      ↓
   Cave Path:
      [Enter] → Scene 3a: Treasure or Trap?
      [Leave] → Back to Forest

   River Path:
      [Cross] → Scene 3b: Village
      [Follow] → Scene 3c: Waterfall
      ↓
   Multiple endings
   ```
3. Features:
   - User choices at each node
   - State tracks: location, inventory, choices made
   - Different endings based on choices
   - Save/load game state
4. At least 5 scenes, 3 endings

**State**:
- currentScene
- inventory[]
- choiceHistory[]
- gameStatus

**Success Criteria**:
- Multiple branching paths
- User choices determine flow
- Different endings reachable
- Game state properly tracked

---

## Bonus Challenge: Multi-Agent Collaboration Graph 🤝

**Goal**: Build a system where multiple agents collaborate via LangGraph.

**Tasks**:
1. Create `multi-agent-collab.ts`
2. Agents:
   - **Planner**: Creates plan
   - **Researcher**: Gathers information
   - **Analyst**: Analyzes data
   - **Writer**: Creates final output
3. Workflow:
   ```
   Task Input
      ↓
   Planner → Creates subtasks
      ↓
   [For each subtask]
      ↓
   Researcher → Gathers info
      ↓
   Analyst → Analyzes
      ↓
   Writer → Compiles results
      ↓
   Final Output
   ```
4. Agents can communicate via shared state
5. Supports parallel execution where possible

**Advanced Features**:
- Agent coordination
- Parallel task execution
- Result aggregation
- Error handling per agent

**Success Criteria**:
- All agents work correctly
- Proper coordination
- Parallel execution where possible
- Clean final output

---

## Submission Checklist

Course complete! Final checklist:

- [ ] Challenge 1: Support router with branching
- [ ] Challenge 2: Content approval workflow
- [ ] Challenge 3: Iterative research agent
- [ ] Challenge 4: Choose-your-own-adventure game
- [ ] Bonus: Multi-agent collaboration (optional)

---

## Solutions

Solutions available in [`solution/`](./solution/) folder. Try on your own first!

---

## 🎉 Congratulations!

You've completed the **LangChain.js for Beginners** course!

### What You've Learned:
- ✅ LangChain.js fundamentals
- ✅ Chat models and streaming
- ✅ Prompt engineering with templates
- ✅ Document processing
- ✅ Embeddings and semantic search
- ✅ RAG systems
- ✅ Agents and tools
- ✅ Conversation memory
- ✅ Production best practices
- ✅ LangGraph workflows

### What's Next?
- Build your own AI application
- Contribute to open source
- Join our [Discord community](https://aka.ms/foundry/discord)
- Explore advanced LangChain patterns
- Share what you've built!

### Need Help?
- **AI Discord**: [Discord](https://aka.ms/foundry/discord)
- **GitHub Community**: [GitHub Community](https://aka.ms/foundry/forum)
- **Docs**: [LangChain.js](https://js.langchain.com/)

---

**You're now ready to build production AI applications with LangChain.js!** 🚀
