# Chapter 9: LangGraph Patterns

## ⏱️ Lesson Overview

- **Estimated Time**: 90 minutes
- **Prerequisites**: Completed [Chapter 8](../08-langgraph-memory-conversations/README.md)
- **Difficulty**: Beginner-Intermediate

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Learn LangGraph workflow patterns
- Build state-based AI workflows
- Create conditional logic in agent flows
- Implement human-in-the-loop patterns
- Build multi-step agent systems with custom routing

**Note**: You've already used LangGraph in Chapters 7 and 8 for agents and memory. This chapter explores more graph patterns for multi-step workflows.

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

**LangGraph**: Workflows with:
- Branches (if/else)
- Loops (repeat until done)
- Human input (wait for approval)
- State management (remember progress)

---

## 🎯 LangGraph: Beyond Simple Workflows

You've already seen LangGraph's power in Chapters 7 & 8:
- Chapter 7: ReAct agents with tools
- Chapter 8: Conversation memory with MemorySaver

Now we'll explore **graph patterns** for multi-step workflows.

### Patterns Covered

**Chapter 9 Focus**:
- Conditional branching and routing
- Custom state management
- Human-in-the-loop workflows
- Multi-path execution graphs
- Decision trees

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

LangGraph's `interrupt()` function allows you to pause workflow execution and wait for human input. This is essential for:
- Approval workflows (deployments, data deletion)
- Review processes (content moderation)
- Quality control (reviewing AI outputs)
- Multi-stage workflows requiring human judgment

### Example 3: Approval Workflow with interrupt()

**Code**: [`code/03-human-in-loop.ts`](./code/03-human-in-loop.ts)

```typescript
import { StateGraph, START, END, interrupt, Command, MemorySaver } from "@langchain/langgraph";

// Node that requests human approval
workflow.addNode("requestApproval", async (state) => {
  console.log("Request:", state.request);

  // Pause execution and wait for human decision
  const decision = interrupt({
    question: "Do you approve this request?",
    details: state.request,
    options: ["approve", "reject"],
  });

  return { approved: decision === "approve" };
});

// Compile with checkpointer (required for interrupts)
const checkpointer = new MemorySaver();
const app = workflow.compile({ checkpointer });

// Run the workflow
const config = { configurable: { thread_id: "request-1" } };
let result = await app.invoke({ request: "Deploy to production" }, config);

// Check if interrupted
if (result.__interrupt__) {
  console.log("Workflow paused for approval");

  // In production: show this to user in UI, wait for response
  const humanDecision = "approve"; // From user input

  // Resume workflow with human's decision
  result = await app.invoke(new Command({ resume: humanDecision }), config);
}
```

**Key Features**:
- ✅ **`interrupt()`** - Pauses execution at any point
- ✅ **Checkpointer required** - Persists state during pause
- ✅ **Resume with `Command`** - Continue from where it stopped
- ✅ **Async human input** - Can wait hours/days for approval
- ✅ **Production-ready** - Built for real-world approval flows

**How it works**:
1. Workflow runs until it hits `interrupt()`
2. Execution pauses, state is saved via checkpointer
3. System returns interrupt details to your application
4. Show interrupt to human (UI, notification, etc.)
5. When human responds, resume with `Command({ resume: value })`
6. Workflow continues from exact same point

📚 **Learn more**: [Human-in-the-Loop Documentation](https://docs.langchain.com/oss/javascript/langgraph/add-human-in-the-loop)

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

## ⚡ Streaming Graph Outputs

LangGraph supports multiple streaming modes for real-time feedback during workflow execution:

### Streaming Modes

```typescript
// Stream state updates after each node
for await (const chunk of await graph.stream(inputs, {
  streamMode: "updates"
})) {
  console.log("Node update:", chunk);
}

// Stream full state after each step
for await (const chunk of await graph.stream(inputs, {
  streamMode: "values"
})) {
  console.log("Current state:", chunk);
}

// Stream LLM tokens in real-time
for await (const chunk of await graph.stream(inputs, {
  streamMode: "messages"
})) {
  console.log("Token:", chunk);
}
```

**Available Modes**:
- **`values`**: Full graph state after each step
- **`updates`**: State changes after each node (most common)
- **`messages`**: LLM tokens with metadata
- **`custom`**: User-defined streaming data
- **`debug`**: Detailed execution information

**When to use streaming**:
- ✅ Long-running workflows (show progress)
- ✅ LLM token streaming (better UX)
- ✅ Multi-step agents (visibility into reasoning)
- ✅ Debugging (see graph execution flow)

📚 **Learn more**: [LangGraph Streaming Documentation](https://docs.langchain.com/oss/javascript/langgraph/streaming)

---

## 🕰️ Time Travel for Debugging

LangGraph's checkpointing enables "time travel" - viewing and modifying past states:

```typescript
// Get execution history
const states = [];
for await (const state of graph.getStateHistory(config)) {
  states.push(state);
}

// Rewind to a previous checkpoint
const pastState = states[2];
const newConfig = await graph.updateState(pastState.config, {
  // Modify state to try different path
  topic: "alternative topic"
});

// Resume from that point
await graph.invoke(null, newConfig);
```

**Use cases**:
- 🐛 Debugging failed workflows
- 🔄 Testing alternative decisions
- 📊 Understanding agent reasoning
- 🔍 Auditing execution paths

📚 **Learn more**: [Time Travel Documentation](https://docs.langchain.com/oss/javascript/langgraph/use-time-travel)

---

## 🎓 Key Takeaways

- ✅ **LangGraph enables multi-step workflows**: Beyond linear chains
- ✅ **State management**: Data flows through the graph
- ✅ **Conditional routing**: Branch based on logic
- ✅ **Human-in-the-loop**: Use `interrupt()` to pause for approvals
- ✅ **Streaming modes**: Real-time feedback (values, updates, messages)
- ✅ **Time travel**: Debug by viewing/modifying past states
- ✅ **Production-ready**: Checkpointing, persistence, error handling
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

- [LangGraph JavaScript Overview](https://docs.langchain.com/oss/javascript/langgraph/overview)
- [Persistence Guide](https://docs.langchain.com/oss/javascript/langgraph/persistence)
- [Human-in-the-Loop](https://docs.langchain.com/oss/javascript/langgraph/add-human-in-the-loop)
- [Streaming Documentation](https://docs.langchain.com/oss/javascript/langgraph/streaming)
- [Time Travel](https://docs.langchain.com/oss/javascript/langgraph/use-time-travel)
- [Memory Management](https://docs.langchain.com/oss/javascript/langgraph/add-memory)

---

## 🗺️ Navigation

- **Previous**: [08-langgraph-memory-conversations](../08-langgraph-memory-conversations/README.md)
- **Next**: [10-production-best-practices](../10-production-best-practices/README.md)
- **Home**: [Course Home](../README.md)

---

💬 **Questions or stuck?** Join our [Discord community](https://aka.ms/foundry/discord)!
