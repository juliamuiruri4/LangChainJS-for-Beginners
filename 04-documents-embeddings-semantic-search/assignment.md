# Chapter 4 Assignment: Documents, Embeddings & Semantic Search

## Overview

Practice creating embeddings, building vector stores, and performing semantic searches to understand how AI finds meaning in text.

## Prerequisites

- Completed [Chapter 4](./README.md)
- Run all code examples
- Understand embeddings and similarity metrics

---

## Challenge: Similarity Explorer 🔬

**Goal**: Discover how embeddings capture semantic similarity.

**Tasks**:
1. Create `similarity-explorer.ts` in the `04-documents-embeddings-semantic-search/code/` folder
2. Create embeddings for these 10 sentences:
   ```
   - "I love programming in JavaScript"
   - "JavaScript is my favorite language"
   - "Python is great for data science"
   - "Machine learning uses Python often"
   - "I enjoy coding web applications"
   - "Dogs are loyal pets"
   - "Cats are independent animals"
   - "Pets bring joy to families"
   - "The weather is sunny today"
   - "It's raining outside"
   ```
3. Compare all pairs and find:
   - Most similar pair
   - Least similar pair
   - All pairs with similarity > 0.8
4. Display results with scores

**Success Criteria**:
- Correctly calculates similarity for all pairs
- Identifies semantic relationships (e.g., programming pairs cluster)
- Clear formatted output with scores

**Hints**:
```typescript
// 1. Import required modules
import { createEmbeddingsModel } from "@/scripts/create-model.js";
import "dotenv/config";

// 2. Create embeddings instance
const embeddings = createEmbeddingsModel();

// 3. Generate embeddings for all sentences
const sentences = ["sentence 1", "sentence 2", ...];
const allEmbeddings = await embeddings.embedDocuments(sentences);

// 4. Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magA * magB);
}

// 5. Compare all pairs using nested loops
for (let i = 0; i < sentences.length; i++) {
  for (let j = i + 1; j < sentences.length; j++) {
    const score = cosineSimilarity(allEmbeddings[i], allEmbeddings[j]);
    // Store results...
  }
}
```

---

## Bonus Challenge: Semantic Book Search 📚

**Goal**: Build a book recommendation system using semantic search.

**Tasks**:
1. Create `book-search.ts`
2. Create a vector store with these book summaries:
   ```typescript
   const books = [
     { title: "The AI Revolution", summary: "How artificial intelligence is transforming society and business" },
     { title: "JavaScript Mastery", summary: "Complete guide to modern web development with JavaScript" },
     { title: "Data Science Handbook", summary: "Statistical analysis and machine learning for beginners" },
     { title: "The Startup Playbook", summary: "Building and scaling technology companies from scratch" },
     { title: "Mystery at Midnight", summary: "A detective solves crimes in Victorian London" },
     { title: "Space Odyssey", summary: "Humans explore distant galaxies and alien civilizations" },
     { title: "Cooking Basics", summary: "Essential techniques for home chefs and food enthusiasts" },
     { title: "Python for Data", summary: "Using Python for data analysis and visualization" },
   ];
   ```
3. Implement search queries:
   - "books about programming"
   - "stories set in space"
   - "learning about AI and technology"
   - "cooking and recipes"
4. Return top 3 results with scores for each query

**Success Criteria**:
- Finds relevant books semantically (not just keywords)
- Returns appropriate number of results
- Shows similarity scores
- Works for varied query types

**Hints**:
```typescript
// 1. Import required modules
import { createEmbeddingsModel } from "@/scripts/create-model.js";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import "dotenv/config";

// 2. Create embeddings instance
const embeddings = createEmbeddingsModel();

// 3. Create documents from your books
const documents = books.map(book =>
  new Document({
    pageContent: book.summary,
    metadata: { title: book.title }
  })
);

// 4. Create vector store from documents
const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);

// 5. Perform similarity search with scores
const results = await vectorStore.similaritySearchWithScore("your query", 3);

// 6. Access results (each result is [document, score])
results.forEach(([doc, score], index) => {
  console.log(`${index + 1}. ${doc.metadata.title}`);
  console.log(`   Score: ${score}`);
});
```

---

## Submission Checklist

Before moving to Chapter 5:

- [ ] Challenge: Similarity explorer compares all pairs
- [ ] Bonus: Book search system works (optional)

---

## Solutions

Solutions available in [`solution/`](./solution/) folder. Try on your own first!

**Additional Examples**: Check out the [`samples/`](./samples/) folder for more examples including keyword vs semantic comparison, multilingual search, embedding visualization, chunking strategies, document organization, and web processing!

---

## Need Help?

- **Embeddings**: Review examples in [`code/`](./code/)
- **Similarity metrics**: Check cosine similarity in example 1
- **Vector stores**: See example 2
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## Next Steps

Ready for [Chapter 5: Function Calling & Tooling](../05-function-calling-tooling/README.md)!

Great work on understanding embeddings and semantic search! 🚀
