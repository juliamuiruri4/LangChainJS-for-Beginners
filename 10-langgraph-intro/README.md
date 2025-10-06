# Chapter 10: Introduction to LangGraph

## ⏱️ Lesson Overview

- **Estimated Time**: 90 minutes
- **Prerequisites**: Completed [Chapter 9](../09-production-best-practices/README.md)
- **Difficulty**: Beginner-Intermediate

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Understand what LangGraph is and when to use it
- Build state-based AI workflows
- Create conditional logic in agent flows
- Implement human-in-the-loop patterns
- Build multi-step agent systems

---

## 📖 The Business Process Analogy

**Imagine a customer support workflow:**

```
New Support Ticket Arrives
    ↓
Is it a simple question? → Yes → Auto-respond
    ↓ No
Is it technical? → Yes → Route to Engineering
    ↓ No
Route to Customer Service
    ↓
Needs approval? → Yes → Wait for Manager
    ↓ No
Send Response
    ↓
Close Ticket
```

**Regular LangChain**: Linear chains (A → B → C)

**LangGraph**: Complex workflows with:
- Branches (if/else)
- Loops (repeat until done)
- Human input (wait for approval)
- State management (remember progress)

---

## 🎯 What is LangGraph?

LangGraph extends LangChain with **graph-based workflows**.

### When to Use LangGraph

**Use Regular Chains When**:
- Simple, linear flow
- No branching logic
- Single-path execution

**Use LangGraph When**:
- Need conditional logic
- Multi-step decision making
- Human-in-the-loop
- Complex agent workflows
- Cyclical processes

---

## 🏗️ Core Concepts

### 1. State

The data that flows through your graph:

```typescript
interface State {
  messages: Message[];
  nextStep: string;
  userInput?: string;
}
```

### 2. Nodes

Functions that process state:

```typescript
function analyzeQuestion(state: State): State {
  // Process state
  return updatedState;
}
```

### 3. Edges

Connections between nodes:
- **Normal edges**: A always goes to B
- **Conditional edges**: Route based on state

### 4. Graph

The workflow combining nodes and edges.

---

## 💻 Building Your First Graph

### Example 1: Simple Linear Graph

**Code**: [`code/01-simple-graph.ts`](./code/01-simple-graph.ts)

```typescript
import { StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

// Define state
interface State {
  input: string;
  output: string;
}

// Create nodes
async function processInput(state: State): Promise<State> {
  return { ...state, output: `Processed: ${state.input}` };
}

// Build graph
const workflow = new StateGraph<State>({
  channels: {
    input: null,
    output: null,
  },
});

workflow.addNode("process", processInput);
workflow.addEdge("__start__", "process");
workflow.addEdge("process", END);

const app = workflow.compile();

// Run the graph
const result = await app.invoke({ input: "Hello LangGraph!" });
console.log(result.output);
```

---

## 🔀 Conditional Logic

### Example 2: Conditional Routing

**Code**: [`code/02-conditional-graph.ts`](./code/02-conditional-graph.ts)

```typescript
import { StateGraph, END } from "@langchain/langgraph";

interface State {
  question: string;
  category: string;
  answer: string;
}

// Categorize question
async function categorize(state: State): Promise<State> {
  const isTechnical = state.question.toLowerCase().includes("technical");
  return {
    ...state,
    category: isTechnical ? "technical" : "general",
  };
}

// Handle technical questions
async function handleTechnical(state: State): Promise<State> {
  return { ...state, answer: "Routing to engineering team..." };
}

// Handle general questions
async function handleGeneral(state: State): Promise<State> {
  return { ...state, answer: "Here's a quick answer..." };
}

// Routing function
function route(state: State): string {
  return state.category === "technical" ? "technical" : "general";
}

// Build graph
const workflow = new StateGraph<State>({
  channels: {
    question: null,
    category: null,
    answer: null,
  },
});

workflow.addNode("categorize", categorize);
workflow.addNode("technical", handleTechnical);
workflow.addNode("general", handleGeneral);

workflow.addEdge("__start__", "categorize");
workflow.addConditionalEdges("categorize", route, {
  technical: "technical",
  general: "general",
});
workflow.addEdge("technical", END);
workflow.addEdge("general", END);

const app = workflow.compile();

// Test it
const result = await app.invoke({
  question: "I have a technical issue with my API",
});
console.log(result.answer);
```

