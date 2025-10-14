# Chapter 6 Assignment: Building RAG Systems

## Overview

Practice building Retrieval Augmented Generation systems that combine document retrieval with LLM generation for accurate, sourced answers.

## Prerequisites

- Completed [Chapter 6](./README.md)
- Run all code examples
- Understand RAG architecture and LCEL

---

## Challenge: Personal Knowledge Base Q&A 📚

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

## Bonus Challenge: Conversational RAG 💬

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

## Submission Checklist

Before moving to Chapter 7:

- [ ] Challenge: Personal knowledge base RAG works
- [ ] Bonus: Conversational RAG maintains context (optional)

---

## Solutions

Solutions available in [`solution/`](./solution/) folder. Try on your own first!

**Additional Examples**: Check out the [`samples/`](./samples/) folder for more examples including multi-source RAG, citation generation, and hybrid search techniques!

---

## Need Help?

- **RAG basics**: Review example 1
- **LCEL syntax**: Check example 2
- **Metadata**: See example 3
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## Next Steps

Ready for [Chapter 7: Agents & MCP](../07-agents-mcp/README.md)!

Excellent work building RAG systems! 🎉
