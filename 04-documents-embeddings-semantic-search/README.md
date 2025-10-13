# Chapter 4: Documents, Embeddings & Semantic Search

In this chapter, you'll learn the complete pipeline for working with documents in AI applications — from loading and preparing documents to enabling intelligent semantic search. You'll discover how to load content from various sources, split it into manageable chunks, convert text into numerical embeddings, and perform similarity searches that understand meaning rather than just matching keywords. These foundational skills power AI applications like RAG (Retrieval Augmented Generation) systems.

## Prerequisites

- Completed [Chapter 3](../03-prompt-templates/README.md)

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Load documents from various sources (text, PDF, web)
- Split long documents into manageable chunks
- Understand chunking strategies and their trade-offs
- Work with document metadata
- Understand what embeddings are and how they work
- Create embeddings for text using AI models
- Store embeddings in vector databases
- Perform semantic similarity searches
- Build the foundation for RAG systems

---

## 📖 The Smart Library System Analogy

**Imagine you're building a modern, intelligent library system.**

### Part 1: Organizing the Library (Document Processing)

When someone donates a massive encyclopedia to your library, you can't:
- ❌ Hand readers the entire 2,000-page book
- ❌ Give them random pages
- ❌ Show them just individual words

Instead, you need to:
- ✅ Find the right sections (loading)
- ✅ Break it into manageable chapters (chunking)
- ✅ Label each piece with metadata (organization)
- ✅ Keep some overlap between sections so context isn't lost

### Part 2: The Smart Search System (Embeddings & Semantic Search)

Now imagine each book section gets a special "number tag" that represents its meaning:
- Section about "photosynthesis": `[plants: 0.9, biology: 0.8, energy: 0.7]`
- Section about "solar panels": `[plants: 0.1, technology: 0.9, energy: 0.8]`
- Section about "pasta recipes": `[plants: 0.2, food: 0.9, energy: 0.3]`

When someone asks "How do plants create energy?", the system:
1. Converts their question into numbers: `[plants: 0.9, biology: 0.7, energy: 0.8]`
2. Finds sections with similar numbers
3. Returns the photosynthesis section (perfect match!)

**This is exactly how document processing and semantic search work together!**

LLMs have context limits which means they can only process so much text at once. Document processing prepares your content, and semantic search helps you find exactly what's needed based on *meaning*, not just keyword matching.

---

## 📄 Part 1: Working with Documents

### Why Document Loaders?

LLMs need text input, but your data comes in many formats:
- Text files (.txt, .md)
- PDFs
- Websites
- JSON/CSV files
- And many more...

**Document loaders handle the complexity of reading different formats.**

### Example 1: Loading Text Files

In this example, you'll learn how to load text files using TextLoader and access document content and metadata.

**Code**: [`code/01-load-text.ts`](./code/01-load-text.ts)
**Run**: `tsx 04-documents-embeddings-semantic-search/code/01-load-text.ts`

First, create a sample text file:

```typescript
import { TextLoader } from "langchain/document_loaders/fs/text";
import { writeFileSync } from "fs";

// Create sample data
const sampleText = `
LangChain.js is a framework for building applications with large language models.

It provides tools for:
- Working with different AI providers
- Managing prompts and templates
- Processing and storing documents
- Building RAG systems
- Creating AI agents

The framework is designed to be modular and composable, allowing developers
to build complex AI applications by combining simple, reusable components.
`.trim();

writeFileSync("./data/sample.txt", sampleText);

// Load the document
const loader = new TextLoader("./data/sample.txt");
const docs = await loader.load();

console.log("Loaded documents:", docs.length);
console.log("Content:", docs[0].pageContent);
console.log("Metadata:", docs[0].metadata);
```

### Expected Output

When you run this example with `tsx 04-documents-embeddings-semantic-search/code/01-load-text.ts`, you'll see:

```
Loaded documents: 1
Content: LangChain.js is a framework for building applications with large language models.

It provides tools for:
- Working with different AI providers
- Managing prompts and templates
- Processing and storing documents
- Building RAG systems
- Creating AI agents

The framework is designed to be modular and composable, allowing developers
to build complex AI applications by combining simple, reusable components.

Metadata: {
  source: './data/sample.txt'
}
```

