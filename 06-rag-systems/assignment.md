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

**Hints**:
```typescript
// 1. Import required modules
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import "dotenv/config";

// 2. Create OpenAIEmbeddings and ChatOpenAI instances

// 3. Create an array of Document objects:
//    - Use your own content as pageContent
//    - Add metadata (title, source, etc.)

// 4. Create a MemoryVectorStore from your documents

// 5. Create a retriever from the vector store (use asRetriever with k parameter)

// 6. Create a ChatPromptTemplate that:
//    - Uses {context} for retrieved documents
//    - Uses {input} for the question
//    - Asks for source attribution

// 7. Create the RAG chain:
//    - Use createStuffDocumentsChain with model and prompt
//    - Use createRetrievalChain with retriever and combineDocsChain

// 8. Test with multiple questions and display answers with sources
```

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

**Success Criteria**:
- Maintains conversation context
- Handles follow-up questions correctly
- Clear indication of conversation state
- Option to reset conversation

**Hints**:
```typescript
// 1. Import additional modules for conversational RAG
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

// 2. Create a history-aware retriever:
//    - Build a prompt with MessagesPlaceholder for chat_history
//    - Use createHistoryAwareRetriever with model, retriever, and prompt

// 3. Create an answer prompt that includes:
//    - System message with {context} placeholder
//    - MessagesPlaceholder for chat_history
//    - User message with {input} placeholder

// 4. Build the conversational RAG chain:
//    - Create combineDocsChain with the answer prompt
//    - Create retrieval chain with history-aware retriever

// 5. Initialize an empty chat history array

// 6. For each user question:
//    - Invoke the chain with input and chat_history
//    - Display the answer
//    - Add HumanMessage and AIMessage to chat_history

// 7. Allow user to reset conversation or exit
```

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
