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

You have three main approaches, and understanding when to use each is critical:

### When to Use RAG vs Fine-Tuning vs Prompt Engineering

#### Approach 1: Prompt Engineering (Simplest)

**What it is**: Include all context directly in your prompts

```typescript
const context = "Product X costs $99. Product Y costs $199.";
const prompt = `${context}\n\nQuestion: How much is Product X?`;
```

**When to use**:
- ✅ Small amount of information (fits in prompt)
- ✅ Information changes rarely
- ✅ Same context used for every request
- ✅ No need for search/retrieval

**When NOT to use**:
- ❌ Thousands of documents (exceeds context window)
- ❌ Need to search through information
- ❌ Information updates frequently
- ❌ Different context needed per request

**Example use cases**:
- System instructions
- API documentation that fits in prompt
- Small static knowledge bases
- Few-shot examples

---

#### Approach 2: RAG (Retrieval Augmented Generation)

**What it is**: Search a knowledge base for relevant information, then include it in prompts

```typescript
// 1. Search vector store for relevant docs
const relevantDocs = await vectorStore.search(userQuestion);

// 2. Include found docs in prompt
const prompt = `Context: ${relevantDocs}\n\nQuestion: ${userQuestion}`;
```

**When to use**:
- ✅ Large knowledge base (hundreds to millions of documents)
- ✅ Information updates frequently (add/remove docs anytime)
- ✅ Need source attribution (cite where answers come from)
- ✅ Domain-specific or proprietary data
- ✅ Want to reduce hallucinations
- ✅ Cost-effective solution (no model training)

**When NOT to use**:
- ❌ Teaching the model new patterns or styles
- ❌ Changing model behavior or personality
- ❌ Learning new formats or languages
- ❌ Information fits easily in a prompt

**Benefits**:
- **Up-to-date information**: Add new documents without retraining the model
- **Source attribution**: Track which documents produced each answer
- **Domain-specific**: Works with your proprietary data, trade secrets, internal docs
- **Cost-effective**: No expensive fine-tuning or retraining required
- **Accurate**: Grounds answers in actual documents, reducing hallucinations
- **Scalable**: Handle millions of documents efficiently
- **Flexible**: Update knowledge base in real-time

**Limitations**:
- **Retrieval quality matters**: If search doesn't find relevant docs, answers will be poor
- **Context window limits**: Can only include top K documents in prompt
- **No behavior change**: Doesn't change how the model writes or reasons
- **Latency**: Additional retrieval step adds processing time

**Example use cases**:
- Customer support with knowledge base
- Legal document analysis
- Medical records Q&A
- Company policy assistant
- Product documentation chatbot
- Research paper search
- Code repository Q&A

---

#### Approach 3: Fine-Tuning

**What it is**: Retrain the model on custom data to change its behavior

```typescript
// Create training dataset
const trainingData = [
  { prompt: "...", completion: "..." },
  // Thousands of examples
];

// Fine-tune model (can be expensive & time-consuming)
const fineTunedModel = await trainModel(baseModel, trainingData);
```

**When to use**:
- ✅ Need to change model behavior, style, or personality
- ✅ Teach new patterns (code style, writing format)
- ✅ Improve performance on specific task types
- ✅ Reduce need for lengthy prompts
- ✅ Domain-specific language or jargon

**When NOT to use**:
- ❌ Just need to add factual information (use RAG instead)
- ❌ Information updates frequently (retraining is expensive)
- ❌ Limited training data (need hundreds/thousands of examples)
- ❌ Budget constraints (fine-tuning costs money and compute)

**Benefits**:
- Changes model behavior fundamentally
- Can improve quality on specific tasks
- Reduces need for complex prompts
- Can teach new formats/styles

**Limitations**:
- **Expensive**: Requires compute resources and API credits
- **Time-consuming**: Training can take hours or days
- **Static knowledge**: Model's knowledge frozen at training time
- **Hard to update**: Must retrain to add new information
- **Requires expertise**: Need ML knowledge to do effectively
- **Data requirements**: Need large, high-quality training dataset

**Example use cases**:
- Teaching code style (e.g., company-specific patterns)
- Custom writing style or tone
- Domain-specific language (medical, legal)
- Improved performance on repetitive tasks
- Reducing bias or unwanted behaviors

---

### Decision Framework: Choosing the Right Approach

Here's a simple decision tree to help you choose:

