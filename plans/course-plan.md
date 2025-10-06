# LangChain.js for Beginners - Course Plan

## Course Overview

This course introduces developers to LangChain.js, a framework for building AI-powered applications using Large Language Models (LLMs). Starting from foundational concepts and progressing to understanding agent orchestration with LangGraph, students will learn how to build real-world AI applications using TypeScript/JavaScript and Node.js.

**Target Audience**: Developers with JavaScript/TypeScript knowledge and basic understanding of Generative AI concepts.

**Prerequisites**:
- JavaScript/TypeScript fundamentals
- Node.js basics
- Understanding of async/await
- Basic Generative AI concepts (covered in prerequisite course: "GenAI for JavaScript Developers")

**Learning Outcomes**:
By the end of this course, students will be able to:
- Build AI-powered applications using LangChain.js and Azure AI Foundry
- Work with multiple LLM providers and switch between them seamlessly
- Implement Retrieval Augmented Generation (RAG) systems
- Understand how to use LangGraph to orchestrate AI workflows
- Create interactive AI agents with tools and memory
- Apply best practices for production-ready AI applications

**Course Philosophy**:
This course emphasizes learning through doing. Each chapter builds on previous knowledge while introducing new concepts through:
- **Real-world analogies**: Technical concepts explained using familiar everyday scenarios
- **Hands-on examples**: Simple, runnable code that demonstrates core features
- **Progressive complexity**: Starting simple and adding layers of sophistication
- **Practical challenges**: End-of-chapter exercises to reinforce learning

---

## README.md Introduction

```markdown
# 🦜🔗 LangChain.js for Beginners

Welcome to **LangChain.js for Beginners** - your complete guide to building AI-powered applications with JavaScript and TypeScript!

## What You'll Build

By the end of this course, you'll know how to:
- ✅ Create intelligent chatbots that remember conversation context
- ✅ Build search engines that understand meaning, not just keywords
- ✅ Develop AI agents that can use tools and make decisions
- ✅ Construct Retrieval Augmented Generation (RAG) systems
- ✅ Build multi-step AI workflows with LangGraph

## Why LangChain.js?

Think of building an AI application like cooking a gourmet meal. You could source ingredients from scratch, create every sauce from base components, and build your own cooking tools—or you could use a well-stocked kitchen with quality ingredients and proven recipes. LangChain.js is that well-stocked kitchen for AI development.

LangChain.js provides:
- 🔌 **Model Flexibility**: Switch between AI providers (OpenAI, Anthropic, Azure, etc.) with minimal code changes
- 🧩 **Pre-built Components**: Reusable building blocks for common AI patterns
- 🔄 **Easy Integration**: Connect LLMs with your data, APIs, and tools
- 🎯 **Production Ready**: Built-in features for monitoring, debugging, and scaling

## Course Structure

This course contains **10 chapters**, each focusing on a specific aspect of LangChain.js:

1. **Introduction to LangChain.js** - Understanding the framework and setting up your environment
2. **Your First LLM Application** - Chat models, messages, and making your first API call
3. **Prompt Engineering with Templates** - Creating dynamic, reusable prompts
4. **Working with Documents** - Loading, splitting, and processing text data
5. **Embeddings & Semantic Search** - Understanding vector representations and similarity
6. **Building RAG Systems** - Combining retrieval with generation for accurate answers
7. **Agents & Tools** - Creating AI that can take actions and use external tools
8. **Memory & Conversations** - Building stateful chatbots with context awareness
9. **Production Best Practices** - Model switching, Azure AI Foundry, and deployment
10. **Introduction to LangGraph** - Orchestrating AI agent workflows

## Prerequisites

Before starting this course, you should be comfortable with:
- JavaScript/TypeScript fundamentals
- Node.js and npm
- Async/await and Promises
- Basic Generative AI concepts (covered in our "GenAI for JavaScript Developers" course)

## Getting Started

Each chapter is self-contained with:
- 📖 **Conceptual explanations** with real-world analogies
- 💻 **Working code examples** you can run immediately
- 🎯 **Hands-on challenges** to test your understanding
- 🔑 **Key takeaways** to reinforce learning

### Setup

```bash
# Clone this repository
git clone https://github.com/yourusername/langchainjs-for-beginners.git

# Navigate to the project
cd langchainjs-for-beginners

# Install dependencies
npm install
```

### API Keys

This course starts out using **GitHub Models** (free for all GitHub users!) and later transitions to **Azure AI Foundry** for production scenarios.

## Learning Path

Each chapter builds on the previous one, but you can also jump to specific topics of interest. We recommend following the sequence for the best learning experience.

## Support & Community

- 💬 **Issues**: Found a bug or have a question? [Open an issue](https://github.com/yourusername/langchainjs-for-beginners/issues)
- 🌟 **Star this repo** if you find it helpful!
- 🤝 **Contribute**: Pull requests are welcome

If you get stuck or have any questions about building AI apps, join:

[![Azure AI Foundry Discord](https://img.shields.io/badge/Discord-Azure_AI_Foundry_Community_Discord-blue?style=for-the-badge&logo=discord&color=5865f2&logoColor=fff)](https://aka.ms/foundry/discord)

If you have product feedback or errors while building visit:

[![Azure AI Foundry Developer Forum](https://img.shields.io/badge/GitHub-Azure_AI_Foundry_Developer_Forum-blue?style=for-the-badge&logo=github&color=000000&logoColor=fff)](https://aka.ms/foundry/forum)

## Additional Resources

- [LangChain.js Official Documentation](https://js.langchain.com/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraphjs/)
- [GitHub Models](https://github.com/marketplace/models)
- [Azure AI Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/)

---

**Ready to build amazing AI applications?** Let's get started with [Chapter 1: Introduction to LangChain.js](./01-introduction/README.md)! 🚀
```

---

## Chapter Breakdown

### Chapter 1: Introduction to LangChain.js

**Learning Objectives**:
- Understand what LangChain.js is and why it exists
- Recognize common AI application patterns
- Set up a development environment
- Make your first LLM call using GitHub Models

**Analogy/Story**:
"Imagine you're building a house. You could manufacture your own bricks, create cement from scratch, and forge your own tools—or you could use a hardware store that provides quality materials and proven tools. LangChain.js is the hardware store for AI development, providing pre-built, tested components so you can focus on building your application, not reinventing the wheel."

**Content**:
1. What is LangChain.js?
   - The abstraction layer for LLMs
   - Component-based architecture
   - When to use LangChain.js vs. direct API calls

