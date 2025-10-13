# Chapter 6: Building RAG Systems

In this chapter, you'll learn to build RAG (Retrieval Augmented Generation) systems that combine document retrieval with AI generation to answer questions accurately using your own data. You'll master the RAG architecture, use LCEL (LangChain Expression Language) to create elegant chains, and explore different retrieval strategies like MMR and similarity thresholds. RAG systems are essential for building AI assistants that provide accurate, sourced answers from custom knowledge bases.

## Prerequisites

- Completed [Chapter 5](../05-embeddings-semantic-search/README.md)

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Understand the RAG (Retrieval Augmented Generation) architecture
- Build a question-answering system over custom documents
- Use LCEL (LangChain Expression Language) to create chains
- Master advanced LCEL patterns (parallel, fallback, branching)
- Implement different retrieval strategies
- Handle context and citations properly

---

## 📖 The Open-Book Exam Analogy

**Imagine two types of exams:**

**Closed-Book Exam (Standard LLM)**:
- ❌ Student relies only on memorized knowledge
- ❌ Can't look up specific facts
- ❌ May give wrong answers confidently
- ❌ Knowledge cutoff (stops learning at training time)

**Open-Book Exam (RAG System)**:
- ✅ Student can reference textbook during exam
- ✅ Looks up exact information as needed
- ✅ Combines knowledge with current resources
- ✅ More accurate, can cite sources

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

- ✅ **Up-to-date information**: Add new docs without retraining
- ✅ **Source attribution**: Know where answers come from
- ✅ **Domain-specific**: Works with your proprietary data
- ✅ **Cost-effective**: No model fine-tuning needed
- ✅ **Accurate**: Reduces hallucinations

---

## 💻 Building Your First RAG System

### Example 1: Simple RAG

**Code**: [`code/01-simple-rag.ts`](./code/01-simple-rag.ts)

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

---

## 🔗 LCEL (LangChain Expression Language)

LCEL lets you chain operations using the pipe operator.

### Example 2: RAG with LCEL

**Code**: [`code/02-rag-lcel.ts`](./code/02-rag-lcel.ts)

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

**Benefits of LCEL**:
- Clean, readable syntax
- Easy to modify and test
- Supports streaming
- Built-in error handling

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

**Example 4: Parallel RAG Queries**

**Code**: [`code/04-parallel-lcel.ts`](./code/04-parallel-lcel.ts)

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

**Why Parallel?**
- ⚡ **Faster**: Multiple operations run simultaneously
- 🔄 **Efficient**: Better resource utilization
- 📊 **Rich Context**: Combine multiple data sources

### 2. Fallback Chains

Handle failures gracefully by trying alternative approaches:

**Example 5: RAG with Fallback**

**Code**: [`code/05-fallback-lcel.ts`](./code/05-fallback-lcel.ts)

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

**Use Cases**:
- 🛡️ **Error recovery**: Try different models if one fails
- 🎯 **Quality control**: Fall back to simpler approach if needed
- 💰 **Cost optimization**: Try cheaper model first, upgrade if needed

### 3. Conditional Branching

Route inputs to different chains based on conditions:

**Example 6: Smart RAG Router**

**Code**: [`code/06-branch-lcel.ts`](./code/06-branch-lcel.ts)

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
1. **Document Q&A System** - Build RAG for your own documents
2. **Citation Generator** - Add source attribution
3. **Multi-Doc RAG** - Handle multiple document types
4. **Conversational RAG** - Add chat history

---

## 📚 Additional Resources

- [RAG Documentation](https://js.langchain.com/docs/tutorials/rag)
- [LCEL Guide](https://js.langchain.com/docs/expression_language/)
- [Retrieval Strategies](https://js.langchain.com/docs/modules/data_connection/retrievers/)

---

## 🗺️ Navigation

- **Previous**: [05-embeddings-semantic-search](../05-embeddings-semantic-search/README.md)
- **Next**: [07-langgraph-agents-tools](../07-langgraph-agents-tools/README.md)
- **Home**: [Course Home](../README.md)

---

💬 **Questions or stuck?** Join our [Discord community](https://aka.ms/foundry/discord)!
