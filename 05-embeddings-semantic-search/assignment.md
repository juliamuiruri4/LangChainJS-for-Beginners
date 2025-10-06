# Chapter 5 Assignment: Embeddings & Semantic Search

## Overview

Practice creating embeddings, building vector stores, and performing semantic searches to understand how AI finds meaning in text.

## Prerequisites

- Completed [Chapter 5](./README.md)
- Run all four code examples
- Understand embeddings and similarity metrics

---

## Challenge 1: Similarity Explorer 🔬

**Goal**: Discover how embeddings capture semantic similarity.

**Tasks**:
1. Create `similarity-explorer.ts` in the `05-embeddings-semantic-search/code/` folder
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

---

## Challenge 2: Semantic Book Search 📚

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

---

## Challenge 3: Keyword vs. Semantic Comparison 🆚

**Goal**: Compare traditional keyword search with semantic search.

**Tasks**:
1. Create `search-comparison.ts`
2. Create a dataset of 10-15 articles about different topics
3. Implement two search functions:
   ```typescript
   // Keyword search (simple string matching)
   function keywordSearch(query: string, documents: string[]): string[]

   // Semantic search (using embeddings)
   async function semanticSearch(query: string, documents: string[]): Promise<string[]>
   ```
4. Test with queries that use synonyms:
   - "automobile" (should find "car" content)
   - "coding" (should find "programming" content)
   - "physician" (should find "doctor" content)
5. Display side-by-side comparison

**Success Criteria**:
- Keyword search shows limitations with synonyms
- Semantic search finds related content
- Clear visualization of differences
- Analysis of when to use each approach

---

## Challenge 4: Multi-lingual Semantic Search 🌍

**Goal**: Demonstrate that embeddings work across languages.

**Tasks**:
1. Create `multilingual-search.ts`
2. Create a vector store with sentences in different languages:
   ```typescript
   const sentences = [
     { text: "Hello, how are you?", lang: "en" },
     { text: "Bonjour, comment allez-vous?", lang: "fr" },
     { text: "Hola, ¿cómo estás?", lang: "es" },
     { text: "I love artificial intelligence", lang: "en" },
     { text: "J'adore l'intelligence artificielle", lang: "fr" },
     { text: "Me encanta la inteligencia artificial", lang: "es" },
   ];
   ```
3. Search with queries in one language
4. Show that it finds similar content in other languages
5. Display results with language tags and scores

**Success Criteria**:
- Finds semantically similar content across languages
- Properly displays language information
- Shows cross-lingual matching
- Explains why this works (multilingual embeddings)

---

## Bonus Challenge: Embedding Visualizer 📈

**Goal**: Visualize embeddings in 2D space.

**Tasks**:
1. Create `embedding-visualizer.ts`
2. Create embeddings for diverse topics
3. Use dimensionality reduction (t-SNE or PCA) to reduce to 2D
4. Output coordinates for visualization:
   ```json
   [
     { "text": "...", "x": 0.5, "y": 0.3, "category": "..." },
     ...
   ]
   ```
5. Save to JSON file
6. (Optional) Create simple HTML visualization

**Hint**: You can use `ml-pca` package:
```bash
npm install ml-pca
```

**Success Criteria**:
- Successfully reduces dimensions
- Similar topics cluster together
- Clear data output format
- Visual representation (if implemented)

---

## Submission Checklist

Before moving to Chapter 6:

- [ ] Challenge 1: Similarity explorer compares all pairs
- [ ] Challenge 2: Book search system works
- [ ] Challenge 3: Keyword vs semantic comparison complete
- [ ] Challenge 4: Multi-lingual search demonstrates cross-language matching
- [ ] Bonus: Embedding visualizer (optional)

---

## Solutions

Solutions available in [`solution/`](./solution/) folder. Try on your own first!

---

## Need Help?

- **Embeddings**: Review examples in [`code/`](./code/)
- **Similarity metrics**: Check cosine similarity in example 1
- **Vector stores**: See example 2
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## Next Steps

Ready for [Chapter 6: Building RAG Systems](../06-rag-systems/README.md)!

Great work on understanding embeddings and semantic search! 🚀