2. Core Concepts Overview
   - Models (Chat Models, LLMs, Embeddings)
   - Prompts (Templates and composition)
   - Chains (LCEL - LangChain Expression Language)
   - Agents (Decision-making AI)
   - Memory (Maintaining context)

3. Environment Setup
   - Node.js and npm
   - Installing LangChain.js packages
   - GitHub Models access (free!)
   - Azure AI Foundry overview (for later chapters)
   - Project structure best practices

**Code Samples**:
```typescript
// Example 1: Hello World with LangChain.js and GitHub Models
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
async function main() {
  const model = new ChatOpenAI({
    model: "gpt-4o", // ✅ correct property is model, not modelName
    configuration: {
      baseURL: "https://models.inference.ai.azure.com",
    },
    apiKey: process.env.GITHUB_TOKEN!,
  });
  // Example 1: Simple string prompt
  const response1 = await model.invoke("What is LangChain in one sentence?");
  console.log(response1.content);
  // Example 2: Structured messages
  const messages = [
    new SystemMessage("You are a helpful AI assistant."),
    new HumanMessage("Explain quantum computing to a 10-year-old."),
  ];
  const response2 = await model.invoke(messages);
  console.log(response2.content);
}
main().catch(console.error);
```

**Challenges/Exercises**:
1. **Setup Challenge**: Install all required packages and verify your GitHub Models access
2. **First Interaction**: Create a program that asks the LLM to explain three programming concepts
3. **Message Types**: Experiment with SystemMessage, HumanMessage, and observe how system prompts affect responses
4. **Model Comparison**: Call the same prompt with different models (gpt-4o, gpt-4o-mini) and compare outputs

**Key Takeaways**:
- LangChain.js provides abstraction over different LLM providers
- The framework is built on composable components
- GitHub Models offers free access to LLMs
- Messages have different types (System, Human, AI) with specific purposes

---

### Chapter 2: Chat Models & Basic Interactions

**Learning Objectives**:
- Understand the difference between Chat Models and Completion Models
- Work with different message types
- Handle streaming responses
- Implement error handling and retries

**Analogy/Story**:
"Think of a Chat Model like having a conversation with a knowledgeable friend. You don't just shout questions into the void (like old completion models); instead, you have a back-and-forth dialogue where context matters. You can set the tone (system message), ask questions (human message), and receive thoughtful responses (AI message)."

**Content**:
1. Chat Models vs. Completion Models
   - When to use each
   - Message-based interaction paradigm
   - Conversation structure

2. Message Types Deep Dive
   - SystemMessage: Setting behavior and context
   - HumanMessage: User input
   - AIMessage: Model responses
   - ToolMessage: Function call results (preview)

3. Streaming Responses
   - Why streaming matters for UX
   - Implementing token-by-token streaming
   - Handling stream interruptions

4. Error Handling
   - Rate limits and retries
   - Timeout handling
   - Graceful degradation

**Code Samples**:
```typescript
// Example 1: Multi-turn Conversation
const messages = [
  new SystemMessage("You are a creative writing assistant."),
  new HumanMessage("Write a story opening about a robot."),
];

const response1 = await model.invoke(messages);
messages.push(response1); // Add AI response to history

messages.push(new HumanMessage("Now make it more mysterious."));
const response2 = await model.invoke(messages);
console.log(response2.content);

// Example 2: Streaming Responses
import { ChatOpenAI } from "@langchain/openai";

const streamingModel = new ChatOpenAI({
  modelName: "gpt-4o",
  streaming: true,
  configuration: {
    baseURL: "https://models.inference.ai.azure.com",
  },
  apiKey: process.env.GITHUB_TOKEN,
});

const stream = await streamingModel.stream("Write a haiku about TypeScript");

for await (const chunk of stream) {
  process.stdout.write(chunk.content);
}

// Example 3: Error Handling with Retries
import { ChatOpenAI } from "@langchain/openai";

const robustModel = new ChatOpenAI({
  modelName: "gpt-4o",
  maxRetries: 3,
  timeout: 10000,
  configuration: {
    baseURL: "https://models.inference.ai.azure.com",
  },
  apiKey: process.env.GITHUB_TOKEN,
});

try {
  const response = await robustModel.invoke("Tell me a joke");
  console.log(response.content);
} catch (error) {
  console.error("Failed after retries:", error.message);
}
```

**Challenges/Exercises**:
1. **Conversation Builder**: Create a 5-turn conversation where each response builds on the previous one
2. **Streaming Logger**: Build a streaming response that shows each token with a timestamp
3. **Personality Switcher**: Use SystemMessage to create three different personalities (professional, casual, poetic) and show how the same question gets different responses
4. **Retry Simulator**: Create a function that deliberately triggers rate limits and observe retry behavior

**Key Takeaways**:
- Chat models use messages to maintain conversation context
- SystemMessage is useful for controlling model behavior
- Streaming improves user experience for long responses
- Proper error handling prevents application crashes

---

### Chapter 3: Prompt Engineering with Templates

**Learning Objectives**:
- Create reusable prompt templates
- Use variables and dynamic content
- Implement few-shot prompting
- Combine multiple prompts together

**Analogy/Story**:
"Think of prompt templates like mail merge in a word processor. Instead of writing each email from scratch, you create a template with placeholders (Dear {name}, Your order {orderId} is ready...) and fill in the specifics. Prompt templates work the same way—create once, reuse everywhere, ensuring consistency while allowing flexibility."

**Content**:
1. Why Prompt Templates?
   - Consistency across your application
   - Easier testing and iteration
   - Separation of logic and prompts
   - Version control for prompts

2. Creating Basic Templates
   - ChatPromptTemplate
   - Variable substitution
   - Template formatting

3. Few-Shot Prompting
   - Teaching by example
   - Example selectors
   - Dynamic example selection

4. Prompt Composition
   - Combining multiple templates
   - Partial templates
   - Template inheritance

