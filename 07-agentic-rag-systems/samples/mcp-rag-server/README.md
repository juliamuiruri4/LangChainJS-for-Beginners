# MCP RAG Server Example

This example demonstrates **RAG as a reusable service** through the Model Context Protocol (MCP). Instead of embedding RAG logic directly in each agent, you can expose your knowledge base as an MCP server that multiple agents and applications can access.

## 🏗️ Architecture

```
┌─────────────────┐
│   Agent 1       │──┐
│  (Marketing)    │  │
└─────────────────┘  │
                     │    ┌──────────────────────────┐
┌─────────────────┐  │    │   MCP RAG Server         │
│   Agent 2       │──┼───▶│   - Vector Store         │
│  (Engineering)  │  │    │   - Embeddings           │
└─────────────────┘  │    │   - Search Tool          │
                     │    │   - Add Document Tool    │
┌─────────────────┐  │    └──────────────────────────┘
│   Agent 3       │──┘
│  (Sales)        │
└─────────────────┘
```

**Key Benefits:**
- 🔄 **Shared Knowledge Base**: Multiple agents use the same data
- 🎯 **Separation of Concerns**: RAG logic separate from agent logic
- 📈 **Scalable**: Scale RAG server independently from agents
- 🔐 **Centralized Control**: Manage access and data in one place
- 🔄 **Version Control**: Update knowledge base without changing agents

## 📁 Files

1. **`mcp-rag-server.ts`** - The MCP server that exposes RAG capabilities
   - Maintains a vector store with document embeddings
   - Exposes `searchDocuments` and `addDocument` tools
   - Runs as both stdio and HTTP server

2. **`mcp-rag-agent.ts`** - Example agent that uses the MCP RAG server
   - Connects to the MCP server
   - Decides when to search vs answer directly
   - Demonstrates agentic RAG pattern

## ⚠️ Security Note

**This example does not implement authentication or authorization.** It's designed for educational purposes to demonstrate the MCP RAG architecture.

For production and enterprise deployments, implement proper security:
- **Authentication**: Verify client identity before allowing connections
- **Authorization**: Control access to documents and tools
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Sanitize all inputs
- **Audit Logging**: Track access patterns

**Learn more:** [MCP Security Documentation](https://modelcontextprotocol.io/docs/tutorials/security/authorization)

---

## 🚀 Quick Start

### Option 1: Run Agent (Auto-starts Server)

The agent will automatically start the server:

```bash
npx tsx 07-agentic-rag-systems/samples/mcp-rag-server/mcp-rag-agent.ts
```

### Option 2: Run Server and Agent Separately

**Terminal 1 - Start the MCP RAG Server:**
```bash
npx tsx 07-agentic-rag-systems/samples/mcp-rag-server/mcp-rag-server.ts
```

**Terminal 2 - Run the Agent Client:**
```bash
npx tsx 07-agentic-rag-systems/samples/mcp-rag-server/mcp-rag-agent.ts
```

## 🎯 What You'll See

The agent will answer a mix of questions:

**General Knowledge (No RAG Search):**
- ❓ "What is the capital of France?"
- 🤖 Agent answers directly: "Paris"
- 💡 No MCP call made (efficient!)

**Knowledge Base Questions (Uses RAG):**
- ❓ "What is the Model Context Protocol?"
- 🔍 Agent calls MCP RAG server
- 📚 Server searches vector store
- 🤖 Agent answers based on retrieved documents

## 🔧 How It Works

### Server Side (`mcp-rag-server.ts`)

1. **Initialize Vector Store**: Creates embeddings for initial documents
2. **Expose MCP Tools**:
   - `searchDocuments`: Search knowledge base by query
   - `addDocument`: Add new documents to knowledge base
3. **Listen for Connections**: Both stdio and HTTP transports

### Client Side (`mcp-rag-agent.ts`)

1. **Connect to MCP Server**: Establishes connection via stdio transport
2. **Wrap MCP Tool**: Creates LangChain tool that calls MCP server
3. **Create Agent**: Agent with access to the search tool
4. **Autonomous Decision-Making**: Agent decides when to search

## 💡 Key Concepts

### Why RAG as a Service?

**Traditional Approach (Embedded RAG):**
```
Each Agent → Own Vector Store → Own Embeddings → Own Documents
Problems:
- Duplicate data across agents
- Inconsistent results
- Hard to update knowledge
- Memory intensive
```

**MCP Approach (RAG as Service):**
```
Multiple Agents → Shared MCP RAG Server → Single Vector Store
Benefits:
- Centralized knowledge
- Consistent results
- Easy updates
- Efficient resource usage
```

### Agentic Decision-Making

The agent **intelligently decides** when to use the RAG server:

```typescript
// General knowledge - agent answers directly
"What is 2 + 2?"
→ Agent thinks: "I know this"
→ Responds: "4"
→ NO MCP call (efficient!)

// Knowledge base question - agent searches
"What is agentic RAG?"
→ Agent thinks: "I should search the knowledge base"
→ Calls MCP searchDocuments tool
→ Uses retrieved context to answer
```

## 🎓 Combining Course Concepts

This example ties together everything you've learned:

| Chapter | Concept Applied |
|---------|----------------|
| **Chapter 4** | Function calling & tools (searchDocuments tool) |
| **Chapter 5** | MCP integration (exposing and using MCP servers) |
| **Chapter 6** | Vector embeddings & semantic search |
| **Chapter 7** | Agentic RAG (agent decides when to search) |

## 🔍 Extension Ideas

1. **Add More Tools**:
   - `deleteDocument`: Remove documents
   - `updateDocument`: Modify existing documents
   - `listCategories`: Browse available categories

2. **Multiple Vector Stores**:
   - Different knowledge bases for different teams
   - Route queries to appropriate store

3. **Authentication**:
   - Add API keys for MCP server access
   - Role-based access control

4. **Persistence**:
   - Save vector store to disk
   - Use persistent vector database (Chroma, Pinecone)

5. **Multiple Agents**:
   - Create specialized agents (Marketing, Engineering, Sales)
   - Each uses the same RAG server

## 📚 Related Examples

- **Chapter 5**: MCP integration basics
- **Chapter 7, Example 2**: Basic agentic RAG
- **Chapter 7, citation-rag.ts**: Adding source citations
- **Chapter 7, multi-source-rag.ts**: Multiple document sources

## 🤔 Try This

1. Run the agent and observe when it searches vs answers directly
2. Modify `mcp-rag-server.ts` to add your own documents
3. Create a second agent that also connects to the server
4. Add a new tool (like `addDocument`) to the agent

## 💭 Discussion Questions

1. When would you use RAG as an MCP service vs embedded in the agent?
2. How would you handle concurrent requests from multiple agents?
3. What security considerations exist when exposing RAG as a service?
4. How could you monitor and optimize RAG server performance?

---

**🎯 Production Considerations:**

- Use persistent vector stores (not in-memory)
- Implement proper authentication/authorization
- Add monitoring and logging
- Handle concurrent requests safely
- Implement rate limiting
- Add health checks and error recovery
- Consider caching frequently accessed documents
