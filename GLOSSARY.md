# Glossary

A comprehensive glossary of terms used throughout the LangChain.js for Beginners course.

---

## A

### Agent

An AI system that can reason about problems, decide which actions to take, and work iteratively towards solutions. Unlike chains (which follow a fixed path), agents make dynamic decisions about which tools to use and when. Agents follow the ReAct pattern (Reasoning + Acting).

**Example**: An agent that can search the web, perform calculations, and query databases to answer complex questions.

**See**: [Chapter 7: Agents & MCP](./07-agents-mcp/README.md)

### AIMessage

A message type representing responses from the AI model. AIMessages are typically added to conversation history automatically after the model generates a response. Part of LangChain's structured message system.

**See**: [Chapter 1: Message Types](./01-introduction/README.md#-understanding-messages)

### API Key

A secret credential used to authenticate requests to AI provider services (OpenAI, Azure, Anthropic, etc.). API keys should always be stored in environment variables, never hardcoded in your source code.

**Example**: `AI_API_KEY=ghp_abc123...`

**See**: [Chapter 0: Course Setup](./00-course-setup/README.md)

---

## B

### Batch Processing

Processing multiple items together in a single operation instead of one at a time. For embeddings, batch processing is 5-10x faster than creating embeddings individually because it reduces API round trips.

**Example**: `embeddings.embedDocuments([text1, text2, text3])` instead of three separate calls.

**See**: [Chapter 4: Batch Processing](./04-documents-embeddings-semantic-search/README.md#-batch-processing)

---

## C

### Chain

A sequence of operations connected together where the output of one step becomes the input to the next. Chains follow a predetermined, fixed path (unlike agents which make dynamic decisions). Built using LCEL (LangChain Expression Language).

**Example**: `prompt | model | outputParser`

**See**: [Chapter 6: RAG Systems](./06-rag-systems/README.md)

### Chunk / Chunking

The process of splitting long documents into smaller, manageable pieces. Chunking is necessary because LLMs have context limits and smaller chunks provide more precise retrieval in RAG systems.

**Trade-offs**:
- Small chunks (200-500 chars): More precise but less context
- Large chunks (1000-2000 chars): More context but less precise

**See**: [Chapter 4: Splitting Documents](./04-documents-embeddings-semantic-search/README.md#%EF%B8%8F-splitting-documents)

### Chunk Overlap

The number of characters that overlap between adjacent chunks when splitting documents. Overlap preserves context at chunk boundaries and prevents information from being split mid-sentence.

**Recommended**: 10-20% of chunk size

**See**: [Chapter 4: Chunk Overlap](./04-documents-embeddings-semantic-search/README.md#-chunk-overlap)

### Cosine Similarity

A measure of similarity between two vectors (embeddings) that calculates the angle between them. The result ranges from -1 to 1 (for text, typically 0 to 1). Higher scores indicate more similar meanings.

**Interpretation**:
- 1.0 = Identical
- 0.8-0.9 = Very similar
- 0.6-0.8 = Somewhat similar
- <0.6 = Different topics

**See**: [Chapter 4: Similarity Metrics](./04-documents-embeddings-semantic-search/README.md#-similarity-metrics)

---

## D

### Document

In LangChain, a Document is an object with two main properties: `pageContent` (the actual text) and `metadata` (information about the document like source, date, author). Documents are the fundamental unit for working with text in LangChain.

**See**: [Chapter 4: Working with Documents](./04-documents-embeddings-semantic-search/README.md#-part-1-working-with-documents)

### Document Loader

A component that reads files in various formats (text, PDF, web pages, JSON, CSV, etc.) and converts them into Document objects that LangChain can process.

**Example**: `TextLoader`, `PDFLoader`, `WebBaseLoader`

**See**: [Chapter 4: Document Loaders](./04-documents-embeddings-semantic-search/README.md#-part-1-working-with-documents)

---

## E

### Embedding

A numerical representation of text as a vector (array of numbers) that captures semantic meaning. Similar text produces similar vectors, allowing computers to understand and compare meaning mathematically.

**Example**: "cat" and "dog" have similar embeddings (both animals), while "cat" and "pizza" have very different embeddings.

**See**: [Chapter 4: Embeddings](./04-documents-embeddings-semantic-search/README.md#what-are-embeddings)

### Embedding Model

An AI model that converts text into embeddings (vectors). Common models include `text-embedding-3-small` (1536 dimensions) and `text-embedding-3-large` (3072 dimensions).

**See**: [Chapter 4: Creating Embeddings](./04-documents-embeddings-semantic-search/README.md#-creating-embeddings)

---

## F

### Function Calling

A feature that allows LLMs to generate structured outputs in the form of function calls with specific parameters. The LLM decides when to call a function and what arguments to pass, but doesn't execute the function itself.

**See**: [Chapter 5: Function Calling & Tooling](./05-function-calling-tooling/README.md)

---

## H

### HumanMessage

A message type representing input from the user. HumanMessages are added to conversation history to maintain context about what the user has asked.

**See**: [Chapter 1: Message Types](./01-introduction/README.md#-understanding-messages)

---

## L

### LCEL (LangChain Expression Language)

LangChain's syntax for building chains using the pipe operator (`|`). LCEL allows you to connect operations in a readable, composable way.

**Example**: `const chain = prompt | model | outputParser;`

**See**: [Chapter 6: RAG Systems](./06-rag-systems/README.md)

### LLM (Large Language Model)

An AI model trained on massive amounts of text data that can understand and generate human-like text. Examples include GPT-5, GPT-4, GPT-4o-mini, Claude Sonnet, and many others.

**See**: [Chapter 1: Introduction](./01-introduction/README.md)

---

## M

### Max Tokens

A parameter that limits the length of the AI's response by capping the maximum number of tokens it can generate. Used to control costs and response length.

**Example**: `maxTokens: 100` limits the response to approximately 75 words.

**See**: [Chapter 2: Model Parameters](./02-chat-models/README.md#%EF%B8%8F%EF%B8%8F-model-parameters)

### MCP (Model Context Protocol)

An emerging open standard that lets AI applications connect to external tools and data sources through a universal interface. Think of it as "USB-C for AI" - one protocol that works with many services.

**See**: [Chapter 7: Model Context Protocol](./07-agents-mcp/README.md#-model-context-protocol-mcp)

### Memory

The ability of an AI application to remember context across multiple interactions. In practice, this means maintaining and sending conversation history with each new message, as LLMs don't inherently "remember" previous exchanges.

**See**: [Chapter 2: Multi-Turn Conversations](./02-chat-models/README.md#-multi-turn-conversations)

### Metadata

Additional information attached to documents (source, category, date, author, etc.) that helps with filtering, tracking, and organizing content. Metadata is preserved when documents are split into chunks.

**See**: [Chapter 4: Document Metadata](./04-documents-embeddings-semantic-search/README.md#%EF%B8%8F-document-metadata)

### Model

The AI "brain" that processes inputs and generates outputs. In LangChain, models provide a consistent interface to work with different AI providers (OpenAI, Anthropic, Azure, Google, etc.) using the same code.

**See**: [Chapter 1: Core Concepts](./01-introduction/README.md#%EF%B8%8F-core-concepts-overview)

---

## O

### Output Parser

A component that transforms raw LLM output into structured data formats (JSON, lists, custom objects). Output parsers make it easier to work with AI responses programmatically.

**See**: [Chapter 3: Structured Outputs](./03-prompt-templates/README.md)

---

## P

### Prompt

The instructions, questions, or context you provide to an AI model. Good prompts are clear, specific, and include relevant context.

**See**: [Chapter 1: Core Concepts](./01-introduction/README.md#%EF%B8%8F-core-concepts-overview)

### Prompt Template

A reusable prompt structure with placeholders (variables) that can be filled in with different values. Templates make prompts testable, maintainable, and prevent security issues like prompt injection.

**Example**: `"Translate {text} from {source_lang} to {target_lang}"`

**See**: [Chapter 3: Prompt Templates](./03-prompt-templates/README.md)

### Provider

An AI service company that offers LLM APIs (OpenAI, Anthropic, Azure, Google, etc.). LangChain provides a consistent interface across providers, allowing you to switch between them by just changing environment variables.

**See**: [Chapter 1: Provider Flexibility](./01-introduction/README.md#-switching-to-azure-ai-foundry-optional)

---

## R

### RAG (Retrieval Augmented Generation)

A pattern where you retrieve relevant documents from a knowledge base and provide them as context to the LLM, allowing it to answer questions based on your specific data rather than just its training data.

**Flow**: Query → Retrieve Relevant Docs → Format as Context → LLM Generates Answer

**See**: [Chapter 6: RAG Systems](./06-rag-systems/README.md)

### ReAct Pattern

A reasoning pattern for agents: **Rea**soning + **Act**ing. The agent follows an iterative loop: Think (reason about what to do) → Act (use a tool) → Observe (see the result) → Repeat until solved → Respond.

**See**: [Chapter 7: The ReAct Pattern](./07-agents-mcp/README.md#-the-react-pattern)

---

## S

### Semantic Search

A search method that finds results based on meaning and context rather than exact keyword matches. Semantic search uses embeddings to understand that "cooking pasta" and "preparing noodles" are related concepts.

**Contrast with**: Keyword search (only finds exact word matches)

**See**: [Chapter 4: Semantic Search](./04-documents-embeddings-semantic-search/README.md#traditional-search-vs-semantic-search)

### Streaming

Sending the AI's response word-by-word as it's generated, rather than waiting for the complete response. Streaming provides better user experience by showing immediate feedback and progress.

**See**: [Chapter 2: Streaming Responses](./02-chat-models/README.md#-streaming-responses)

### SystemMessage

A message type that sets the AI's behavior, personality, and instructions. SystemMessages tell the AI how to respond (e.g., "You are a helpful coding tutor who explains things simply").

**See**: [Chapter 1: Message Types](./01-introduction/README.md#-understanding-messages)

---

## T

### Temperature

A parameter that controls the randomness and creativity of AI responses. Values range from 0.0 to 2.0.

**Scale**:
- **0.0 = Deterministic**: Same input → same output (best for code, factual answers)
- **1.0 = Balanced**: Default, good for general conversation
- **2.0 = Creative**: More random and creative (best for brainstorming, creative writing) but can lead to off-topic or nonsensical responses

**See**: [Chapter 2: Model Parameters](./02-chat-models/README.md#%EF%B8%8F%EF%B8%8F-model-parameters)

### Token

The basic unit of text that AI models process. Think of tokens as pieces of words - roughly 1 token ≈ 4 characters or ¾ of a word.

**Example**: "Hello world!" = approximately 3 tokens

**Why tokens matter**:
- Models have token limits (context windows)
- Pricing is based on tokens
- More tokens = slower responses

**See**: [Chapter 2: Token Tracking](./02-chat-models/README.md#-token-tracking-and-costs)

### Tool

A function that an agent or LLM can use to perform specific actions (calculations, web searches, database queries, etc.). Tools extend the capabilities of AI beyond text generation.

**Example**: A calculator tool that performs mathematical operations.

**See**: [Chapter 5: Function Calling & Tooling](./05-function-calling-tooling/README.md), [Chapter 7: Agents](./07-agents-mcp/README.md)

### ToolMessage

A message type that contains the result returned by a tool after execution. ToolMessages are added to conversation history so the agent knows what the tool returned.

**See**: [Chapter 7: Building Agents](./07-agents-mcp/README.md#-building-your-first-agent)

---

## V

### Vector

An array of numbers (typically 1536 or 3072 dimensions) that represents the semantic meaning of text. Vectors enable mathematical comparison of text similarity.

**Example**: `[0.23, -0.41, 0.87, ..., 0.15]` (1536 numbers)

**See**: [Chapter 4: Embeddings](./04-documents-embeddings-semantic-search/README.md#what-are-embeddings)

### Vector Store

A specialized database optimized for storing and searching embeddings (vectors). Vector stores enable fast similarity search at scale by comparing vector distances.

**Examples**: MemoryVectorStore (in-memory), Chroma (local), Pinecone (cloud), Weaviate, Qdrant

**See**: [Chapter 4: Vector Stores](./04-documents-embeddings-semantic-search/README.md#%EF%B8%8F-vector-stores)

---

## Related Resources

- [Course Home](./README.md)
- [LangChain.js Documentation](https://js.langchain.com/)
- [Course Setup](./00-course-setup/README.md)