**Code Samples**:
```typescript
// Example 1: Basic Prompt Template
import { ChatPromptTemplate } from "@langchain/core/prompts";

const template = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that translates {input_language} to {output_language}."],
  ["human", "{text}"],
]);

const prompt = await template.invoke({
  input_language: "English",
  output_language: "French",
  text: "Hello, how are you?",
});

const response = await model.invoke(prompt);
console.log(response.content);

// Example 2: Few-Shot Prompting
import { FewShotChatMessagePromptTemplate } from "@langchain/core/prompts";

const examples = [
  { input: "happy", output: "sad" },
  { input: "tall", output: "short" },
  { input: "hot", output: "cold" },
];

const examplePrompt = ChatPromptTemplate.fromMessages([
  ["human", "{input}"],
  ["ai", "{output}"],
]);

const fewShotPrompt = new FewShotChatMessagePromptTemplate({
  examples,
  examplePrompt,
});

const finalPrompt = ChatPromptTemplate.fromMessages([
  ["system", "Give the antonym of every input"],
  fewShotPrompt,
  ["human", "{input}"],
]);

const response = await model.invoke(
  await finalPrompt.invoke({ input: "bright" })
);
console.log(response.content); // Should output something like "dark"

// Example 3: Template Composition
import { ChatPromptTemplate } from "@langchain/core/prompts";

const systemTemplate = "You are a helpful {role}.";
const humanTemplate = "Answer this question: {question}";

const basePrompt = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["human", humanTemplate],
]);

// Use the same template for different roles
const responses = [];

for (const role of ["chef", "programmer", "historian"]) {
  const prompt = await basePrompt.invoke({
    role,
    question: "What are the most important skills in your field?",
  });
  const response = await model.invoke(prompt);
  responses.push({ role, answer: response.content });
}

console.log(responses);
```

**Challenges/Exercises**:
1. **Email Generator**: Create a template for different types of business emails (welcome, notification, reminder)
2. **Few-Shot Classifier**: Build a sentiment classifier using 5 examples of positive/negative text
3. **Multi-Language Template**: Create a template that works in 3 languages by passing language as a variable
4. **Dynamic Example Selection**: Create a system that selects the most relevant few-shot examples based on the user's input

**Key Takeaways**:
- Templates make prompts reusable and testable
- Few-shot prompting improves accuracy without fine-tuning
- Variable substitution enables dynamic, context-aware prompts
- Template composition promotes code reuse and maintainability

---

### Chapter 4: Working with Documents

**Learning Objectives**:
- Load documents from various sources
- Split long documents into manageable chunks
- Understand chunking strategies and their trade-offs
- Prepare documents for vector storage

**Analogy/Story**:
"Imagine you're organizing a massive library. You can't hand someone the entire encyclopedia when they ask about 'photosynthesis'—you need to break it down into chapters, then pages, then paragraphs. Document processing is like being a librarian who knows exactly how to divide, organize, and retrieve information so it's useful, not overwhelming."

**Content**:
1. Document Loaders
   - Loading from text files
   - PDF documents
   - Web pages
   - JSON and CSV data

2. Text Splitting Strategies
   - Character-based splitting
   - Recursive character splitting
   - Token-based splitting
   - Semantic chunking

3. Chunk Size and Overlap
   - Finding the right chunk size
   - Why overlap matters
   - Trade-offs in chunk configuration

4. Document Metadata
   - Preserving source information
   - Adding custom metadata
   - Using metadata for filtering

**Code Samples**:
```typescript
// Example 1: Loading and Splitting a Text File
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const loader = new TextLoader("./data/article.txt");
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const splitDocs = await splitter.splitDocuments(docs);

console.log(`Original document: ${docs[0].pageContent.length} characters`);
console.log(`Split into ${splitDocs.length} chunks`);
console.log(`First chunk: ${splitDocs[0].pageContent}`);

// Example 2: Loading a PDF
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const pdfLoader = new PDFLoader("./data/guide.pdf");
const pdfDocs = await pdfLoader.load();

console.log(`Loaded ${pdfDocs.length} pages from PDF`);
pdfDocs.forEach((doc, i) => {
  console.log(`Page ${i + 1} metadata:`, doc.metadata);
});

// Example 3: Web Page Loading
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

const webLoader = new CheerioWebBaseLoader(
  "https://js.langchain.com/docs/introduction/"
);
const webDocs = await webLoader.load();

const webSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});

const webChunks = await webSplitter.splitDocuments(webDocs);
console.log(`Loaded and split web page into ${webChunks.length} chunks`);

// Example 4: Adding Custom Metadata
import { Document } from "@langchain/core/documents";

const docs = [
  new Document({
    pageContent: "LangChain simplifies LLM application development.",
    metadata: { source: "documentation", topic: "introduction", difficulty: "beginner" },
  }),
  new Document({
    pageContent: "LangGraph enables multi-step agent workflows.",
    metadata: { source: "documentation", topic: "agents", difficulty: "intermediate" },
  }),
];

// Later, you can filter by metadata
const beginnerDocs = docs.filter(doc => doc.metadata.difficulty === "beginner");
console.log(beginnerDocs);
```

