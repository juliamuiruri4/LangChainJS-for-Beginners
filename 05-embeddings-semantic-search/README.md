# Chapter 5: Embeddings & Semantic Search

## ⏱️ Lesson Overview

- **Estimated Time**: 75 minutes
- **Prerequisites**: Completed [Chapter 4](../04-working-with-documents/README.md)
- **Difficulty**: Beginner

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Understand what embeddings are and how they work
- Create embeddings for text using AI models
- Store embeddings in vector databases
- Perform semantic similarity searches
- Choose the right vector store for your needs

---

## 📖 The Party Name Tag Analogy

**Imagine you're at a massive party with 1,000 people.**

Everyone wears a name tag with numbers representing their interests:
- Person A: `[music: 0.8, sports: 0.3, tech: 0.9]`
- Person B: `[music: 0.7, sports: 0.1, tech: 0.95]`
- Person C: `[music: 0.1, sports: 0.9, tech: 0.2]`

To find people you'd vibe with, you don't need to read everyone's life story—you just **compare the numbers**!

If your tag is `[music: 0.7, sports: 0.1, tech: 0.95]`, you'd naturally gravitate toward Person B (very similar numbers) rather than Person C (completely different).

**Embeddings work exactly the same way!**

They convert text into arrays of numbers, making it easy to find similar content mathematically. This is called **semantic search**—finding meaning, not just matching keywords.

---

## 🔢 What Are Embeddings?

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

### How Embeddings Work

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

### Example 1: Basic Embeddings

**Code**: [`code/01-basic-embeddings.ts`](./code/01-basic-embeddings.ts)

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  configuration: {
    baseURL: process.env.AI_ENDPOINT,
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

**Output**:
```
Embedding dimensions: 1536
Similarity (LangChain vs LangChain): 0.892
Similarity (LangChain vs pizza): 0.124
```

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

### Example 2: In-Memory Vector Store

**Code**: [`code/02-vector-store.ts`](./code/02-vector-store.ts)

```typescript
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/document";
import "dotenv/config";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  configuration: {
    baseURL: process.env.AI_ENDPOINT,
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

**Output**:
```
Most similar documents:
1. Fish are quiet pets that live in aquariums.
2. Cats are independent pets that love to nap.
```

Notice: The search found "indoors" matches even though the word "indoors" doesn't appear!

---

## 🎯 Similarity Search with Scores

### Example 3: Search with Similarity Scores

**Code**: [`code/03-similarity-scores.ts`](./code/03-similarity-scores.ts)

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

**Output**:
```
Score: 0.812 - Fish are quiet pets that live in aquariums.
Score: 0.794 - Cats are independent pets that love to nap.
Score: 0.701 - Birds can sing beautiful songs and fly freely.
Score: 0.623 - Dogs are loyal companions that enjoy playing fetch.
```

**Score interpretation**:
- 1.0 = Identical
- 0.8-0.9 = Very similar
- 0.6-0.8 = Somewhat similar
- <0.6 = Different topics

---

## ⚡ Batch Processing

Creating embeddings one at a time is slow. Use batch processing!

### Example 4: Batch Embeddings

**Code**: [`code/04-batch-embeddings.ts`](./code/04-batch-embeddings.ts)

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

**Benefits**:
- 5-10x faster than individual calls
- Lower API costs
- More efficient resource usage

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

- ✅ **Embeddings** convert text to numerical vectors
- ✅ **Semantic search** finds meaning, not just keywords
- ✅ **Vector stores** enable fast similarity search at scale
- ✅ **Batch processing** is more efficient than one-by-one
- ✅ **Cosine similarity** is best for text comparisons
- ✅ Similar text produces similar embeddings

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Similarity Explorer** - Find similar sentences
2. **Semantic Book Search** - Build a book recommendation system
3. **Keyword vs. Semantic** - Compare search approaches
4. **Multi-lingual Search** - Cross-language semantic search

---

## 📚 Additional Resources

- [Embeddings Documentation](https://js.langchain.com/docs/modules/data_connection/text_embedding/)
- [Vector Stores Guide](https://js.langchain.com/docs/modules/data_connection/vectorstores/)
- [Understanding Embeddings](https://platform.openai.com/docs/guides/embeddings)

---

## 🗺️ Navigation

- **Previous**: [04-working-with-documents](../04-working-with-documents/README.md)
- **Next**: [06-rag-systems](../06-rag-systems/README.md)
- **Home**: [Course Home](../README.md)

---

💬 **Questions or stuck?** Join our [Discord community](https://aka.ms/foundry/discord) or open a [GitHub Discussion](https://github.com/microsoft/langchainjs-for-beginners/discussions)!
