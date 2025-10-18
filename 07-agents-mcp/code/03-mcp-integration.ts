/**
 * Chapter 7 Example 3: Agent with MCP Server Integration
 *
 * This example shows how to connect to Context7 MCP server - a documentation
 * provider that delivers current, version-specific docs directly to your agent.
 *
 * Context7 provides these tools:
 * - resolve-library-id: Converts library names to Context7-compatible IDs
 * - get-library-docs: Retrieves documentation with optional topic filtering
 *
 * Prerequisites:
 * 1. Install @langchain/mcp-adapters: npm install @langchain/mcp-adapters
 * 2. Optional: Get a Context7 API key for higher rate limits (https://context7.com)
 *
 * Run: npx tsx 07-agents-mcp/code/03-mcp-integration.ts
 *
 * 🤖 Try asking GitHub Copilot Chat (https://github.com/features/copilot):
 * - "How does MultiServerMCPClient differ from manually creating tools?"
 * - "What happens if the MCP server is unavailable?"
 * - "Can I connect to multiple MCP servers simultaneously?"
 */

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, ToolMessage } from "langchain";
import "dotenv/config";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";

// Note: Uncomment when @langchain/mcp-adapters is installed
// import { MultiServerMCPClient } from "@langchain/mcp-adapters";

async function main() {
  console.log("🔌 MCP Integration Demo - Context7 Documentation Server\n");
  console.log("=".repeat(80) + "\n");

  // Context7 MCP Server - provides documentation for libraries
  // Public endpoint: https://mcp.context7.com/mcp
  // Local: http://localhost:3000 (if running Context7 locally)
  const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "https://mcp.context7.com/mcp";

  console.log(`📡 Connecting to MCP server at: ${MCP_SERVER_URL}\n`);

  // Create MCP client with HTTP transport to Context7
  const mcpClient = new MultiServerMCPClient({
    context7: {
      transport: "http",
      url: MCP_SERVER_URL,
      // Optional: Add Context7 API key for higher rate limits
      // headers: {
      //   "Authorization": `Bearer ${process.env.CONTEXT7_API_KEY}`
      // }
    },
  });

  try {
    // 2. Get all available tools from Context7
    console.log("🔧 Fetching tools from Context7 MCP server...");
    const tools = await mcpClient.getTools();

    console.log(`✅ Retrieved ${tools.length} tools from Context7:`);
    tools.forEach((tool) => {
      console.log(`   • ${tool.name}: ${tool.description}`);
    });
    console.log();

    // Create a map of tool names to tools for easy lookup
    const toolsByName = new Map(tools.map((tool) => [tool.name, tool]));

    // 3. Create agent with Context7 documentation tools
    const model = new ChatOpenAI({
      model: process.env.AI_MODEL,
      configuration: { baseURL: process.env.AI_ENDPOINT },
      apiKey: process.env.AI_API_KEY,
    });

    const modelWithTools = model.bindTools(tools);

    // 4. Use the agent to get documentation
    const query = "How do I use React useState hook? Get the latest documentation.";
    console.log(`User: ${query}\n`);

    let messages: any[] = [new HumanMessage(query)];
    let iteration = 1;
    const maxIterations = 5; // Context7 may need multiple calls (resolve ID, then get docs)

    while (iteration <= maxIterations) {
      console.log(`Iteration ${iteration}:`);

      const response = await modelWithTools.invoke(messages);

      if (!response.tool_calls || response.tool_calls.length === 0) {
        console.log(`  Final Answer: ${response.content}\n`);
        break;
      }

      // Execute Context7 tool
      const toolCall = response.tool_calls[0];
      console.log(`  Thought: I should use the ${toolCall.name} tool`);
      console.log(`  Action: ${toolCall.name}(${JSON.stringify(toolCall.args)})`);

      // Find the tool and invoke it directly
      const tool = toolsByName.get(toolCall.name);
      if (!tool) {
        throw new Error(`Tool ${toolCall.name} not found`);
      }

      const toolResult = await tool.invoke(toolCall.args);
      console.log(
        `  Observation: ${typeof toolResult === "string" ? toolResult.substring(0, 150) + "..." : toolResult}\n`
      );

      messages.push(
        new AIMessage({
          content: response.content,
          tool_calls: response.tool_calls,
        }),
        new ToolMessage({
          content: String(toolResult),
          tool_call_id: toolCall.id || "",
        })
      );

      iteration++;
    }

    console.log("=".repeat(80) + "\n");
    console.log("💡 Key Concepts:");
    console.log("   • MCP provides standardized access to external tools");
    console.log("   • MultiServerMCPClient connects to one or more MCP servers");
    console.log("   • HTTP transport works with remote servers like Context7");
    console.log("   • Tools from MCP servers work like manually created tools");
    console.log("   • Same agent pattern as Examples 1 & 2, different tool source");
  } catch (error) {
    console.error("❌ Error connecting to Context7 MCP server:", error);
  } finally {
    // Close the MCP client connection to allow the script to exit
    await mcpClient.close();
    console.log("\n✅ MCP client connection closed");
  }
}

main().catch(console.error);