**Challenges/Exercises**:
1. **Multi-Format Loader**: Create a utility that loads and splits documents from .txt, .pdf, and .md files in a directory
2. **Chunk Size Experimenter**: Load a long document and split it with different chunk sizes (500, 1000, 2000). Compare the results.
3. **Smart Splitter**: Create a splitter that keeps code blocks intact (doesn't split in the middle of a function)
4. **Metadata Enricher**: Load documents and automatically add metadata like word count, reading time, and detected language

**Key Takeaways**:
- Different document types require different loaders
- Chunk size and overlap significantly impact retrieval quality
- Recursive splitting respects natural document structure
- Metadata enables organized filtering and searching

---

### Chapter 5: Embeddings & Semantic Search

**Learning Objectives**:
- Understand what embeddings are and how they work
- Create embeddings for text
- Store embeddings in vector databases
- Perform semantic similarity searches
- Choose the right vector store for your use case

**Analogy/Story**:
"Imagine you're at a massive party where everyone is wearing a name tag with numbers representing their interests: [music: 0.8, sports: 0.3, tech: 0.9]. To find people you'd vibe with, you don't read their life stories—you compare number tags. If your tag is [music: 0.7, sports: 0.1, tech: 0.95], you'd naturally gravitate toward the [0.8, 0.3, 0.9] person. Embeddings work the same way: they convert text into number arrays, making it easy to find similar content mathematically."

**Content**:
1. What Are Embeddings?
   - Vector representations of text
   - Capturing semantic meaning
   - Dimensionality (384, 768, 1536 dimensions)
   - Embedding models overview

2. Creating Embeddings
   - Using OpenAI embeddings
   - Using open-source alternatives
   - Batch processing for efficiency

3. Vector Stores
   - In-memory stores (for development)
   - Production vector databases (Pinecone, Weaviate, Chroma)
   - Similarity search fundamentals

4. Similarity Metrics
   - Cosine similarity
   - Euclidean distance
   - Dot product
   - Which to use when

**Code Samples**:
```typescript
// Example 1: Creating Embeddings
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
  configuration: {
    baseURL: "https://models.inference.ai.azure.com",
  },
  apiKey: process.env.GITHUB_TOKEN,
});

const text = "LangChain makes building AI apps easier";
const embedding = await embeddings.embedQuery(text);

console.log(`Embedding dimensions: ${embedding.length}`);
console.log(`First 5 values: ${embedding.slice(0, 5)}`);

// Example 2: In-Memory Vector Store
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";

const docs = [
  new Document({ pageContent: "Cats are independent pets that love to nap." }),
  new Document({ pageContent: "Dogs are loyal companions that enjoy playing fetch." }),
  new Document({ pageContent: "Birds can sing beautiful songs and fly freely." }),
  new Document({ pageContent: "Fish are quiet pets that live in aquariums." }),
];

const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

// Semantic search
const results = await vectorStore.similaritySearch("animals that live indoors", 2);

console.log("Most similar documents:");
results.forEach((doc, i) => {
  console.log(`${i + 1}. ${doc.pageContent}`);
});

// Example 3: Similarity Search with Scores
const resultsWithScores = await vectorStore.similaritySearchWithScore(
  "pets that need less attention",
  3
);

console.log("Search results with similarity scores:");
resultsWithScores.forEach(([doc, score]) => {
  console.log(`Score: ${score.toFixed(3)} - ${doc.pageContent}`);
});

// Example 4: Batch Embedding for Efficiency
const texts = [
  "Machine learning is a subset of AI",
  "Deep learning uses neural networks",
  "Natural language processing handles text",
  "Computer vision processes images",
];

const batchEmbeddings = await embeddings.embedDocuments(texts);

console.log(`Created ${batchEmbeddings.length} embeddings`);
console.log(`Each with ${batchEmbeddings[0].length} dimensions`);
```

**Challenges/Exercises**:
1. **Similarity Explorer**: Create embeddings for 10 different sentences and find which pairs are most similar
2. **Document Library**: Build a small vector store of book summaries and search for books by theme
3. **Keyword vs Semantic**: Compare traditional keyword search with semantic search on the same dataset
4. **Embedding Visualizer**: Use dimensionality reduction (t-SNE or PCA) to visualize embeddings in 2D space

**Key Takeaways**:
- Embeddings capture semantic meaning as numerical vectors
- Vector stores enable fast similarity search at scale
- Semantic search finds meaning, not just matching keywords
- Batch processing improves efficiency when creating many embeddings

---

### Chapter 6: Building RAG (Retrieval Augmented Generation) Systems

**Learning Objectives**:
- Understand the RAG architecture
- Build a question-answering system over custom documents
- Implement different retrieval strategies
- Improve RAG accuracy with re-ranking and filtering
- Chain retrieval with generation using LCEL

**Analogy/Story**:
"Think of RAG like an open-book exam versus a closed-book exam. In a closed-book exam (standard LLM), you rely purely on what you've memorized, which might be outdated or incomplete. In an open-book exam (RAG), you can look up specific information in your textbooks (vector store) and then synthesize an answer. You get accuracy from the books, plus the intelligence to interpret and explain the information."

**Content**:
1. What is RAG?
   - The retrieval-augmentation pattern
   - When to use RAG vs fine-tuning
   - RAG architecture components

2. Building Your First RAG System
   - Document ingestion pipeline
   - Creating a retriever
   - Combining retrieval with generation

3. LangChain Expression Language (LCEL)
   - Chaining components
   - Pipe operator
   - Parallel execution

4. Improving RAG Quality
   - Re-ranking results
   - Metadata filtering
   - Multi-query retrieval
   - Contextual compression

**Code Samples**:
```typescript
// Example 1: Basic RAG System
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

// 1. Create vector store from documents
const embeddings = new OpenAIEmbeddings({
  configuration: { baseURL: "https://models.inference.ai.azure.com" },
  apiKey: process.env.GITHUB_TOKEN,
});

const docs = [
  "LangChain.js was released in 2023 as a JavaScript/TypeScript port of LangChain.",
  "LangChain Expression Language (LCEL) enables composition of chains.",
  "Vector stores in LangChain include Pinecone, Weaviate, and Chroma.",
  "LangGraph is used for building multi-step agent workflows.",
];

const vectorStore = await MemoryVectorStore.fromTexts(docs, {}, embeddings);
const retriever = vectorStore.asRetriever({ k: 2 });

// 2. Create the RAG chain
const model = new ChatOpenAI({
  modelName: "gpt-4o",
  configuration: { baseURL: "https://models.inference.ai.azure.com" },
  apiKey: process.env.GITHUB_TOKEN,
});

const prompt = ChatPromptTemplate.fromTemplate(`
Answer the question based only on the following context:

{context}

Question: {input}
`);

const combineDocsChain = await createStuffDocumentsChain({
  llm: model,
  prompt,
});

const ragChain = await createRetrievalChain({
  retriever,
  combineDocsChain,
});

// 3. Ask questions
const response = await ragChain.invoke({
  input: "When was LangChain.js released?",
});

console.log(response.answer);
console.log("\nSource documents:", response.context);

// Example 2: RAG with LCEL
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";

const formatDocs = (docs) => docs.map((doc) => doc.pageContent).join("\n\n");

const ragChainLCEL = RunnableSequence.from([
  {
    context: (input) => retriever.invoke(input.question).then(formatDocs),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

const result = await ragChainLCEL.invoke({
  question: "What is LCEL?",
});

console.log(result);

// Example 3: RAG with Metadata Filtering
import { Document } from "@langchain/core/documents";

const docsWithMetadata = [
  new Document({
    pageContent: "Python is great for data science",
    metadata: { language: "python", topic: "data-science" },
  }),
  new Document({
    pageContent: "JavaScript is perfect for web development",
    metadata: { language: "javascript", topic: "web-dev" },
  }),
  new Document({
    pageContent: "TypeScript adds type safety to JavaScript",
    metadata: { language: "typescript", topic: "web-dev" },
  }),
];

const metadataVectorStore = await MemoryVectorStore.fromDocuments(
  docsWithMetadata,
  embeddings
);

// Create a retriever with metadata filter
const filteredRetriever = metadataVectorStore.asRetriever({
  filter: { language: "javascript" },
  k: 2,
});

const docs = await filteredRetriever.invoke("best language for building websites");
console.log(docs); // Will only return JavaScript-related docs

// Example 4: Multi-Query Retrieval
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";

const multiQueryRetriever = MultiQueryRetriever.fromLLM({
  llm: model,
  retriever: vectorStore.asRetriever(),
});

// This will generate multiple search queries and combine results
const results = await multiQueryRetriever.invoke(
  "How do I compose chains in LangChain?"
);

console.log(`Retrieved ${results.length} documents from multiple queries`);
```

**Challenges/Exercises**:
1. **Personal Knowledge Base**: Create a RAG system over your own notes or documentation
2. **Multi-Document RAG**: Build a system that can answer questions across different file types (PDF, TXT, MD)
3. **Source Citation**: Modify the RAG chain to include source citations with each answer
4. **Accuracy Comparison**: Compare answer quality with different chunk sizes and retrieval strategies

**Key Takeaways**:
- RAG combines retrieval (finding info) with generation (creating answers)
- LCEL provides a clean syntax for chaining components
- Metadata filtering improves retrieval precision
- Multi-query retrieval helps answer detailed questions

---

### Chapter 7: Agents & Tools

**Learning Objectives**:
- Understand what agents are and when to use them
- Create custom tools for agents
- Build a ReAct agent
- Implement tool calling with function definitions
- Handle agent errors and loops

**Analogy/Story**:
"Imagine you're a manager (the LLM) with a team of specialists (tools): a researcher who can search the web, an accountant who can calculate finances, and an assistant who can send emails. When someone asks 'What's the weather in Tokyo and how much would a flight there cost?', you don't do everything yourself. You think (reasoning), decide which specialists to consult (action), gather their reports (observation), and synthesize a final answer. That's exactly how agents work—they think, act, observe, and repeat until they solve the problem."

**Content**:
1. What Are Agents?
   - Agents vs. chains
   - The ReAct (Reasoning + Acting) framework
   - When agents are the right choice

2. Creating Custom Tools
   - Tool definition and description
   - Input schemas
   - Tool execution

3. Building Agents
   - Agent executors
   - Tool selection
   - Prompt engineering for agents

4. Agent Patterns
   - ReAct agents
   - OpenAI Functions agents
   - Structured chat agents
   - Error handling and max iterations

**Code Samples**:
```typescript
// Example 1: Creating a Simple Tool
import { DynamicTool } from "@langchain/core/tools";

const calculatorTool = new DynamicTool({
  name: "calculator",
  description: "Useful for performing mathematical calculations. Input should be a mathematical expression.",
  func: async (input: string) => {
    try {
      // Note: In production, use a safe math parser
      const result = eval(input);
      return `The result is: ${result}`;
    } catch (error) {
      return "Error: Invalid mathematical expression";
    }
  },
});

// Test the tool
const result = await calculatorTool.invoke("15 * 7 + 3");
console.log(result);

// Example 2: Building a ReAct Agent
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { pull } from "langchain/hub";

const tools = [calculatorTool];

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0,
  configuration: { baseURL: "https://models.inference.ai.azure.com" },
  apiKey: process.env.GITHUB_TOKEN,
});

// Pull the ReAct prompt from LangChain Hub
const prompt = await pull("hwchase17/react");

const agent = await createReactAgent({
  llm: model,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: true,
});

const response = await agentExecutor.invoke({
  input: "What is 25 multiplied by 4, then add 17?",
});

console.log(response.output);

// Example 3: Custom Tool with Input Schema
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const weatherTool = new DynamicStructuredTool({
  name: "get_weather",
  description: "Get the current weather for a location",
  schema: z.object({
    location: z.string().describe("The city and country, e.g., Tokyo, Japan"),
    units: z.enum(["celsius", "fahrenheit"]).default("celsius"),
  }),
  func: async ({ location, units }) => {
    // In production, call a real weather API
    return `The weather in ${location} is 22°${units === "celsius" ? "C" : "F"} and sunny.`;
  },
});

const weatherAgent = new AgentExecutor({
  agent: await createReactAgent({
    llm: model,
    tools: [weatherTool],
    prompt: await pull("hwchase17/react"),
  }),
  tools: [weatherTool],
});

const weatherResponse = await weatherAgent.invoke({
  input: "What's the weather like in Paris, France?",
});

console.log(weatherResponse.output);

// Example 4: Multi-Tool Agent
import { WebBrowser } from "langchain/tools/webbrowser";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  configuration: { baseURL: "https://models.inference.ai.azure.com" },
  apiKey: process.env.GITHUB_TOKEN,
});

const browser = new WebBrowser({ model, embeddings });

const multiToolAgent = new AgentExecutor({
  agent: await createReactAgent({
    llm: model,
    tools: [calculatorTool, weatherTool, browser],
    prompt: await pull("hwchase17/react"),
  }),
  tools: [calculatorTool, weatherTool, browser],
  maxIterations: 10,
  verbose: true,
});

const multiResponse = await multiToolAgent.invoke({
  input: "What's 15% of 200, and what's the weather in Seattle?",
});

console.log(multiResponse.output);
```

**Challenges/Exercises**:
1. **Custom Tool Builder**: Create 3 custom tools (e.g., string reverser, word counter, language detector)
2. **Research Agent**: Build an agent that can search Wikipedia and answer questions with citations
3. **Math Tutor Agent**: Create an agent with calculator and explanation tools that helps solve math problems
4. **Error Handler**: Implement an agent that gracefully handles tool failures and retries

**Key Takeaways**:
- Agents can reason about which tools to use and when
- Tool descriptions are critical—they guide the agent's decision-making
- ReAct framework combines reasoning and acting iteratively
- Proper error handling prevents infinite loops

---

### Chapter 8: Memory & Conversation Management

**Learning Objectives**:
- Implement conversation history
- Use different memory types (buffer, summary, window)
- Build stateful chatbots
- Manage long conversations efficiently
- Implement conversation persistence

**Analogy/Story**:
"Imagine talking to someone with amnesia—every sentence is new to them, they don't remember what you just said 30 seconds ago. Frustrating, right? That's an LLM without memory. Now imagine talking to someone with perfect recall of your entire conversation, who can reference something you mentioned hours ago and build on it. That's an LLM with memory. The challenge is finding the balance: remember enough to be helpful, but not so much that you're overwhelmed by ancient history."

**Content**:
1. Why Memory Matters
   - Stateless vs. stateful conversations
   - User experience improvements
   - Context maintenance

2. Memory Types
   - Buffer memory (recent messages)
   - Summary memory (condensed history)
   - Window memory (sliding window)
   - Entity memory (tracking entities)

3. Implementing Conversation Chains
   - ConversationChain
   - Managing message history
   - Memory integration with LCEL

4. Production Considerations
   - Persisting memory to database
   - Managing token limits
   - Multi-user conversation handling

**Code Samples**:
```typescript
// Example 1: Buffer Memory
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  configuration: { baseURL: "https://models.inference.ai.azure.com" },
  apiKey: process.env.GITHUB_TOKEN,
});

const memory = new BufferMemory();

const chain = new ConversationChain({
  llm: model,
  memory,
});

// Multi-turn conversation
const response1 = await chain.invoke({
  input: "My name is Alex and I love TypeScript.",
});
console.log(response1.response);

const response2 = await chain.invoke({
  input: "What's my name and what do I love?",
});
console.log(response2.response);

// Inspect memory
const memoryVariables = await memory.loadMemoryVariables({});
console.log(memoryVariables);

// Example 2: Window Memory (Last N Messages)
import { BufferWindowMemory } from "langchain/memory";

const windowMemory = new BufferWindowMemory({ k: 3 }); // Only remember last 3 interactions

const windowChain = new ConversationChain({
  llm: model,
  memory: windowMemory,
});

// Simulate a long conversation
for (let i = 1; i <= 5; i++) {
  await windowChain.invoke({ input: `Message ${i}` });
}

// Memory will only contain last 3 messages
const vars = await windowMemory.loadMemoryVariables({});
console.log(vars);

// Example 3: Summary Memory
import { ConversationSummaryMemory } from "langchain/memory";

const summaryMemory = new ConversationSummaryMemory({
  llm: model,
});

const summaryChain = new ConversationChain({
  llm: model,
  memory: summaryMemory,
});

await summaryChain.invoke({
  input: "I'm planning a trip to Japan next spring. I want to visit Tokyo, Kyoto, and Osaka.",
});

await summaryChain.invoke({
  input: "I'm particularly interested in traditional temples and modern technology.",
});

await summaryChain.invoke({
  input: "What should I pack for my trip?",
});

// The summary memory has condensed the conversation
const summary = await summaryMemory.loadMemoryVariables({});
console.log(summary);

// Example 4: Message History with LCEL
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

const chain = prompt.pipe(model);

const messageHistory = new ChatMessageHistory();

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: () => messageHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

// Conversation with persistent history
const res1 = await chainWithHistory.invoke(
  { input: "My favorite color is blue." },
  { configurable: { sessionId: "user123" } }
);
console.log(res1.content);

const res2 = await chainWithHistory.invoke(
  { input: "What's my favorite color?" },
  { configurable: { sessionId: "user123" } }
);
console.log(res2.content);
```

**Challenges/Exercises**:
1. **Memory Comparison**: Build three chatbots with different memory types and compare their behavior
2. **Persistent Chatbot**: Create a chatbot that saves conversation history to a file
3. **Multi-User Chat**: Implement a system that manages separate conversation histories for different users
4. **Smart Summary**: Build a chatbot that automatically summarizes the conversation every 10 messages

**Key Takeaways**:
- Memory transforms stateless LLMs into stateful conversational agents
- Different memory types suit different use cases (buffer for short chats, summary for long ones)
- Message history management is crucial for token efficiency
- Production chatbots need persistent storage for conversations

---

### Chapter 9: Production Best Practices & Model Switching

**Learning Objectives**:
- Transition from GitHub Models to Azure AI Foundry
- Implement model-agnostic code
- Switch between providers seamlessly
- Implement monitoring and logging
- Handle rate limiting and costs
- Deploy LangChain.js applications

**Analogy/Story**:
"Building with a single LLM provider is like building a house that only works with one specific power company. What happens when that company raises prices, has an outage, or goes out of business? Smart builders design homes that can plug into any power source. Similarly, smart developers write code that can swap AI providers with a simple configuration change, not a complete rewrite."

**Content**:
1. Model Abstraction in LangChain.js
   - Provider-agnostic architecture
   - Configuration management
   - Environment variables

2. From GitHub Models to Azure AI Foundry
   - Setting up Azure AI Foundry
   - Deploying models
   - API key management
   - Cost considerations

3. Monitoring & Observability
   - LangSmith integration
   - Logging and tracing
   - Debugging chains
   - Performance metrics

4. Production Deployment
   - Error handling strategies
   - Rate limiting
   - Caching responses
   - Load balancing across providers

**Code Samples**:
```typescript
// Example 1: Model-Agnostic Configuration
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";

interface ModelConfig {
  provider: "github-models" | "azure-foundry" | "anthropic";
  modelName: string;
  apiKey: string;
  baseURL?: string;
}

function createModel(config: ModelConfig) {
  if (config.provider === "github-models") {
    return new ChatOpenAI({
      modelName: config.modelName,
      configuration: { baseURL: "https://models.inference.ai.azure.com" },
      apiKey: config.apiKey,
    });
  } else if (config.provider === "azure-foundry") {
    return new ChatOpenAI({
      modelName: config.modelName,
      configuration: { baseURL: config.baseURL },
      apiKey: config.apiKey,
    });
  } else if (config.provider === "anthropic") {
    return new ChatAnthropic({
      modelName: config.modelName,
      apiKey: config.apiKey,
    });
  }
}

// Configuration from environment
const modelConfig: ModelConfig = {
  provider: process.env.AI_PROVIDER as any,
  modelName: process.env.MODEL_NAME || "gpt-4o",
  apiKey: process.env.API_KEY!,
  baseURL: process.env.BASE_URL,
};

const model = createModel(modelConfig);

// Your application code remains the same!
const response = await model.invoke("Hello, world!");
console.log(response.content);

// Example 2: Azure AI Foundry Setup
import { AzureChatOpenAI } from "@langchain/openai";

const azureModel = new AzureChatOpenAI({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiInstanceName: process.env.AZURE_INSTANCE_NAME,
  azureOpenAIApiDeploymentName: "gpt-4o",
  azureOpenAIApiVersion: "2024-02-15-preview",
});

const azureResponse = await azureModel.invoke("What is Azure AI Foundry?");
console.log(azureResponse.content);

// Example 3: Fallback Strategy (Multiple Providers)
import { ChatOpenAI } from "@langchain/openai";

async function invokeWithFallback(input: string) {
  const providers = [
    {
      name: "Azure",
      model: new ChatOpenAI({
        configuration: { baseURL: process.env.AZURE_BASE_URL },
        apiKey: process.env.AZURE_API_KEY!,
      }),
    },
    {
      name: "GitHub Models",
      model: new ChatOpenAI({
        configuration: { baseURL: "https://models.inference.ai.azure.com" },
        apiKey: process.env.GITHUB_TOKEN!,
      }),
    },
  ];

  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name}...`);
      const response = await provider.model.invoke(input);
      console.log(`Success with ${provider.name}`);
      return response;
    } catch (error) {
      console.log(`${provider.name} failed, trying next provider...`);
    }
  }

  throw new Error("All providers failed");
}

