# Glossary

A comprehensive glossary of terms used throughout the LangChain.js for Beginners course.

---

## A

### Agent

An AI system that can reason about problems, decide which actions to take, and work iteratively towards solutions. Unlike chains (which follow a fixed path), agents make dynamic decisions about which tools to use and when. Agents follow the ReAct pattern (Reasoning + Acting).

**Example**: An agent that can search the web, perform calculations, and query databases to answer complex questions.

**See**: [Chapter 5: Agents & MCP](./05-agents-mcp/README.md)

### Agent Loop

The iterative process where an agent repeatedly thinks, acts, and observes until it solves a problem. Each iteration follows the ReAct pattern: Thought → Action → Observation → (repeat) → Final Answer.

**Pattern**:
1. **Thought**: Reason about what to do next
2. **Action**: Choose and use a tool
3. **Observation**: Evaluate the tool's result
4. **Repeat**: Continue until problem is solved
5. **Answer**: Provide final response

**See**: [Chapter 5: Building Your First Agent](./05-agents-mcp/README.md#-building-your-first-agent)

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

**See**: [Chapter 6: Batch Processing](./06-documents-embeddings-semantic-search/README.md#-batch-processing)

---

## C

### Chain

A sequence of operations connected together where the output of one step becomes the input to the next. Chains follow a predetermined, fixed path (unlike agents which make dynamic decisions). Built using LCEL (LangChain Expression Language).

**Example**: `prompt | model | outputParser`

**See**: [Chapter 7: Agentic RAG Systems](./07-agentic-rag-systems/README.md)

### Chunk / Chunking

The process of splitting long documents into smaller, manageable pieces. Chunking is necessary because LLMs have context limits and smaller chunks provide more precise retrieval in RAG systems.

**Trade-offs**:
- Small chunks (200-500 chars): More precise but less context
- Large chunks (1000-2000 chars): More context but less precise

**See**: [Chapter 6: Splitting Documents](./06-documents-embeddings-semantic-search/README.md#%EF%B8%8F-splitting-documents)

### Chunk Overlap

The number of characters that overlap between adjacent chunks when splitting documents. Overlap preserves context at chunk boundaries and prevents information from being split mid-sentence.

**Recommended**: 10-20% of chunk size

**See**: [Chapter 6: Chunk Overlap](./06-documents-embeddings-semantic-search/README.md#-chunk-overlap)

### Context Window

The maximum number of tokens an LLM can process in a single request, including both input (prompt + conversation history) and output (response). Models have varying context limits ranging from 4K to 200K+ tokens.

**Examples**:
- GPT-5: 128K tokens
- GPT-5-mini: 128K tokens
- Claude Sonnet: 200K tokens

**Why it matters**: When conversation history exceeds the context window, older messages must be removed or summarized. This affects how much context the AI can remember.

**See**: [Chapter 2: Token Tracking and Costs](./02-chat-models/README.md#-token-tracking-and-costs)

### Cosine Similarity

A measure of similarity between two vectors (embeddings) that calculates the angle between them. The result ranges from -1 to 1 (for text, typically 0 to 1). Higher scores indicate more similar meanings.

**Interpretation**:
- 1.0 = Identical
- 0.8-0.9 = Very similar
- 0.6-0.8 = Somewhat similar
- <0.6 = Different topics

**See**: [Chapter 6: Similarity Metrics](./06-documents-embeddings-semantic-search/README.md#-similarity-metrics)

---

## D

### Document

In LangChain, a Document is an object with two main properties: `pageContent` (the actual text) and `metadata` (information about the document like source, date, author). Documents are the fundamental unit for working with text in LangChain.

**See**: [Chapter 6: Working with Documents](./06-documents-embeddings-semantic-search/README.md#-part-1-working-with-documents)

### Document Loader

A component that reads files in various formats (text, PDF, web pages, JSON, CSV, etc.) and converts them into Document objects that LangChain can process.

**Example**: `TextLoader`, `PDFLoader`, `WebBaseLoader`

**See**: [Chapter 6: Document Loaders](./06-documents-embeddings-semantic-search/README.md#-part-1-working-with-documents)

---

## E

### Embedding

A numerical representation of text as a vector (array of numbers) that captures semantic meaning. Similar text produces similar vectors, allowing computers to understand and compare meaning mathematically.

**Example**: "cat" and "dog" have similar embeddings (both animals), while "cat" and "pizza" have very different embeddings.

**See**: [Chapter 6: Embeddings](./06-documents-embeddings-semantic-search/README.md#what-are-embeddings)

### Embedding Model

An AI model that converts text into embeddings (vectors). Common models include `text-embedding-3-small` (1536 dimensions) and `text-embedding-3-large` (3072 dimensions).

**See**: [Chapter 6: Creating Embeddings](./06-documents-embeddings-semantic-search/README.md#-creating-embeddings)

---

## F

### Few-Shot Prompting

A technique where you teach the AI by providing examples in the prompt. Instead of just instructions, you show 2-5 examples of the desired input-output pattern, and the AI learns to replicate that pattern for new inputs.

**Example**: Showing "happy → 😊, sad → 😢, excited → 🎉" to teach emoji conversion, then asking it to convert "confused".

**Benefits**:
- More reliable than zero-shot (no examples)
- Faster and cheaper than fine-tuning
- Easy to update and test

**See**: [Chapter 3: Few-Shot Prompting](./03-prompts-messages-outputs/README.md#-few-shot-prompting)

### Fine-Tuning

The process of training a pre-trained LLM on custom data to specialize its behavior, output style, or knowledge. Unlike RAG (which adds information via retrieval) or prompt engineering (which provides instructions), fine-tuning modifies the model's weights to learn new patterns.

**When to use**:
- Teaching new writing styles or formats
- Domain-specific language patterns
- Specialized reasoning approaches
- Company-specific terminology

**Trade-offs**:
- ✅ Can change model behavior fundamentally
- ✅ Fast at inference (no retrieval needed)
- ❌ Expensive and time-consuming to train
- ❌ Static knowledge (doesn't update easily)
- ❌ Requires significant training data

**See**: [Chapter 7: When to Use RAG vs Fine-Tuning](./07-agentic-rag-systems/README.md#when-to-use-rag-vs-fine-tuning-vs-prompt-engineering)

### Function Calling

A feature that allows LLMs to generate structured outputs in the form of function calls with specific parameters. The LLM decides when to call a function and what arguments to pass, but doesn't execute the function itself.

**See**: [Chapter 4: Function Calling & Tools](./04-function-calling-tools/README.md)

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

**See**: [Chapter 7: Agentic RAG Systems](./07-agentic-rag-systems/README.md)

### LLM (Large Language Model)

An AI model trained on massive amounts of text data that can understand and generate human-like text. Examples include GPT-5, GPT-4, Claude Sonnet, and many others.

**See**: [Chapter 1: Introduction](./01-introduction/README.md)

---

## M

### Max Tokens

A parameter that limits the length of the AI's response by capping the maximum number of tokens it can generate. Used to control costs and response length.

**Example**: `maxTokens: 100` limits the response to approximately 75 words.

**See**: [Chapter 2: Model Parameters](./02-chat-models/README.md#%EF%B8%8F%EF%B8%8F-model-parameters)

### MCP (Model Context Protocol)

An emerging open standard that lets AI applications connect to external tools and data sources through a universal interface. Think of it as "USB-C for AI" - one protocol that works with many services.

**See**: [Chapter 5: Model Context Protocol](./05-agents-mcp/README.md#-model-context-protocol-mcp)

### MCP Server

A program that exposes tools and capabilities through the Model Context Protocol. MCP servers provide standardized access to external services (databases, APIs, file systems, web search) that AI agents can use without custom integration code.

**Examples**:
- Filesystem MCP server (read/write files)
- Database MCP server (query data)
- Web search MCP server (search the internet)
- GitHub MCP server (repository operations)

**Benefits**:
- Write once, use with any MCP-compatible AI application
- No custom integration code needed
- Standard protocol for tool discovery and execution

**See**: [Chapter 5: Model Context Protocol](./05-agents-mcp/README.md#-model-context-protocol-mcp)

### Memory

The ability of an AI application to remember context across multiple interactions. In practice, this means maintaining and sending conversation history with each new message, as LLMs don't inherently "remember" previous exchanges.

**See**: [Chapter 2: Multi-Turn Conversations](./02-chat-models/README.md#-multi-turn-conversations)

### Metadata

Additional information attached to documents (source, category, date, author, etc.) that helps with filtering, tracking, and organizing content. Metadata is preserved when documents are split into chunks.

**See**: [Chapter 6: Document Metadata](./06-documents-embeddings-semantic-search/README.md#%EF%B8%8F-document-metadata)

### MMR (Maximum Marginal Relevance)

A retrieval strategy that balances relevance with diversity. Instead of just returning the most similar documents, MMR ensures variety by avoiding near-duplicate results. This prevents getting 5 slightly different versions of the same information.

**How it works**:
1. Fetch candidates based on similarity
2. For each candidate, check if it's too similar to already-selected results
3. If too similar, skip it; if different enough, include it

**When to use**:
- When you need diverse perspectives on a topic
- To avoid redundant information in RAG responses
- When your knowledge base has many similar documents

**See**: [Chapter 7: Advanced RAG Patterns](./07-agentic-rag-systems/README.md#-advanced-rag-patterns-optional)

### Model

The AI "brain" that processes inputs and generates outputs. In LangChain, models provide a consistent interface to work with different AI providers (OpenAI, Anthropic, Azure, Google, etc.) using the same code.

**See**: [Chapter 1: Core Concepts](./01-introduction/README.md#%EF%B8%8F-core-concepts-overview)

---

## O

### Output Parser

A component that transforms raw LLM output into structured data formats (JSON, lists, custom objects). Output parsers make it easier to work with AI responses programmatically.

**See**: [Chapter 3: Structured Outputs](./03-prompts-messages-outputs/README.md)

---

## P

### Prompt

The instructions, questions, or context you provide to an AI model. Good prompts are clear, specific, and include relevant context.

**See**: [Chapter 1: Core Concepts](./01-introduction/README.md#%EF%B8%8F-core-concepts-overview)

### Prompt Template

A reusable prompt structure with placeholders (variables) that can be filled in with different values. Templates make prompts testable, maintainable, and prevent security issues like prompt injection.

**Example**: `"Translate {text} from {source_lang} to {target_lang}"`

**See**: [Chapter 3: Prompts, Messages, and Structured Outputs](./03-prompts-messages-outputs/README.md)

### Provider

An AI service company that offers LLM APIs (OpenAI, Anthropic, Azure, Google, etc.). LangChain provides a consistent interface across providers, allowing you to switch between them by just changing environment variables.

**See**: [Chapter 1: Provider Flexibility](./01-introduction/README.md#-switching-to-azure-ai-foundry-optional)

---

## R

### RAG (Retrieval Augmented Generation)

A pattern where you retrieve relevant documents from a knowledge base and provide them as context to the LLM, allowing it to answer questions based on your specific data rather than just its training data.

**Flow**: Query → Retrieve Relevant Docs → Format as Context → LLM Generates Answer

**See**: [Chapter 7: Agentic RAG Systems](./07-agentic-rag-systems/README.md)

### Rate Limit

A restriction imposed by AI providers on how many API requests you can make within a specific time period (e.g., 200 requests per minute, 40,000 tokens per minute). Exceeding the rate limit results in 429 error responses.

**Why rate limits exist**:
- Prevent server overload
- Ensure fair access across users
- Control costs and resource usage

**How to handle**:
- Use `withRetry()` for automatic retry with exponential backoff
- Implement request queuing
- Monitor usage and upgrade tier if needed
- Batch requests when possible

**See**: [Chapter 2: Error Handling](./02-chat-models/README.md#%EF%B8%8F-error-handling-with-built-in-retries)

### ReAct Pattern

A reasoning pattern for agents: **Rea**soning + **Act**ing. The agent follows an iterative loop: Think (reason about what to do) → Act (use a tool) → Observe (see the result) → Repeat until solved → Respond.

**See**: [Chapter 5: The ReAct Pattern](./05-agents-mcp/README.md#-the-react-pattern)

### Retriever

A component that searches a vector store and returns the most relevant documents for a query. Retrievers abstract the search interface, allowing you to use different search strategies (similarity, MMR, score threshold) without changing your application code.

**Common retrieval strategies**:
- **Similarity search**: Returns top K most similar documents
- **MMR**: Balances similarity with diversity
- **Score threshold**: Only returns documents above a similarity score
- **Metadata filtering**: Searches within document subsets

**Benefits of using retrievers**:
- Consistent interface across different search methods
- Easy to swap strategies (similarity → MMR)
- Works seamlessly with RAG chains
- Supports advanced features like multi-query and ensemble retrieval

**See**: [Chapter 7: Agentic RAG Systems](./07-agentic-rag-systems/README.md)

---

## S

### Semantic Search

A search method that finds results based on meaning and context rather than exact keyword matches. Semantic search uses embeddings to understand that "cooking pasta" and "preparing noodles" are related concepts.

**Contrast with**: Keyword search (only finds exact word matches)

**See**: [Chapter 6: Semantic Search](./06-documents-embeddings-semantic-search/README.md#traditional-search-vs-semantic-search)

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

**See**: [Chapter 4: Function Calling & Tools](./04-function-calling-tools/README.md), [Chapter 5: Agents](./05-agents-mcp/README.md)

### ToolMessage

A message type that contains the result returned by a tool after execution. ToolMessages are added to conversation history so the agent knows what the tool returned.

**See**: [Chapter 5: Building Agents](./05-agents-mcp/README.md#-building-your-first-agent)

### Text Splitter

A component that breaks long documents into smaller chunks for processing. Different splitters use different strategies to determine where to split text while trying to preserve semantic meaning.

**Common splitters**:
- **RecursiveCharacterTextSplitter**: Tries to keep related content together by splitting on paragraphs, then sentences, then words (recommended)
- **CharacterTextSplitter**: Simple splitting by character count
- **TokenTextSplitter**: Splits by token count (useful for respecting model token limits)

**Key parameters**:
- `chunkSize`: Target size of each chunk (e.g., 1000 characters)
- `chunkOverlap`: How many characters overlap between chunks (e.g., 200)

**Why it matters**: Good chunking strategy significantly impacts RAG system quality by ensuring each chunk contains complete, meaningful information.

**See**: [Chapter 6: Splitting Documents](./06-documents-embeddings-semantic-search/README.md#%EF%B8%8F-splitting-documents)

---

## V

### Vector

An array of numbers (typically 1536 or 3072 dimensions) that represents the semantic meaning of text. Vectors enable mathematical comparison of text similarity.

**Example**: `[0.23, -0.41, 0.87, ..., 0.15]` (1536 numbers)

**See**: [Chapter 6: Embeddings](./06-documents-embeddings-semantic-search/README.md#what-are-embeddings)

### Vector Store

A specialized database optimized for storing and searching embeddings (vectors). Vector stores enable fast similarity search at scale by comparing vector distances.

**Examples**: MemoryVectorStore (in-memory), Chroma (local), Pinecone (cloud), Weaviate, Qdrant

**See**: [Chapter 6: Vector Stores](./06-documents-embeddings-semantic-search/README.md#%EF%B8%8F-vector-stores)

---

## Z

### Zod Schema

A TypeScript-first schema validation library used to define the structure, types, and constraints of data. In LangChain.js, Zod schemas define tool parameters and structured outputs, ensuring type safety at both compile-time and runtime.

**Common use cases**:
- Defining tool parameters with validation
- Structured output parsing from LLMs
- Type-safe API contracts
- Input validation

**Example**:
```typescript
const schema = z.object({
  city: z.string().describe("The city name"),
  country: z.string().describe("The country name"),
});
```

**Benefits**:
- ✅ Type inference (TypeScript types generated automatically)
- ✅ Runtime validation (catches invalid data at runtime)
- ✅ Clear error messages
- ✅ Composable schemas (reuse and extend)
- ✅ LLM-friendly descriptions (helps AI understand parameters)

**See**: [Chapter 3: Structured Outputs](./03-prompts-messages-outputs/README.md#-structured-outputs), [Chapter 4: Creating Tools](./04-function-calling-tools/README.md)

---

## Related Resources

- [Course Home](./README.md)
- [LangChain.js Documentation](https://js.langchain.com/)
- [Course Setup](./00-course-setup/README.md)
