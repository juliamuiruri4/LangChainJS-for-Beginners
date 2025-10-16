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

// 2. Create embeddings and model
const embeddings = new OpenAIEmbeddings({
  model: process.env.AI_EMBEDDING_MODEL,
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY
});

const model = new ChatOpenAI({
  model: process.env.AI_MODEL,
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY
});

// 3. Create documents with metadata
const docs = [
  new Document({
    pageContent: "Your content here",
    metadata: { title: "Doc Title", source: "my-notes" }
  })
];

// 4. Create vector store and retriever
const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
const retriever = vectorStore.asRetriever({ k: 2 });

// 5. Create prompt template
const prompt = ChatPromptTemplate.fromTemplate(`
Answer based on context: {context}
Question: {input}
Answer with source attribution.
`);

// 6. Create RAG chain
const combineDocsChain = await createStuffDocumentsChain({ llm: model, prompt });
const ragChain = await createRetrievalChain({ retriever, combineDocsChain });

// 7. Query the chain
const response = await ragChain.invoke({ input: "Your question" });
console.log(response.answer);
console.log(response.context); // Retrieved documents
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
// 1. Import required modules (in addition to basic RAG imports)
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

// 2. Create history-aware retriever
const historyAwarePrompt = ChatPromptTemplate.fromMessages([
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"],
  ["user", "Generate a search query based on the conversation above"]
]);

const historyAwareRetriever = await createHistoryAwareRetriever({
  llm: model,
  retriever,
  rephrasePrompt: historyAwarePrompt,
});

// 3. Create answer prompt with history placeholder
const answerPrompt = ChatPromptTemplate.fromMessages([
  ["system", "Answer based on context: {context}"],
  new MessagesPlaceholder("chat_history"),
  ["user", "{input}"]
]);

// 4. Create conversational RAG chain
const combineDocsChain = await createStuffDocumentsChain({ llm: model, prompt: answerPrompt });
const conversationalRagChain = await createRetrievalChain({
  retriever: historyAwareRetriever,
  combineDocsChain,
});

// 5. Maintain chat history array
const chatHistory: (HumanMessage | AIMessage)[] = [];

// 6. Invoke with history
const response = await conversationalRagChain.invoke({
  input: userQuestion,
  chat_history: chatHistory
});

// 7. Update history after each exchange
chatHistory.push(new HumanMessage(userQuestion));
chatHistory.push(new AIMessage(response.answer));
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