const response = await invokeWithFallback("What is machine learning?");
console.log(response.content);

// Example 4: LangSmith Tracing
import { ChatOpenAI } from "@langchain/openai";

// Enable tracing
process.env.LANGCHAIN_TRACING_V2 = "true";
process.env.LANGCHAIN_API_KEY = process.env.LANGSMITH_API_KEY;
process.env.LANGCHAIN_PROJECT = "my-production-app";

const tracedModel = new ChatOpenAI({
  modelName: "gpt-4o",
  configuration: { baseURL: "https://models.inference.ai.azure.com" },
  apiKey: process.env.GITHUB_TOKEN,
});

// All invocations will be traced in LangSmith
const tracedResponse = await tracedModel.invoke("Explain LangSmith");
console.log(tracedResponse.content);

// View traces at: https://smith.langchain.com/

// Example 5: Response Caching
import { ChatOpenAI } from "@langchain/openai";
import { InMemoryCache } from "@langchain/core/caches";

const cache = new InMemoryCache();

const cachedModel = new ChatOpenAI({
  modelName: "gpt-4o",
  cache,
  configuration: { baseURL: "https://models.inference.ai.azure.com" },
  apiKey: process.env.GITHUB_TOKEN,
});

// First call - hits API
console.time("First call");
await cachedModel.invoke("What is LangChain?");
console.timeEnd("First call");