### How It Works

**What's happening**:
1. **Create sample data**: We write a text file to `./data/sample.txt`
2. **Initialize TextLoader**: Pass the file path to the loader
3. **Load**: Call `loader.load()` to read the file
4. **Result**: Returns an array of `Document` objects

**Key Points**:
- `TextLoader` reads text files and handles file I/O
- Returns array of `Document` objects (even for single files, for consistency)
- Each document has two main properties:
  - `pageContent`: The actual text content
  - `metadata`: Information about the document (source, etc.)
- Metadata automatically includes the source file path

---

## ✂️ Splitting Documents

### Why Split Documents?

- **LLM context limits**: Models can only process ~4,000-128,000 tokens
- **Relevance**: Smaller chunks = more precise retrieval
- **Cost**: Smaller inputs = lower API costs

### Chunk Size Trade-offs

| Small Chunks (200-500 chars) | Large Chunks (1000-2000 chars) |
|------------------------------|--------------------------------|
| ✅ More precise | ✅ More context |
| ✅ Better for specific questions | ✅ Better for complex topics |
| ❌ May lose context | ❌ Less precise matching |
| ❌ More chunks to process | ❌ Fewer chunks |

### Example 2: Text Splitting

Here you'll split long documents into manageable chunks using RecursiveCharacterTextSplitter with configurable chunk size and overlap.

**Code**: [`code/02-splitting.ts`](./code/02-splitting.ts)
**Run**: `tsx 04-documents-embeddings-semantic-search/code/02-splitting.ts`

```typescript
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const text = `
[Long article about AI and machine learning...]
`;

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,      // Target size in characters
  chunkOverlap: 50,    // Overlap between chunks
});

const docs = await splitter.createDocuments([text]);

console.log(`Split into ${docs.length} chunks`);

docs.forEach((doc, i) => {
  console.log(`\nChunk ${i + 1}:`);
  console.log(doc.pageContent);
  console.log(`Length: ${doc.pageContent.length} characters`);
});
```

### Expected Output

When you run this example with `tsx 04-documents-embeddings-semantic-search/code/02-splitting.ts`, you'll see:

```
Split into 5 chunks

Chunk 1:
[First 500 characters of the article...]
Length: 497 characters

Chunk 2:
[Next 500 characters with 50 character overlap...]
Length: 503 characters

Chunk 3:
[...]
```

### How It Works

**What's happening**:
1. **Create splitter**: Configure `RecursiveCharacterTextSplitter` with `chunkSize: 500` and `chunkOverlap: 50`
2. **Split text**: `createDocuments()` splits the text into manageable pieces
3. **Each chunk**: Has approximately 500 characters, with 50 characters overlapping with adjacent chunks
4. **Result**: Array of `Document` objects, each with a portion of the original text

**Why these settings?**
- `chunkSize: 500`: Small enough for focused retrieval, large enough for context
- `chunkOverlap: 50`: 10% overlap preserves context between chunks

**Splitter Types**:

1. **RecursiveCharacterTextSplitter** (recommended)
   - Splits on paragraphs, then sentences, then words
   - Preserves structure better

2. **CharacterTextSplitter**
   - Simple splitting by character count
   - Less context-aware

3. **TokenTextSplitter**
   - Splits by token count (more precise for LLM limits)

---

## 🔄 Chunk Overlap

**Why overlap chunks?**

Without overlap:
```
Chunk 1: "...the mitochondria is the"
Chunk 2: "powerhouse of the cell..."
```
❌ Context is lost!

With overlap:
```
Chunk 1: "...the mitochondria is the powerhouse"
Chunk 2: "mitochondria is the powerhouse of the cell..."
```
✅ Context preserved!

### Example 3: Comparing Overlap

This example compares document chunks with and without overlap to show you how overlap preserves context between adjacent chunks.

**Code**: [`code/03-overlap.ts`](./code/03-overlap.ts)
**Run**: `tsx 04-documents-embeddings-semantic-search/code/03-overlap.ts`

