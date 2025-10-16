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

RAG solves a fundamental problem: **How do you give an LLM access to information it wasn't trained on?**

### When to Use RAG vs Fine-Tuning vs Prompt Engineering

**Quick Decision Tree**:

1. **Does it fit in a prompt?** → Prompt Engineering
2. **Adding information or changing behavior?** → RAG or Fine-Tuning
3. **Updates frequently?** → RAG
4. **Need citations?** → RAG

#### Prompt Engineering
- **Use when**: Small data (< 8K tokens), static content
- **Example**: FAQ bot with 20 questions
- **Limitations**: Can't handle large datasets or search

#### RAG (Retrieval Augmented Generation)
- **Use when**: Large knowledge base, frequent updates, need citations
- **Example**: Customer support with 10,000 product manuals
- **Benefits**: Scalable, up-to-date, cost-effective, provides source attribution
- **Limitations**: Retrieval quality matters, adds latency

#### Fine-Tuning
- **Use when**: Teaching new patterns, changing behavior/style
- **Example**: Code generation in company-specific style
- **Limitations**: Expensive, time-consuming, static knowledge

**For most use cases involving large document collections, RAG is the right choice.**

---

## 💻 Building Your First RAG System

Before we build a RAG system, let's make sure RAG is the right choice! Let's see the decision framework in action.

### Example 1: Choosing the Right Approach (RAG vs Alternatives)

This example demonstrates the decision framework we just learned—comparing Prompt Engineering, RAG, and Fine-Tuning side by side to understand when each approach makes sense.

**Code**: [`code/01-when-to-use-rag.ts`](./code/01-when-to-use-rag.ts)
**Run**: `tsx 06-rag-systems/code/01-when-to-use-rag.ts`

This demo shows three real-world scenarios:

1. **Scenario 1: Small FAQ Bot** → Uses **Prompt Engineering** (5 Q&As fit in prompt)
2. **Scenario 2: Large Documentation Bot** → Uses **RAG** (1000s of docs, needs search)
3. **Scenario 3: Code Style Enforcer** → Uses **Fine-Tuning** (teaching patterns, not facts)

### Expected Output

When you run this example with `tsx 06-rag-systems/code/01-when-to-use-rag.ts`, you'll see:

```
🎯 When to Use RAG: Decision Framework Demo
==================================================================================

📋 SCENARIO 1: Small FAQ Bot
────────────────────────────────────────────────────────────────────────────────

Problem: Answer 5 common questions about a product
Data size: 5 questions/answers (fits easily in prompt)
Update frequency: Rarely changes

✅ BEST APPROACH: Prompt Engineering

Question: "What's your return policy?"

Answer: We offer a 30-day money-back guarantee with no questions asked.

💡 Why Prompt Engineering works here:
   • Small dataset (5 Q&As) fits easily in prompt
   • No search needed - all context is relevant
   • Simple to maintain - just update the string
   • Fast and cost-effective

==================================================================================

📚 SCENARIO 2: Company Documentation Bot
────────────────────────────────────────────────────────────────────────────────

Problem: Answer questions from 1,000+ documentation pages
Data size: Too large to fit in prompt (exceeds context window)
Update frequency: Documentation changes frequently

✅ BEST APPROACH: RAG (Retrieval Augmented Generation)

Creating vector store from documents...

Question: "How does API authentication work?"

Answer: The API uses OAuth 2.0 authentication with bearer tokens. These tokens expire
after 24 hours and are subject to rate limiting of 100 requests per minute per user.

Retrieved documents:
  1. [api-auth.md] The API authentication uses OAuth 2.0 with bearer tokens...
  2. [api-limits.md] API rate limiting is 100 requests per minute per user...

💡 Why RAG works here:
   • Large dataset (1000s of docs) - can't fit in prompt
   • Search capability - finds relevant 2 docs out of thousands
   • Easy to update - just add/remove documents from vector store
   • Source attribution - know which docs were used
   • Scalable - works with millions of documents
```

### How It Works

This example demonstrates the **decision framework** from our enhanced conceptual content:

1. **Step 1: Data Size Check**
   - Scenario 1: < 8K tokens → Prompt Engineering
   - Scenario 2: > 8K tokens → RAG or Fine-Tuning

2. **Step 2: Goal Check**
   - Scenario 1 & 2: Add information → RAG or Prompt Engineering
   - Scenario 3: Change behavior → Fine-Tuning

3. **Step 3: Update Frequency**
   - Scenario 1: Rarely → Prompt Engineering works
   - Scenario 2: Frequently → Definitely RAG

4. **Step 4: Source Attribution**
   - Scenario 2: Need citations → RAG

**Key Insight**: The same code demonstrates why RAG is powerful—it scales to millions of documents while providing source attribution, something prompt engineering and fine-tuning can't do.

---

### Example 2: Simple RAG

In this example, you'll build a complete RAG system that retrieves relevant documents from a vector store and uses them to answer questions accurately.

**Code**: [`code/02-simple-rag.ts`](./code/02-simple-rag.ts)
**Run**: `tsx 06-rag-systems/code/02-simple-rag.ts`

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import "dotenv/config";

// Setup
const model = new ChatOpenAI({
  model: process.env.AI_MODEL,
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY
});