// Second call - uses cache (much faster!)
console.time("Second call (cached)");
await cachedModel.invoke("What is LangChain?");
console.timeEnd("Second call (cached)");
```

**Challenges/Exercises**:
1. **Provider Switcher**: Create a CLI tool that lets users switch between providers with a single command
2. **Cost Tracker**: Build a middleware that tracks API calls and estimates costs
3. **Smart Router**: Implement logic that routes simple queries to cheaper models and detailed ones to premium models
4. **Deployment Pipeline**: Set up a simple deployment for a LangChain.js app on Vercel or Azure

**Key Takeaways**:
- LangChain.js enables provider-agnostic code
- Configuration management is key to flexibility
- Monitoring and tracing are essential for production
- Fallback strategies improve reliability

---

### Chapter 10: Introduction to LangGraph - Building AI Agents

**Learning Objectives**:
- Understand what LangGraph is and when to use it
- Create state-based agent workflows
- Implement human-in-the-loop patterns
- Build multi-agent systems
- Visualize and debug agent execution

**Analogy/Story**:
"Imagine orchestrating a business process with multiple steps: first, collect customer requirements (node 1), then check inventory (node 2), if items are in stock, process payment (node 3a), otherwise, send a backorder notification (node 3b), finally, schedule delivery (node 4). This isn't a straight line—it has branches, conditions, and loops. LangGraph lets you model AI workflows the same way: as a graph of states and transitions, giving you control over agent behavior that goes beyond simple chains."

**Content**:
1. What is LangGraph?
   - Limitations of linear chains
   - State machines for AI agents
   - When to use LangGraph vs. chains

2. Core Concepts
   - State and state graphs
   - Nodes (functions that process state)
   - Edges (transitions between nodes)
   - Conditional edges

3. Building Your First Graph
   - Defining state schema
   - Adding nodes
   - Connecting with edges
   - Compiling and running

4. Common Patterns
   - Human-in-the-loop
   - Multi-agent collaboration
   - Cyclic workflows
   - Error handling in graphs

**Code Samples**:
```typescript
// Example 1: Simple Linear Graph
import { StateGraph, END } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