**Step 1**: Does your information fit in a prompt (< 8,000 tokens)?
- **YES** → Use **Prompt Engineering** (simplest)
- **NO** → Continue to Step 2

**Step 2**: Do you need to *add factual information* or *change model behavior*?
- **Add information** → Use **RAG**
- **Change behavior** → Use **Fine-Tuning**

**Step 3**: Does your information update frequently?
- **YES** → Definitely use **RAG** (easy to update)
- **NO** → Either works, but RAG is cheaper

**Step 4**: Do you need to cite sources?
- **YES** → Use **RAG** (tracks source documents)
- **NO** → Either approach works

### Real-World Scenarios

**Scenario 1: Customer Support Chatbot**
- **Problem**: Answer questions about 10,000 product manuals
- **Solution**: **RAG** ✅
- **Why**: Too much content for prompts, updates frequently, need citations

**Scenario 2: Code Style Enforcer**
- **Problem**: Generate code in company-specific style
- **Solution**: **Fine-Tuning** ✅
- **Why**: Teaching patterns/style, not adding facts

**Scenario 3: Simple FAQ Bot**
- **Problem**: Answer 20 common questions
- **Solution**: **Prompt Engineering** ✅
- **Why**: Small dataset fits in prompt, no search needed

**Scenario 4: Legal Document Analyzer**
- **Problem**: Analyze case law (millions of documents)
- **Solution**: **RAG** ✅
- **Why**: Huge dataset, need citations, updates with new rulings

**Scenario 5: Medical Diagnosis Assistant**
- **Problem**: Suggest diagnoses based on symptoms + medical research
- **Solution**: **RAG + Fine-Tuning** ✅
- **Why**: RAG for research papers, fine-tuning for medical reasoning patterns

### Combining Approaches

Often the best solution uses **multiple approaches together**:

```typescript
// Fine-tuned model with medical knowledge patterns
const medicalModel = await loadFineTunedModel("medical-v1");

// RAG for current research papers
const relevantPapers = await vectorStore.search(symptoms);

// Prompt engineering for instructions
const prompt = `
You are a medical assistant. Use these research papers:
${relevantPapers}

Patient symptoms: ${symptoms}
Suggest possible diagnoses with citations.
`;

const response = await medicalModel.invoke(prompt);
```

This combines:
1. **Fine-tuning**: Medical reasoning patterns
2. **RAG**: Current research papers
3. **Prompt engineering**: Instructions and format

### Summary: Why Choose RAG?

Choose RAG when you need to:
- 📚 Work with large knowledge bases (documents, databases, etc.)
- 🔄 Update information frequently without retraining
- 📝 Provide source citations and attribution
- 💰 Keep costs down (no expensive fine-tuning)
- ✅ Reduce hallucinations with grounded answers
- 🏢 Use proprietary or private data
- ⚡ Get started quickly (faster than fine-tuning)

---

## 💻 Building Your First RAG System

Before we build a RAG system, let's make sure RAG is the right choice! Let's see the decision framework in action.

### Example 0: Choosing the Right Approach (RAG vs Alternatives)

This example demonstrates the decision framework we just learned—comparing Prompt Engineering, RAG, and Fine-Tuning side by side to understand when each approach makes sense.

**Code**: [`code/00-when-to-use-rag.ts`](./code/00-when-to-use-rag.ts)
**Run**: `tsx 06-rag-systems/code/00-when-to-use-rag.ts`

This demo shows three real-world scenarios:

1. **Scenario 1: Small FAQ Bot** → Uses **Prompt Engineering** (5 Q&As fit in prompt)
2. **Scenario 2: Large Documentation Bot** → Uses **RAG** (1000s of docs, needs search)
3. **Scenario 3: Code Style Enforcer** → Uses **Fine-Tuning** (teaching patterns, not facts)

### Expected Output

When you run this example with `tsx 06-rag-systems/code/00-when-to-use-rag.ts`, you'll see:

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

### Example 1: Simple RAG

In this example, you'll build a complete RAG system that retrieves relevant documents from a vector store and uses them to answer questions accurately.

**Code**: [`code/01-simple-rag.ts`](./code/01-simple-rag.ts)
**Run**: `tsx 06-rag-systems/code/01-simple-rag.ts`

```typescript
import { createChatModel, createEmbeddingsModel } from "@/scripts/create-model.js";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import "dotenv/config";

// Setup
const model = createChatModel();

const embeddings = createEmbeddingsModel();

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
