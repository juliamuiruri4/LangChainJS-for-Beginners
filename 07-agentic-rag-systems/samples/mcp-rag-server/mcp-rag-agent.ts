/**
 * MCP RAG Agent - Agent Using Remote MCP RAG Server
 * Run: npx tsx 07-agentic-rag-systems/samples/mcp-rag-server/mcp-rag-agent.ts
 *
 * This example demonstrates an agent connecting to the MCP RAG server
 * and using it to answer questions. The agent intelligently decides when
 * to search the remote knowledge base versus answering directly.
 *
 * Prerequisites:
 * 1. Start the MCP RAG server in another terminal:
 *    npx tsx 07-agentic-rag-systems/samples/mcp-rag-server/mcp-rag-server.ts
 * 2. Run this agent client
 *
 * Key Concepts:
 * - Agent connects to remote MCP server
 * - Agent decides when to use searchDocuments tool
 * - Demonstrates RAG as a shared service
 * - Multiple agents could use the same RAG server
 *
 * 🤖 Try asking GitHub Copilot Chat (https://github.com/features/copilot):
 * - "How does the agent decide when to search the RAG server?"
 * - "What are the benefits of RAG as a remote service?"
 * - "How could multiple agents share this knowledge base?"
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { createAgent, HumanMessage, tool } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import * as z from "zod";
import { spawn } from "child_process";
import "dotenv/config";

// Initialize the LLM
const model = new ChatOpenAI({
  model: process.env.AI_MODEL,
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY,
});

// MCP Client for connecting to RAG server
let mcpClient: Client;

// Initialize MCP connection to the RAG server
async function initializeMCPClient() {
  console.log("🔌 Connecting to MCP RAG Server...\n");

  // Spawn the MCP server process
  const serverProcess = spawn("npx", [
    "tsx",
    "07-agentic-rag-systems/samples/mcp-rag-server/mcp-rag-server.ts",
  ]);

  // Create MCP client
  mcpClient = new Client(
    {
      name: "rag-agent-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  // Connect using stdio transport
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "07-agentic-rag-systems/samples/mcp-rag-server/mcp-rag-server.ts"],
  });

  await mcpClient.connect(transport);

  console.log("✅ Connected to MCP RAG Server\n");

  // Get available tools from the server
  const tools = await mcpClient.listTools();
  console.log("🛠️  Available Tools from MCP Server:");
  tools.tools.forEach((tool) => {
    console.log(`   - ${tool.name}: ${tool.description}`);
  });
  console.log();

  return serverProcess;
}

// Create a tool wrapper that calls the MCP server's searchDocuments tool
const searchDocumentsTool = tool(
  async (input) => {
    console.log(`   🔍 Agent is calling MCP RAG server to search for: "${input.query}"`);

    try {
      // Call the MCP server's searchDocuments tool
      const result = await mcpClient.callTool({
        name: "searchDocuments",
        arguments: {
          query: input.query,
          k: input.k || 2,
        },
      });

      // Extract text from result
      const contents = (result.content || []) as Array<{ type: string; text: string }>;
      const content = contents
        .filter((item) => item.type === "text")
        .map((item) => item.text)
        .join("\n");

      console.log(`   ✅ Received ${contents.length} results from MCP server\n`);

      return content;
    } catch (error) {
      console.error("   ❌ Error calling MCP server:", error);
      return "Error: Could not retrieve documents from knowledge base";
    }
  },
  {
    name: "searchKnowledgeBase",
    description:
      "Search the remote RAG knowledge base for information about LangChain.js, MCP, agents, and RAG patterns. Use this when you need specific technical information that's likely in the knowledge base. DO NOT use this for general knowledge questions.",
    schema: z.object({
      query: z.string().describe("The search query to find relevant information"),
      k: z
        .number()
        .optional()
        .describe("Number of documents to return (default: 2)"),
    }),
  }
);

// Create agent with the MCP RAG tool
async function createRAGAgent() {
  const agent = createAgent({
    model,
    tools: [searchDocumentsTool],
  });

  return agent;
}

async function main() {
  console.log("🤖 MCP RAG Agent - Using Remote RAG Service\n");
  console.log("=" .repeat(70) + "\n");

  // Initialize MCP connection
  const serverProcess = await initializeMCPClient();

  // Give the server a moment to fully initialize
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Create agent
  const agent = await createRAGAgent();

  console.log("=" .repeat(70));
  console.log("\n💡 Watch how the agent decides when to search vs answer directly:\n");
  console.log("=" .repeat(70) + "\n");

  // Test questions - mix of general knowledge and knowledge-base specific
  const questions = [
    // General knowledge - agent should answer directly
    "What is the capital of France?",

    // Knowledge base questions - agent should search
    "What is the Model Context Protocol?",
    "How does agentic RAG work?",

    // Another general knowledge
    "What is 15 + 27?",

    // Knowledge base question
    "What are vector embeddings?",
  ];

  for (const question of questions) {
    console.log("─".repeat(70));
    console.log(`\n❓ Question: ${question}\n`);

    try {
      const response = await agent.invoke({
        messages: [new HumanMessage(question)],
      });

      // Get the final answer
      const finalMessage = response.messages[response.messages.length - 1];
      console.log(`🤖 Answer: ${finalMessage.content}\n`);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  console.log("=" .repeat(70));
  console.log("\n💡 Key Observations:\n");
  console.log("✓ Agent answers general knowledge directly (no MCP call)");
  console.log("✓ Agent uses MCP RAG server for knowledge base questions");
  console.log("✓ Agent autonomously decides WHEN to search");
  console.log("✓ RAG knowledge base is shared/reusable across agents\n");

  console.log("🎯 Benefits of RAG as MCP Service:\n");
  console.log("✓ Centralized knowledge base (multiple agents share same data)");
  console.log("✓ Separation of concerns (RAG logic separate from agent logic)");
  console.log("✓ Scalable architecture (scale RAG server independently)");
  console.log("✓ Version control (update knowledge base without changing agents)");
  console.log("✓ Security (control access to knowledge at server level)\n");

  console.log("=" .repeat(70) + "\n");

  // Cleanup
  console.log("🛑 Shutting down...");
  await mcpClient.close();
  serverProcess.kill();
  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