---

## 👤 Human-in-the-Loop

### Example 3: Approval Workflow

**Code**: [`code/03-human-in-loop.ts`](./code/03-human-in-loop.ts)

```typescript
import { StateGraph, END } from "@langchain/langgraph";
import readline from "readline";

interface State {
  draft: string;
  approved: boolean;
  final: string;
}

async function createDraft(state: State): Promise<State> {
  return { ...state, draft: "Draft email: Dear customer..." };
}

async function requestApproval(state: State): Promise<State> {
  // In production, this would be a UI/notification
  console.log("\nDraft:", state.draft);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("\nApprove? (yes/no): ", (answer) => {
      rl.close();
      resolve({
        ...state,
        approved: answer.toLowerCase() === "yes",
      });
    });
  });
}

async function finalize(state: State): Promise<State> {
  return { ...state, final: state.approved ? state.draft : "Rejected" };
}

function checkApproval(state: State): string {
  return state.approved ? "finalize" : "createDraft";
}

// Build graph...
// (Similar pattern to above)
```

---

## 🤖 Agent with LangGraph

### Example 4: ReAct Agent Flow

**Code**: [`code/04-react-agent-graph.ts`](./code/04-react-agent-graph.ts)

```typescript
import { StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

interface AgentState {
  input: string;
  thought: string;
  action: string;
  actionInput: string;
  observation: string;
  answer: string;
  iterations: number;
}

async function think(state: AgentState): Promise<AgentState> {
  // Agent decides what to do next
  return { ...state, thought: "I should use a tool..." };
}

async function act(state: AgentState): Promise<AgentState> {
  // Execute the action
  return { ...state, observation: "Tool result..." };
}

async function shouldContinue(state: AgentState): string {
  if (state.iterations > 5 || state.answer) {
    return "end";
  }
  return "continue";
}

// Build ReAct loop
const workflow = new StateGraph<AgentState>({
  channels: {
    input: null,
    thought: null,
    action: null,
    actionInput: null,
    observation: null,
    answer: null,
    iterations: null,
  },
});

workflow.addNode("think", think);
workflow.addNode("act", act);

workflow.addEdge("__start__", "think");
workflow.addEdge("think", "act");
workflow.addConditionalEdges("act", shouldContinue, {
  continue: "think",
  end: END,
});

const app = workflow.compile();
```

---

## 🎓 Key Takeaways

- ✅ **LangGraph enables complex workflows**: Beyond linear chains
- ✅ **State management**: Data flows through the graph
- ✅ **Conditional routing**: Branch based on logic
- ✅ **Human-in-the-loop**: Wait for human input
- ✅ **Agent systems**: Build multi-step reasoning
- ✅ **Cyclical flows**: Loop until conditions met

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Decision Tree** - Build a customer support router
2. **Approval System** - Create multi-step approval workflow
3. **Research Agent** - Build iterative research agent
4. **Game Flow** - Create a choose-your-own-adventure game

---

## 📚 Additional Resources

- [LangGraph Documentation](https://langchain-ai.github.io/langgraphjs/)
- [LangGraph Examples](https://github.com/langchain-ai/langgraphjs/tree/main/examples)
- [State Management Guide](https://langchain-ai.github.io/langgraphjs/concepts/low_level/)

---

## 🗺️ Navigation

- **Previous**: [09-production-best-practices](../09-production-best-practices/README.md)
- **Home**: [Course Home](../README.md)

---

## 🎉 Congratulations!

You've completed the LangChain.js for Beginners course! You now have the skills to:
- Build AI applications with LangChain.js
- Work with documents and embeddings
- Create RAG systems
- Build agents with tools
- Manage conversation memory
- Deploy to production
- Create complex workflows with LangGraph

**What's next?**
- Build your own AI project
- Join our [Discord community](https://aka.ms/foundry/discord)
- Explore [advanced LangChain patterns](https://js.langchain.com/docs/use_cases/)
- Share what you've built!

💬 **Questions or stuck?** Join our [Discord community](https://aka.ms/foundry/discord)!