const embeddings = new OpenAIEmbeddings({
  model: process.env.AI_EMBEDDING_MODEL,
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY
});

// Create knowledge base
const docs = [
  new Document({
    pageContent: "LangChain.js was released in 2023 and is a JavaScript port of the Python LangChain library.",
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

When you run this example with `tsx 06-rag-systems/code/02-simple-rag.ts`, you'll see:

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

### Example 3: RAG with LCEL

Here you'll use LCEL (LangChain Expression Language) to build elegant RAG chains with the pipe operator for cleaner, more maintainable code.

**Code**: [`code/03-rag-lcel.ts`](./code/03-rag-lcel.ts)
**Run**: `tsx 06-rag-systems/code/03-rag-lcel.ts`

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

When you run this example with `tsx 06-rag-systems/code/03-rag-lcel.ts`, you'll see:

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

LCEL supports advanced patterns for robust, flexible chains.

### 1. Parallel Execution

Run multiple operations simultaneously for better performance.

**Code**: [`code/04-parallel-lcel.ts`](./code/04-parallel-lcel.ts)

```typescript
import { RunnableParallel, RunnablePassthrough } from "@langchain/core/runnables";

// Run multiple retrievers in parallel
const parallelChain = RunnableParallel.from({
  docs: retriever.pipe(formatDocs),
  summary: retriever.pipe(async (docs) => {
    const content = docs.map(d => d.pageContent).join(" ");
    return `Summary: ${content.slice(0, 100)}...`;
  }),
  question: new RunnablePassthrough(),
});

const fullChain = parallelChain.pipe(prompt).pipe(model).pipe(new StringOutputParser());
```

**Key benefit**: Three operations run simultaneously instead of sequentially (3x faster).

**Use when**: Fetching from multiple sources, enriching context.

### 2. Fallback Chains

Try alternative approaches when the primary chain fails.

**Code**: [`code/05-fallback-lcel.ts`](./code/05-fallback-lcel.ts)

```typescript
// Primary chain: Try to answer from documents
const primaryChain = RunnableSequence.from([
  { context: retriever.pipe(formatDocs), question: new RunnablePassthrough() },
  prompt,
  model,
  new StringOutputParser(),
]);

// Fallback: Use general knowledge if no docs found
const fallbackChain = RunnableSequence.from([
  fallbackPrompt,
  model,
  new StringOutputParser(),
]);

// Combine with fallback
const robustChain = primaryChain.withFallbacks({ fallbacks: [fallbackChain] });
```

**Key benefit**: Provides answers even when documents don't cover the topic.

**Use when**: Error recovery, trying different models, ensuring coverage.

### 3. Conditional Branching

Route inputs to different chains based on conditions.

**Code**: [`code/06-branch-lcel.ts`](./code/06-branch-lcel.ts)

```typescript
import { RunnableBranch } from "@langchain/core/runnables";

// Simple questions → fast path (no retrieval)
const simpleChain = RunnableSequence.from([
  prompt,
  model.bind({ max_tokens: 100 }),
  new StringOutputParser(),
]);

// Complex questions → thorough path (with retrieval)
const complexChain = RunnableSequence.from([
  { context: retriever.pipe(formatDocs), question: new RunnablePassthrough() },
  prompt,
  model.bind({ max_tokens: 500 }),
  new StringOutputParser(),
]);

// Branch based on question complexity
const branchingChain = RunnableBranch.from([
  [(input) => input.length < 50, simpleChain],
  complexChain, // default
]);
```

**Key benefit**: Adapts processing depth to question complexity (faster, cheaper for simple queries).

**Use when**: Intelligent routing, cost optimization, performance tuning.

### 4. Streaming

Any LCEL chain can stream responses in real-time:

```typescript
const stream = await ragChain.stream("Explain RAG systems");
for await (const chunk of stream) {
  process.stdout.write(chunk);
}
```

### 5. Custom Functions

Add custom logic with `RunnableLambda`:

```typescript
import { RunnableLambda } from "@langchain/core/runnables";

const cleanDocs = new RunnableLambda({
  func: async (docs) => {
    return docs
      .map(d => d.pageContent.trim())
      .filter(content => content.length > 20)
      .join("\n\n=====\n\n");
  },
});

const chain = RunnableSequence.from([retriever, cleanDocs, prompt, model]);
```

### LCEL Patterns Summary

| Pattern | Use Case | Benefit |
|---------|----------|---------|
| **Parallel** | Multi-source data | 3x faster |
| **Fallback** | Error handling | Robust, always answers |
| **Branch** | Conditional routing | Cost/performance optimization |
| **Streaming** | Real-time UX | Better user experience |
| **Lambda** | Custom logic | Flexibility |

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

## 🔬 Advanced RAG Patterns (Optional)

Once you've mastered basic RAG, explore these advanced patterns:

- **Multi-Query RAG**: Generate multiple search queries for better retrieval
- **Contextual Compression**: Compress retrieved docs to include only relevant parts
- **Hybrid Search**: Combine semantic search with keyword search

See the [LangChain.js documentation](https://js.langchain.com/docs/modules/data_connection/retrievers/) for implementation details.

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
