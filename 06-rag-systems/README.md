# Chapter 6: Building RAG Systems

In this chapter, you'll learn to build RAG (Retrieval Augmented Generation) systems that combine document retrieval with AI generation to answer questions accurately using your own data. You'll master the RAG architecture, use LCEL (LangChain Expression Language) to create elegant chains, and explore different retrieval strategies like MMR and similarity thresholds. RAG systems are essential for building AI assistants that provide accurate, sourced answers from custom knowledge bases.

## Prerequisites

- Completed [Chapter 4](../04-documents-embeddings-semantic-search/README.md)

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:

- ✅ Understand the RAG (Retrieval Augmented Generation) architecture
- ✅ Build a question-answering system over custom documents
- ✅ Use LCEL (LangChain Expression Language) to create chains
- ✅ Master advanced LCEL patterns (parallel, fallback, branching)
- ✅ Implement different retrieval strategies
- ✅ Handle context and citations properly

---

## 📖 The Open-Book Exam Analogy

**Imagine two types of exams:**

**Closed-Book Exam (Standard LLM)**:
- ❌ Student relies only on memorized knowledge
- ❌ Can't look up specific facts
- ❌ May give wrong answers confidently
- ❌ Knowledge cutoff (stops learning at training time)

**Open-Book Exam (RAG System)**:

- Student can reference textbook during exam
- Looks up exact information as needed
- Combines knowledge with current resources
- More accurate, can cite sources

**RAG = Retrieval Augmented Generation**

Instead of relying solely on the LLM's training, RAG:
1. **Retrieves** relevant documents from your database
2. **Augments** the prompt with that context
3. **Generates** an answer based on both

---

## 🏗️ RAG Architecture

```
User Question
    ↓
Convert to Embedding
    ↓
Search Vector Store (find relevant docs)
    ↓
Retrieved Documents + Question → LLM
    ↓
Answer with Citations
```

### Why RAG?

- **Up-to-date information**: Add new docs without retraining
- **Source attribution**: Know where answers come from
- **Domain-specific**: Works with your proprietary data
- **Cost-effective**: No model fine-tuning needed
- **Accurate**: Reduces hallucinations

---

## 💻 Building Your First RAG System

### Example 1: Simple RAG

In this example, you'll build a complete RAG system that retrieves relevant documents from a vector store and uses them to answer questions accurately.

**Code**: [`code/01-simple-rag.ts`](./code/01-simple-rag.ts)
**Run**: `tsx 06-rag-systems/code/01-simple-rag.ts`

```typescript
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import "dotenv/config";

// Setup
const model = new ChatOpenAI({
  model: process.env.AI_MODEL || "gpt-4o-mini",
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY,
});

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY,
});

// Create knowledge base
const docs = [
  new Document({
    pageContent: "LangChain.js was released in 2022 and is a JavaScript port of the Python LangChain library.",
  }),
  new Document({
    pageContent: "RAG systems combine retrieval with generation to provide accurate, sourced answers.",
  }),
];

// Create vector store
const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

// Create retriever
const retriever = vectorStore.asRetriever({ k: 2 });

// Create prompt
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "Answer based on the following context:\n\n{context}"],
  ["human", "{input}"],
]);

// Create RAG chain
const combineDocsChain = await createStuffDocumentsChain({ llm: model, prompt });
const ragChain = await createRetrievalChain({ retriever, combineDocsChain });

// Ask questions
const response = await ragChain.invoke({
  input: "When was LangChain.js released?",
});

console.log("Answer:", response.answer);
console.log("Source docs:", response.context.length);
```

### Expected Output

When you run this example with `tsx 06-rag-systems/code/01-simple-rag.ts`, you'll see:

```
Answer: LangChain.js was released in 2022.
Source docs: 2
```

### How It Works

**The RAG Flow**:
1. **Create knowledge base**: Two documents about LangChain.js and RAG
2. **Embed documents**: Convert documents to vectors and store in MemoryVectorStore
3. **User asks question**: "When was LangChain.js released?"
4. **Retrieve**: Retriever finds the 2 most relevant documents
5. **Generate**: LLM receives context + question and generates answer
6. **Result**: Accurate answer based on the retrieved documents

**Key components**:
- `createRetrievalChain`: Combines retrieval + generation
- `createStuffDocumentsChain`: "Stuffs" retrieved docs into the prompt
- `response.answer`: The AI's answer
- `response.context`: The retrieved documents used

**Why it works**: The LLM has access to specific information (2022 release date) that it wouldn't know from training alone!

---

## 🔗 LCEL (LangChain Expression Language)

LCEL lets you chain operations using the pipe operator.