```typescript
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const text = "Your sample text here...";

// No overlap
const noOverlap = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 0,
});

// With overlap
const withOverlap = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
});

const chunks1 = await noOverlap.createDocuments([text]);
const chunks2 = await withOverlap.createDocuments([text]);

console.log("Without overlap:");
chunks1.forEach((doc, i) => console.log(`${i}: ${doc.pageContent}`));

console.log("\nWith overlap:");
chunks2.forEach((doc, i) => console.log(`${i}: ${doc.pageContent}`));
```

### Expected Output

When you run this example with `tsx 04-documents-embeddings-semantic-search/code/03-overlap.ts`, you'll see the difference:

```
Without overlap:
0: [First 100 chars] ...end of sentence
1: New sentence starts... [next 100 chars]
2: [next 100 chars]

With overlap:
0: [First 100 chars including] ...end of sentence. New
1: sentence. New sentence starts... [90 more chars]
2: [last 20 chars of previous] + [80 new chars]
```

### How It Works

**What's happening**:
- **Without overlap (chunkOverlap: 0)**: Chunks are cut exactly at 100 characters, potentially splitting mid-sentence
- **With overlap (chunkOverlap: 20)**: Each chunk includes the last 20 characters from the previous chunk, preserving context

**Why overlap matters**: Imagine splitting "The mitochondria is the powerhouse of the cell" at 25 characters:
- Without overlap: Chunk 1 ends with "...is the", Chunk 2 starts with "powerhouse..." - context lost!
- With overlap: Both chunks include "is the powerhouse", preserving meaning

**Recommended overlap**: 10-20% of chunk size

---

## 🏷️ Document Metadata

Metadata helps you:
- Track document source
- Filter by category, date, author
- Understand context

### Example 4: Working with Metadata

In this example, you'll learn how to add and preserve metadata (source, category, date, author) through document loading and splitting operations.

**Code**: [`code/04-metadata.ts`](./code/04-metadata.ts)
**Run**: `tsx 04-documents-embeddings-semantic-search/code/04-metadata.ts`

```typescript
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Create documents with metadata
const docs = [
  new Document({
    pageContent: "LangChain.js is a framework for building AI apps...",
    metadata: {
      source: "langchain-guide.md",
      category: "tutorial",
      date: "2024-01-15",
      author: "Tech Team",
    },
  }),
  new Document({
    pageContent: "RAG systems combine retrieval with generation...",
    metadata: {
      source: "rag-explained.md",
      category: "advanced",
      date: "2024-02-20",
    },
  }),
];

// Metadata is preserved when splitting
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 20,
});

const splitDocs = await splitter.splitDocuments(docs);

splitDocs.forEach((doc, i) => {
  console.log(`\nChunk ${i + 1}:`);
  console.log("Content:", doc.pageContent.substring(0, 50) + "...");
  console.log("Metadata:", doc.metadata);
});
```

### Expected Output

When you run this example with `tsx 04-documents-embeddings-semantic-search/code/04-metadata.ts`, you'll see:

```
Chunk 1:
Content: LangChain.js is a framework for building AI apps...
Metadata: {
  source: 'langchain-guide.md',
  category: 'tutorial',
  date: '2024-01-15',
  author: 'Tech Team'
}

Chunk 2:
Content: ...
Metadata: {
  source: 'langchain-guide.md',
  category: 'tutorial',
  date: '2024-01-15',
  author: 'Tech Team'
}

Chunk 3:
Content: RAG systems combine retrieval with generation...
Metadata: {
  source: 'rag-explained.md',
  category: 'advanced',
  date: '2024-02-20'
}
```

### How It Works

**What's happening**:
1. **Create documents with metadata**: Each `Document` has `pageContent` and custom `metadata`
2. **Split documents**: `splitDocuments()` breaks them into chunks
3. **Metadata is preserved**: Every chunk retains the metadata from its parent document
4. **Use metadata for filtering**: Later you can filter by source, category, date, etc.

**Real-world use cases**:
- Filter search results by document type or date
- Track which document a chunk came from
- Implement access control (user permissions)
- Build faceted search interfaces

---

## 🔢 Part 2: Embeddings & Semantic Search

### Traditional Search vs. Semantic Search

**Keyword Search**:
```
Query: "How do I cook pasta?"
Matches: Documents containing "cook" AND "pasta"
Misses: "Preparing Italian noodles" (different words, same meaning!)
```

