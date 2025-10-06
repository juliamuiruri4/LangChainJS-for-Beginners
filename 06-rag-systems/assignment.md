# Chapter 6 Assignment: Building RAG Systems

## Overview

Practice building Retrieval Augmented Generation systems that combine document retrieval with LLM generation for accurate, sourced answers.

## Prerequisites

- Completed [Chapter 6](./README.md)
- Run all code examples
- Understand RAG architecture and LCEL

---

## Challenge 1: Personal Knowledge Base Q&A 📚

**Goal**: Build a RAG system over your own documents.

**Tasks**:
1. Create `knowledge-base-rag.ts` in the `06-rag-systems/code/` folder
2. Gather 5-10 documents about a topic you know well:
   - Personal notes
   - Blog articles you've written
   - Documentation you've created
   - Or use sample text about a hobby/interest
3. Build a RAG system that:
   - Loads and chunks the documents
   - Creates a vector store
   - Answers questions with source attribution
4. Test with 5+ questions

**Success Criteria**:
- Loads documents successfully
- Provides accurate answers from your content
- Includes source citations
- Handles questions not in the knowledge base gracefully

---

## Challenge 2: Multi-Source RAG System 🗂️

**Goal**: Build a RAG system that handles multiple document types.

**Tasks**:
1. Create `multi-source-rag.ts`
2. Load documents from different sources:
   - Text files (.txt)
   - Markdown files (.md)
   - Web pages (at least 2 URLs)
3. Add metadata for each source type
4. Implement search that:
   - Shows which source type answered the question
   - Allows filtering by source type
   - Displays confidence scores
5. Create a CLI interface for querying

**Example Metadata**:
```typescript
{
  source_type: "text" | "markdown" | "web",
  source_url: "...",
  load_date: "2024-01-15",
  chunk_id: 1
}
```

**Success Criteria**:
- Successfully loads 3+ source types
- Metadata properly attached
- Source type visible in results
- Clean CLI interface

---

## Challenge 3: Conversational RAG 💬

**Goal**: Build a RAG system that maintains conversation history.

**Tasks**:
1. Create `conversational-rag.ts`
2. Combine RAG with conversation memory
3. Allow follow-up questions that reference previous context:
   ```
   User: "What is TypeScript?"
   Bot: "TypeScript is..."
   User: "What are its main benefits?" ← Should understand "its" refers to TypeScript
   ```
4. Implement conversation history management
5. Add option to start new conversation

**Technical Hints**:
```typescript
// Combine with ConversationChain or use MessagesPlaceholder in prompt
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "Answer based on context: {context}"],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);
```

**Success Criteria**:
- Maintains conversation context
- Handles follow-up questions correctly
- Clear indication of conversation state
- Option to reset conversation

---

## Challenge 4: RAG with Citation Generator 📝

**Goal**: Build a RAG system that provides detailed citations.

**Tasks**:
1. Create `citation-rag.ts`
2. Modify RAG to return answers with formatted citations
3. Citation format:
   ```
   Answer: [Your answer here]

   Sources:
   [1] Document Title - Page/Section (Relevance: 95%)
       "Relevant excerpt from document..."

   [2] Another Document - Chapter 3 (Relevance: 87%)
       "Another relevant excerpt..."
   ```
4. Add metadata for:
   - Document title
   - Section/page number
   - Relevance score
   - Excerpt from source
5. Format output professionally

**Success Criteria**:
- Citations include all required information
- Relevance scores displayed
- Excerpts show exact source text
- Professional formatting
- Multiple sources per answer

---

## Bonus Challenge: Hybrid Search RAG 🔬

**Goal**: Combine keyword and semantic search for better retrieval.

**Tasks**:
1. Create `hybrid-search-rag.ts`
2. Implement both search types:
   - Keyword search (BM25 or simple matching)
   - Semantic search (embeddings)
3. Combine results using:
   - Score fusion (e.g., weighted average)
   - Reciprocal rank fusion
4. Compare with semantic-only search
5. Show when hybrid performs better

**Algorithm Example**:
```typescript
// Pseudo-code
const keywordResults = bm25Search(query);
const semanticResults = vectorSearch(query);
const combined = fuseResults(keywordResults, semanticResults);
```

**Success Criteria**:
- Both search types implemented
- Results properly combined
- Comparison shows improvements
- Analysis of when hybrid helps

---

## Submission Checklist

Before moving to Chapter 7:

- [ ] Challenge 1: Personal knowledge base RAG works
- [ ] Challenge 2: Multi-source RAG handles different file types
- [ ] Challenge 3: Conversational RAG maintains context
- [ ] Challenge 4: Citation generator provides formatted sources
- [ ] Bonus: Hybrid search (optional)

---

## Solutions

Solutions available in [`solution/`](./solution/) folder. Try on your own first!

---

## Need Help?

- **RAG basics**: Review example 1
- **LCEL syntax**: Check example 2
- **Metadata**: See example 3
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## Next Steps

Ready for [Chapter 7: LangGraph: Agents & Tools](../07-langgraph-agents-tools/README.md)!

Excellent work building RAG systems! 🎉