### Example 2: RAG with LCEL

Here you'll use LCEL (LangChain Expression Language) to build elegant RAG chains with the pipe operator for cleaner, more maintainable code.

**Code**: [`code/02-rag-lcel.ts`](./code/02-rag-lcel.ts)
**Run**: `tsx 06-rag-systems/code/02-rag-lcel.ts`

```typescript
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

// Format retrieved documents
function formatDocs(docs) {
  return docs.map((doc) => doc.pageContent).join("\n\n");
}

// Build chain with LCEL
const ragChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocs),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

// Use the chain
const answer = await ragChain.invoke("What is RAG?");
console.log(answer);
```

### Expected Output

When you run this example with `tsx 06-rag-systems/code/02-rag-lcel.ts`, you'll see:

```
RAG (Retrieval Augmented Generation) systems combine document retrieval with AI generation to provide accurate, sourced answers based on your custom knowledge base.
```

### How It Works

**LCEL Pipeline**:
1. **Input**: Question flows into the chain
2. **Parallel operations**:
   - `context`: Retrieve docs → format them
   - `question`: Pass through unchanged
3. **Prompt**: Combine context + question
4. **Model**: Generate answer
5. **Parser**: Extract string output

**Benefits of LCEL**:
- Clean, readable syntax with `.pipe()`
- Easy to modify and test individual components
- Supports streaming out of the box
- Built-in error handling
- Type-safe composition

---

## ⚡ Advanced LCEL Patterns

LCEL is more powerful than simple piping. Let's explore advanced patterns that make your chains more robust and flexible.

### The Assembly Line Analogy

**Think of LCEL like a factory assembly line:**