// Define the state
interface AgentState {
  messages: BaseMessage[];
  nextStep: string;
}

// Create the graph
const workflow = new StateGraph<AgentState>({
  channels: {
    messages: {
      value: (left: BaseMessage[], right: BaseMessage[]) => left.concat(right),
      default: () => [],
    },
    nextStep: {
      value: (left?: string, right?: string) => right ?? left ?? "",
      default: () => "",
    },
  },
});

// Add nodes
workflow.addNode("greet", async (state: AgentState) => {
  console.log("Greeting user...");
  return { nextStep: "process" };
});

workflow.addNode("process", async (state: AgentState) => {
  console.log("Processing request...");
  return { nextStep: "respond" };
});

workflow.addNode("respond", async (state: AgentState) => {
  console.log("Sending response...");
  return { nextStep: END };
});

// Add edges
workflow.addEdge("greet", "process");
workflow.addEdge("process", "respond");
workflow.addEdge("respond", END);

// Set entry point
workflow.setEntryPoint("greet");

// Compile and run
const app = workflow.compile();
const result = await app.invoke({ messages: [], nextStep: "" });

console.log("Workflow completed:", result);

// Example 2: Conditional Graph with Branching
import { ChatOpenAI } from "@langchain/openai";

interface ResearchState {
  query: string;
  needsResearch: boolean;
  research: string;
  response: string;
}

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  configuration: { baseURL: "https://models.inference.ai.azure.com" },
  apiKey: process.env.GITHUB_TOKEN,
});

const researchGraph = new StateGraph<ResearchState>({
  channels: {
    query: { value: (_, right) => right, default: () => "" },
    needsResearch: { value: (_, right) => right, default: () => false },
    research: { value: (_, right) => right, default: () => "" },
    response: { value: (_, right) => right, default: () => "" },
  },
});

// Node: Determine if research is needed
researchGraph.addNode("analyze", async (state: ResearchState) => {
  const prompt = `Does this question require external research? Answer only yes or no: "${state.query}"`;
  const response = await model.invoke(prompt);
  const needsResearch = response.content.toLowerCase().includes("yes");
  return { needsResearch };
});