**Semantic Search**:
```
Query: "How do I cook pasta?"
Understands: cooking = preparing, pasta = noodles
Finds: "Preparing Italian noodles", "Making spaghetti", etc.
```

### What Are Embeddings?

1. **Text goes in**: "LangChain is a framework"
2. **AI model processes it**
3. **Vector comes out**: `[0.23, -0.41, 0.87, ..., 0.15]` (1536 numbers!)
4. **Similar text = similar vectors**

**Key Properties**:
- Similar meaning → Similar vectors
- Vectors can be compared mathematically
- Works across languages
- Captures context and nuance

---

## 💻 Creating Embeddings

### Example 5: Basic Embeddings

Here you'll create text embeddings and calculate cosine similarity to see how similar text produces similar vector representations.

**Code**: [`code/05-basic-embeddings.ts`](./code/05-basic-embeddings.ts)
**Run**: `tsx 04-documents-embeddings-semantic-search/code/05-basic-embeddings.ts`

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";

const embeddings = new OpenAIEmbeddings({
  model: process.env.AI_EMBEDDING_MODEL || "text-embedding-3-small",
  configuration: {
    baseURL: process.env.AI_ENDPOINT,
    defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
  },
  apiKey: process.env.AI_API_KEY,
});

// Create an embedding for text
const text = "LangChain makes building AI apps easier";
const embedding = await embeddings.embedQuery(text);

console.log(`Embedding dimensions: ${embedding.length}`);
console.log(`First 10 values: ${embedding.slice(0, 10)}`);

// Similar text produces similar embeddings
const similar = await embeddings.embedQuery("LangChain simplifies AI development");
const different = await embeddings.embedQuery("I love pizza");

// Calculate similarity (cosine similarity)
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magA * magB);
}

console.log("Similarity (LangChain vs LangChain):", cosineSimilarity(embedding, similar).toFixed(3));
console.log("Similarity (LangChain vs pizza):", cosineSimilarity(embedding, different).toFixed(3));
```

### Expected Output

When you run this example with `tsx 04-documents-embeddings-semantic-search/code/05-basic-embeddings.ts`, you'll see:

```
Embedding dimensions: 1536
First 10 values: 0.023,-0.041,0.087,...
Similarity (LangChain vs LangChain): 0.892
Similarity (LangChain vs pizza): 0.124
```

### How It Works

**What's happening**:
1. **Create embedding model**: Configure `OpenAIEmbeddings` with model name and API settings
2. **Generate embedding**: Call `embedQuery()` to convert text into a 1536-dimensional vector
3. **Compare embeddings**: Use cosine similarity to measure how similar two vectors are
4. **Similarity scores**:
   - 0.892 (LangChain vs LangChain): Very similar - both about the same topic
   - 0.124 (LangChain vs pizza): Very different - unrelated topics

**Key insights**:
- **Similar meaning → Similar vectors**: "LangChain makes building AI apps easier" and "LangChain simplifies AI development" have similar embeddings
- **Different meaning → Different vectors**: LangChain and pizza have very different embeddings
- **Cosine similarity**: Measures the angle between vectors (1.0 = identical, 0.0 = orthogonal, -1.0 = opposite)
- **Dimensions**: 1536 numbers capture the semantic meaning of the text

---

## 🗄️ Vector Stores

Vector stores are databases optimized for storing and searching embeddings.

### Popular Vector Stores

| Vector Store | Best For | Difficulty |
|--------------|----------|------------|
| MemoryVectorStore | Testing, small datasets | Easy |
| Chroma | Local development | Easy |
| Pinecone | Production, cloud | Medium |
| Weaviate | Self-hosted production | Medium |
| Qdrant | High performance | Medium |

### Example 6: In-Memory Vector Store

In this example, you'll build a vector store from documents and perform semantic similarity search to find relevant content based on meaning.

**Code**: [`code/06-vector-store.ts`](./code/06-vector-store.ts)
**Run**: `tsx 04-documents-embeddings-semantic-search/code/06-vector-store.ts`

```typescript
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/document";
import "dotenv/config";

const embeddings = new OpenAIEmbeddings({
  model: process.env.AI_EMBEDDING_MODEL || "text-embedding-3-small",
  configuration: {
    baseURL: process.env.AI_ENDPOINT,
    defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
  },
  apiKey: process.env.AI_API_KEY,
});