**Simple Line** (what we've seen):
```
Raw Material → Process → Package → Ship
```

**Advanced Line** (what we'll learn):
```
Raw Material → [Process A OR Process B] → Package → Ship
                ↓ (if Process A fails)
              Fallback Process
```

Or run multiple processes in parallel:
```
Raw Material → [Process 1 | Process 2 | Process 3] → Combine → Ship
             (all running at same time)
```

### 1. Parallel Execution

Run multiple operations at once for better performance:

### Example 4: Parallel RAG Queries

In this example, you'll run multiple operations in parallel (document retrieval, summarization) for better performance and richer context.

**Code**: [`code/04-parallel-lcel.ts`](./code/04-parallel-lcel.ts)
**Run**: `tsx 06-rag-systems/code/04-parallel-lcel.ts`

```typescript
import { RunnableParallel, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Run multiple retrievers in parallel
const parallelChain = RunnableParallel.from({
  // Get relevant documents
  docs: retriever.pipe(formatDocs),

  // Get summary of documents
  summary: retriever.pipe(async (docs) => {
    const content = docs.map(d => d.pageContent).join(" ");
    return `Summary: ${content.slice(0, 100)}...`;
  }),

  // Pass through the original question
  question: new RunnablePassthrough(),
});

// Then send all to LLM
const fullChain = parallelChain.pipe(prompt).pipe(model).pipe(new StringOutputParser());

// All three operations run at the same time!
const result = await fullChain.invoke("What is RAG?");
```

### Expected Output

When you run this example with `tsx 06-rag-systems/code/04-parallel-lcel.ts`, you'll see the AI's comprehensive answer that incorporates information from all three parallel operations.

### How It Works

**Parallel Execution Flow**:
1. **Three operations execute simultaneously** (not sequentially):
   - Operation 1: Retrieve and format full documents
   - Operation 2: Generate a summary of those documents (first 100 chars)
   - Operation 3: Pass through the original question
2. **All results combine** into a single object: `{ docs, summary, question }`
3. **Send to prompt** which receives all three pieces of context
4. **LLM generates answer** using comprehensive information from multiple sources

**Why Parallel?**
- ⚡ **Faster**: Multiple operations run simultaneously (vs sequentially)
- 🔄 **Efficient**: Better resource utilization and lower latency
- 📊 **Rich Context**: Combine multiple data sources for more informed answers

**Performance gain**: If each operation takes 100ms, sequential would take 300ms total. Parallel takes ~100ms (the longest operation).

### 2. Fallback Chains

Handle failures gracefully by trying alternative approaches:

### Example 5: RAG with Fallback

Here you'll implement fallback chains that gracefully handle failures by trying alternative approaches when the primary chain fails.

**Code**: [`code/05-fallback-lcel.ts`](./code/05-fallback-lcel.ts)
**Run**: `tsx 06-rag-systems/code/05-fallback-lcel.ts`

```typescript
import { RunnableWithFallbacks } from "@langchain/core/runnables";

// Primary chain: Try to answer from documents
const primaryChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocs),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

// Fallback chain: If no docs found, use general knowledge
const fallbackPrompt = ChatPromptTemplate.fromMessages([
  ["system", "Answer this question using your general knowledge:"],
  ["human", "{question}"],
]);

const fallbackChain = RunnableSequence.from([
  fallbackPrompt,
  model,
  new StringOutputParser(),
]);

// Combine with fallback
const robustChain = primaryChain.withFallbacks({
  fallbacks: [fallbackChain],
});

// If retriever fails or finds nothing, automatically uses fallback
const answer = await robustChain.invoke("What is quantum computing?");
```

### Expected Output

When you run this example with `tsx 06-rag-systems/code/05-fallback-lcel.ts`, you'll see:

```
Quantum computing is a type of computing that uses quantum-mechanical phenomena, such as superposition and entanglement, to perform operations on data. Unlike classical computers that use bits (0 or 1), quantum computers use quantum bits or qubits, which can represent both 0 and 1 simultaneously...
```

Notice: Since "quantum computing" isn't in the knowledge base, the system automatically falls back to the LLM's general knowledge.

### How It Works

**Fallback Flow**:
1. **Try primary chain**: Attempt to retrieve documents about "quantum computing"
2. **No relevant docs found**: Vector store has no information about quantum computing
3. **Primary chain fails**: Can't answer from custom knowledge base
4. **Automatically switch to fallback**: Use the fallback chain with general knowledge
5. **LLM answers**: Uses its training data instead of custom documents

**Key insight**: The user gets an answer either way - from your documents if available, or from general knowledge if not.

**Use Cases**:
- 🛡️ **Error recovery**: Try different models if one fails
- 🎯 **Quality control**: Fall back to simpler approach if needed
- 💰 **Cost optimization**: Try cheaper model first, upgrade if needed
- 📚 **Coverage**: Provide answers even when documents don't cover the topic

### 3. Conditional Branching

Route inputs to different chains based on conditions:

### Example 6: Smart RAG Router

In this example, you'll use conditional branching to route simple vs complex questions to different chains with appropriate processing depth.

**Code**: [`code/06-branch-lcel.ts`](./code/06-branch-lcel.ts)
**Run**: `tsx 06-rag-systems/code/06-branch-lcel.ts`

```typescript
import { RunnableBranch } from "@langchain/core/runnables";

// Simple questions → fast path
const simpleChain = RunnableSequence.from([
  prompt,
  model.bind({ max_tokens: 100 }), // Shorter response
  new StringOutputParser(),
]);

// Complex questions → thorough path
const complexChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocs),
    question: new RunnablePassthrough(),
  },
  prompt,
  model.bind({ max_tokens: 500 }), // Longer response
  new StringOutputParser(),
]);

// Branch based on question complexity
const branchingChain = RunnableBranch.from([
  [
    // Condition: is question simple?
    (input) => input.length < 50,
    simpleChain,
  ],
  // Default: use complex chain
  complexChain,
]);

// Automatically picks the right path
const simple = await branchingChain.invoke("What is RAG?");
const complex = await branchingChain.invoke(
  "Can you explain the differences between RAG, fine-tuning, and prompt engineering, including when to use each?"
);
```

### Expected Output

When you run this example with `tsx 06-rag-systems/code/06-branch-lcel.ts`, you'll see:

**Simple question** ("What is RAG?" - 12 characters):
```
RAG is Retrieval Augmented Generation - it combines document retrieval with AI to answer questions.
```
(Short response, no document retrieval)

**Complex question** (87 characters):
```
Here's a comprehensive comparison:

RAG (Retrieval Augmented Generation):
- Best for: Providing accurate answers from custom knowledge bases
- When to use: You have specific documents/data and need sourced answers
[...detailed explanation with context from retrieved documents...]

Fine-tuning:
- Best for: Teaching the model new patterns or domain-specific knowledge
[...continues with detailed comparison...]
```
(Long response with full document retrieval and context)

### How It Works

**Branching Logic**:
1. **Check condition**: Is the question length < 50 characters?
2. **Route to appropriate chain**:
   - **Simple (< 50 chars)**: Use fast path without retrieval, max 100 tokens
   - **Complex (≥ 50 chars)**: Use thorough path with retrieval, max 500 tokens
3. **Process accordingly**: Different processing depth based on question complexity

**Why branch?**
- ⚡ **Performance**: Don't waste time retrieving docs for simple questions
- 💰 **Cost**: Shorter responses for simple queries = lower costs
- 🎯 **Quality**: Complex questions get more thorough treatment
- 🧠 **Intelligence**: System adapts to the user's needs

**Real-world use**: Build intelligent routing for customer support (quick FAQs vs detailed troubleshooting).

### 4. Streaming with LCEL

Get responses as they're generated:

```typescript
// Any LCEL chain can stream!
const streamingChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocs),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

// Stream the response
const stream = await streamingChain.stream("Explain RAG systems");

for await (const chunk of stream) {
  process.stdout.write(chunk);
}
```

### 5. Custom Functions with RunnableLambda

Add custom logic anywhere in your chain:

```typescript
import { RunnableLambda } from "@langchain/core/runnables";

// Custom function to clean and format documents
const cleanDocs = new RunnableLambda({
  func: async (docs) => {
    return docs
      .map(d => d.pageContent)
      .map(content => content.trim())
      .filter(content => content.length > 20)
      .join("\n\n=====\n\n");
  },
});

const chain = RunnableSequence.from([
  retriever,
  cleanDocs,  // Custom processing
  prompt,
  model,
  new StringOutputParser(),
]);
```

### LCEL Power Patterns Summary

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Parallel** | Speed + efficiency | Multiple retrievers, multi-source data |
| **Fallback** | Error handling | Backup models, alternative approaches |
| **Branch** | Conditional logic | Route by complexity, language, type |
| **Streaming** | Real-time UX | Chatbots, live responses |
| **Lambda** | Custom logic | Data transformation, filtering |

---

## 🎯 Retrieval Strategies

### 1. Similarity Search (Default)

```typescript
const retriever = vectorStore.asRetriever({ k: 4 });
```

### 2. MMR (Maximum Marginal Relevance)

Balances relevance with diversity:

```typescript
const retriever = vectorStore.asRetriever({
  searchType: "mmr",
  searchKwargs: { fetchK: 20, lambda: 0.5 },
});
```

### 3. Similarity with Score Threshold

Only return docs above a similarity score:

```typescript
const retriever = vectorStore.asRetriever({
  searchType: "similarity_score_threshold",
  searchKwargs: { scoreThreshold: 0.8 },
});
```

---

## 📚 Advanced RAG Patterns

### Multi-Query RAG

Generate multiple search queries for better retrieval:

```typescript
// User asks: "How do I deploy my app?"
// System generates:
// - "deployment strategies"
// - "production hosting options"
// - "app deployment tutorial"
// Then retrieves docs for all queries
```

### Contextual Compression

Compress retrieved documents to include only relevant parts:

```typescript
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";

const compressor = /* your compressor */;
const retriever = new ContextualCompressionRetriever({
  baseRetriever: vectorStore.asRetriever(),
  baseCompressor: compressor,
});
```

---

## 🎓 Key Takeaways

- ✅ **RAG = Retrieval + Generation**: Find relevant docs, then generate answers
- ✅ **LCEL makes chains elegant**: Use pipes to connect components
- ✅ **Advanced LCEL patterns**: Parallel execution, fallbacks, conditional branching
- ✅ **Streaming for real-time UX**: Get responses as they're generated
- ✅ **Custom logic with RunnableLambda**: Add your own processing anywhere
- ✅ **Multiple retrieval strategies**: Similarity, MMR, score threshold
- ✅ **Source attribution**: Know where answers come from
- ✅ **No fine-tuning needed**: Works with any documents

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Personal Knowledge Base Q&A** - Build a RAG system over your own documents
2. **Conversational RAG** (Bonus) - Build a RAG system that maintains conversation history

---

## 📚 Additional Resources

- [RAG Documentation](https://js.langchain.com/docs/tutorials/rag)
- [LCEL Guide](https://js.langchain.com/docs/expression_language/)
- [Retrieval Strategies](https://js.langchain.com/docs/modules/data_connection/retrievers/)

---

## 🗺️ Navigation

- **Previous**: [05-function-calling-tooling](../05-function-calling-tooling/README.md)
- **Next**: [07-agents-mcp](../07-agents-mcp/README.md)
- **Home**: [Course Home](../README.md)

---

## 💬 Questions or stuck?

If you get stuck or have any questions about building AI apps, join:

[![Azure AI Foundry Discord](https://img.shields.io/badge/Discord-Azure_AI_Foundry_Community_Discord-blue?style=for-the-badge&logo=discord&color=5865f2&logoColor=fff)](https://aka.ms/foundry/discord)

If you have product feedback or errors while building visit:

[![Azure AI Foundry Developer Forum](https://img.shields.io/badge/GitHub-Azure_AI_Foundry_Developer_Forum-blue?style=for-the-badge&logo=github&color=000000&logoColor=fff)](https://aka.ms/foundry/forum)