// Node: Perform research (simulated)
researchGraph.addNode("doResearch", async (state: ResearchState) => {
  console.log("Performing research...");
  const research = `Research results for: ${state.query}`;
  return { research };
});

// Node: Generate response
researchGraph.addNode("generateResponse", async (state: ResearchState) => {
  const context = state.needsResearch ? `Based on research: ${state.research}` : "";
  const prompt = `${context}\n\nAnswer this question: ${state.query}`;
  const response = await model.invoke(prompt);
  return { response: response.content };
});

// Conditional edge function
function shouldResearch(state: ResearchState): string {
  return state.needsResearch ? "doResearch" : "generateResponse";
}

// Build the graph
researchGraph.setEntryPoint("analyze");
researchGraph.addConditionalEdges("analyze", shouldResearch);
researchGraph.addEdge("doResearch", "generateResponse");
researchGraph.addEdge("generateResponse", END);

const researchApp = researchGraph.compile();

// Test with different queries
const result1 = await researchApp.invoke({ query: "What is 2+2?" });
console.log("Simple question:", result1.response);

const result2 = await researchApp.invoke({ query: "What are the latest developments in quantum computing?" });
console.log("Research question:", result2.response);

// Example 3: Human-in-the-Loop Pattern
import { HumanMessage } from "@langchain/core/messages";

interface ApprovalState {
  request: string;
  approved: boolean;
  result: string;
}

const approvalGraph = new StateGraph<ApprovalState>({
  channels: {
    request: { value: (_, right) => right, default: () => "" },
    approved: { value: (_, right) => right, default: () => false },
    result: { value: (_, right) => right, default: () => "" },
  },
});

approvalGraph.addNode("requestApproval", async (state: ApprovalState) => {
  console.log(`\nRequest: ${state.request}`);
  console.log("Waiting for human approval...");

  // In a real app, this would wait for user input via UI
  // For demo, we'll auto-approve
  const approved = true;

  return { approved };
});

approvalGraph.addNode("execute", async (state: ApprovalState) => {
  const result = `Executed: ${state.request}`;
  return { result };
});

approvalGraph.addNode("reject", async (state: ApprovalState) => {
  const result = `Rejected: ${state.request}`;
  return { result };
});

function checkApproval(state: ApprovalState): string {
  return state.approved ? "execute" : "reject";
}

approvalGraph.setEntryPoint("requestApproval");
approvalGraph.addConditionalEdges("requestApproval", checkApproval);
approvalGraph.addEdge("execute", END);
approvalGraph.addEdge("reject", END);

const approvalApp = approvalGraph.compile();

const approvalResult = await approvalApp.invoke({
  request: "Delete all production data",
});

console.log("Result:", approvalResult.result);

// Example 4: ReAct Agent with LangGraph
import { DynamicTool } from "@langchain/core/tools";

const searchTool = new DynamicTool({
  name: "search",
  description: "Search for information",
  func: async (query: string) => `Search results for: ${query}`,
});

const calculatorTool = new DynamicTool({
  name: "calculator",
  description: "Perform calculations",
  func: async (expr: string) => `Result: ${eval(expr)}`,
});

// This is a simplified version - full implementation would use createReactAgent
interface ReactState {
  input: string;
  agentOutcome: string;
  intermediateSteps: string[];
}

// LangGraph provides built-in support for agent workflows
// See full documentation for complete ReAct agent implementation
```

**Challenges/Exercises**:
1. **Customer Support Flow**: Build a graph that routes customer queries to different departments based on topic
2. **Content Moderation**: Create a workflow that checks content, requests human review if uncertain, then approves/rejects
3. **Multi-Agent Research**: Design a graph where one agent searches, another summarizes, and a third fact-checks
4. **Loop Detection**: Implement a graph that detects when it's in a loop and exits gracefully

**Key Takeaways**:
- LangGraph enables multi-step, stateful AI workflows
- Conditional edges allow branching logic based on state
- Human-in-the-loop patterns give control over critical decisions
- Graphs are helpful for building agents with branching logic and decision-making

---

## Course Delivery Format

### Repository Structure
```
langchainjs-for-beginners/
├── README.md
├── package.json
├── .env.example
├── 01-introduction/
│   ├── README.md
│   ├── examples/
│   │   ├── 01-hello-world.ts
│   │   └── 02-message-types.ts
│   ├── exercises/
│   │   └── challenges.md
│   └── solutions/
│       └── challenge-solutions.ts
├── 02-chat-models/
│   ├── README.md
│   ├── examples/
│   ├── exercises/
│   └── solutions/
├── ... (remaining chapters)
└── shared/
    ├── utils.ts
    └── config.ts
```

### Each Chapter Contains:
1. **README.md**: Full chapter content with explanations, analogies, and concepts
2. **examples/**: Runnable code examples demonstrating key concepts
3. **exercises/challenges.md**: Hands-on challenges for students
4. **solutions/**: Solution code for challenges (in separate branch or folder)

### Teaching Approach:
- **Story → Concept → Code → Practice**: Each chapter follows this flow
- **Analogies First**: Start with real-world comparisons before diving into technical details
- **Incremental Complexity**: Examples progress from simple to more complex within each chapter
- **Runnable Code**: Every code sample can be executed immediately
- **Challenge-Based Learning**: Exercises reinforce concepts through practice

---

## Additional Resources to Create

1. **Quick Reference Guides**
   - LangChain.js cheat sheet
   - Common patterns and solutions
   - Troubleshooting guide

2. **Video Walkthroughs** (optional)
   - Chapter introductions
   - Live coding sessions
   - Challenge solution explanations

3. **Community Support**
   - Discussion forum (GitHub Discussions)
   - FAQ document
   - Office hours or Q&A sessions

---

## Success Metrics

Students who complete this course should be able to:
- ✅ Build a production-ready RAG system
- ✅ Create an interactive agent with custom tools
- ✅ Switch between AI providers without code changes
- ✅ Implement conversation memory in chatbots
- ✅ Design multi-step workflows with LangGraph
- ✅ Debug and monitor LangChain.js applications
- ✅ Make informed decisions about when to use LangChain.js vs. direct API calls

---

## Next Steps

After this course, students can explore:
- Additional LangGraph patterns
- Fine-tuning models
- Deploying at scale
- Integration with specific platforms (Slack, Discord, etc.)
- Building domain-specific agents