// Create documents
const docs = [
  new Document({ pageContent: "Cats are independent pets that love to nap." }),
  new Document({ pageContent: "Dogs are loyal companions that enjoy playing fetch." }),
  new Document({ pageContent: "Birds can sing beautiful songs and fly freely." }),
  new Document({ pageContent: "Fish are quiet pets that live in aquariums." }),
];

// Create vector store from documents
const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

// Perform semantic search
const results = await vectorStore.similaritySearch("animals that live indoors", 2);

console.log("Most similar documents:");
results.forEach((doc, i) => {
  console.log(`${i + 1}. ${doc.pageContent}`);
});
```

### Expected Output

When you run this example with `tsx 04-documents-embeddings-semantic-search/code/06-vector-store.ts`, you'll see:

```
Most similar documents:
1. Fish are quiet pets that live in aquariums.
2. Cats are independent pets that love to nap.
```

Notice: The search found "indoors" matches even though the word "indoors" doesn't appear in any document!

### How It Works

**What's happening**:
1. **Create documents**: Four documents about different pets
2. **Create embeddings**: `fromDocuments()` automatically embeds each document
3. **Store in vector store**: Embeddings are stored in memory (MemoryVectorStore)
4. **Semantic search**: `similaritySearch("animals that live indoors", 2)` finds the 2 most similar documents
5. **Results based on meaning**: Fish (aquariums = indoors) and Cats (nap = indoor activity) match best

**Why semantic search wins**:
- **Keyword search** would find nothing (no document contains "indoors" or "animals")
- **Semantic search** understands that:
  - Fish in aquariums → indoors
  - Cats napping → typically indoors
  - Birds flying freely → outdoors
  - Dogs playing fetch → typically outdoors

The AI understands *meaning*, not just words!

---

## 🎯 Similarity Search with Scores

### Example 7: Search with Similarity Scores

Here you'll perform similarity search with numerical scores to quantify how closely documents match your search query.

**Code**: [`code/07-similarity-scores.ts`](./code/07-similarity-scores.ts)
**Run**: `tsx 04-documents-embeddings-semantic-search/code/07-similarity-scores.ts`

```typescript
// ... setup code ...

const resultsWithScores = await vectorStore.similaritySearchWithScore(
  "pets that need less attention",
  4
);

console.log("Search results with similarity scores:");
resultsWithScores.forEach(([doc, score]) => {
  console.log(`Score: ${score.toFixed(3)} - ${doc.pageContent}`);
});
```

### Expected Output

When you run this example with `tsx 04-documents-embeddings-semantic-search/code/07-similarity-scores.ts`, you'll see:

```
Search results with similarity scores:
Score: 0.812 - Fish are quiet pets that live in aquariums.
Score: 0.794 - Cats are independent pets that love to nap.
Score: 0.701 - Birds can sing beautiful songs and fly freely.
Score: 0.623 - Dogs are loyal companions that enjoy playing fetch.
```

### How It Works

**What's happening**:
1. **similaritySearchWithScore()**: Instead of just returning documents, this returns tuples of `[document, score]`
2. **Scores indicate relevance**: Higher score = more similar to the query
3. **Query**: "pets that need less attention"
4. **Results ranked by relevance**:
   - Fish (0.812): Very low maintenance
   - Cats (0.794): Independent, less attention needed
   - Birds (0.701): Moderate attention
   - Dogs (0.623): High attention needed

**Score interpretation**:
- 1.0 = Identical
- 0.8-0.9 = Very similar
- 0.6-0.8 = Somewhat similar
- <0.6 = Different topics

**Use scores to**: Set similarity thresholds (e.g., only return results with score > 0.7), implement confidence-based filtering, or rank results for users

---

## ⚡ Batch Processing

Creating embeddings one at a time is slow. Use batch processing!

### Example 8: Batch Embeddings

In this example, you'll efficiently create embeddings for multiple texts at once using batch processing, which is significantly faster than individual calls.

**Code**: [`code/08-batch-embeddings.ts`](./code/08-batch-embeddings.ts)
**Run**: `tsx 04-documents-embeddings-semantic-search/code/08-batch-embeddings.ts`

```typescript
const texts = [
  "Machine learning is a subset of AI",
  "Deep learning uses neural networks",
  "Natural language processing handles text",
  "Computer vision processes images",
  "Reinforcement learning learns from rewards",
];

console.time("Batch embeddings");
const batchEmbeddings = await embeddings.embedDocuments(texts);
console.timeEnd("Batch embeddings");

console.log(`Created ${batchEmbeddings.length} embeddings`);
console.log(`Each with ${batchEmbeddings[0].length} dimensions`);
```

### Expected Output

When you run this example with `tsx 04-documents-embeddings-semantic-search/code/08-batch-embeddings.ts`, you'll see:

```
Batch embeddings: 124ms
Created 5 embeddings
Each with 1536 dimensions
```

### How It Works

**What's happening**:
1. **Create array of texts**: 5 different AI-related sentences
2. **Batch embed**: `embedDocuments(texts)` embeds all at once
3. **Result**: Array of 5 embeddings, each with 1536 dimensions
4. **Performance**: Much faster than calling `embedQuery()` 5 times individually

**Performance comparison**:
- **Individual calls**: ~200ms × 5 = 1000ms
- **Batch call**: ~120ms total
- **Savings**: 8x faster!

**Benefits**:
- 5-10x faster than individual calls
- Lower API costs (fewer round trips)
- More efficient resource usage
- Better for processing large document collections

**When to use**: Always prefer batch processing when you have multiple texts to embed at once (e.g., loading a document collection, processing user queries in bulk)

---

## 📊 Choosing Similarity Metrics

### Cosine Similarity (Most Common)

- Measures angle between vectors
- Range: -1 to 1 (usually 0 to 1 for text)
- **Best for**: Text, embeddings
- **Use when**: You care about direction, not magnitude

### Euclidean Distance

- Measures straight-line distance
- Range: 0 to ∞ (smaller = more similar)
- **Best for**: Spatial data
- **Use when**: Magnitude matters

### Dot Product

- Measures alignment and magnitude
- Range: -∞ to ∞
- **Best for**: Recommendation systems
- **Use when**: Both direction and magnitude matter

**Recommendation**: Use **cosine similarity** for text embeddings.

---

## 🎓 Key Takeaways

- ✅ **Document loaders** handle different file formats
- ✅ **Text splitters** break documents into manageable chunks
- ✅ **Chunk size matters**: Balance context vs. precision
- ✅ **Overlap preserves context** between chunks
- ✅ **Metadata** tracks source and enables filtering
- ✅ **Embeddings** convert text to numerical vectors
- ✅ **Semantic search** finds meaning, not just keywords
- ✅ **Vector stores** enable fast similarity search at scale
- ✅ **Batch processing** is more efficient than one-by-one
- ✅ **Cosine similarity** is best for text comparisons

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Multi-Format Loader** - Load and process different file types
2. **Optimal Chunking** - Experiment with chunk sizes
3. **Metadata Manager** - Build a document organization system
4. **Similarity Explorer** - Find similar sentences
5. **Semantic Book Search** - Build a book recommendation system
6. **Keyword vs. Semantic** - Compare search approaches
7. **Multi-lingual Search** - Cross-language semantic search

---

## 📚 Additional Resources

- [Document Loaders Documentation](https://js.langchain.com/docs/modules/data_connection/document_loaders/)
- [Text Splitters Guide](https://js.langchain.com/docs/modules/data_connection/document_transformers/)
- [Embeddings Documentation](https://js.langchain.com/docs/modules/data_connection/text_embedding/)
- [Vector Stores Guide](https://js.langchain.com/docs/modules/data_connection/vectorstores/)
- [Understanding Embeddings](https://platform.openai.com/docs/guides/embeddings)

---

## 🗺️ Navigation

- **Previous**: [03-prompt-templates](../03-prompt-templates/README.md)
- **Next**: [05-function-calling-tooling](../05-function-calling-tooling/README.md)
- **Home**: [Course Home](../README.md)

---

💬 **Questions or stuck?** Join our [Discord community](https://aka.ms/foundry/discord) or open a [GitHub Discussion](https://github.com/microsoft/langchainjs-for-beginners/discussions)!
Thanks