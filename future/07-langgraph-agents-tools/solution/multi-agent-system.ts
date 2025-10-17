/**
 * Chapter 7 Assignment Solution: Bonus Challenge
 * Multi-Agent System
 *
 * Run: npx tsx 07-langgraph-agents-tools/solution/multi-agent-system.ts
 */

import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import "dotenv/config";

// Simulated knowledge base
const knowledgeBase: Record<string, string> = {
  ai: "Artificial Intelligence involves creating systems that can perform tasks requiring human intelligence.",
  blockchain:
    "Blockchain is a distributed ledger technology that records transactions across multiple computers.",
  cloud:
    "Cloud computing delivers computing services over the internet, including storage and processing power.",
};

const analysisData: Record<string, any> = {
  "market trends": {
    growth: "15%",
    sentiment: "positive",
    key_factor: "innovation",
  },
  "user behavior": {
    engagement: "high",
    retention: "82%",
    satisfaction: "4.5/5",
  },
};

async function main() {
  console.log("🤝 Multi-Agent System\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-5-mini",
    temperature: 0.7,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Specialized Agent 1: Researcher
  const researcherAgent = createReactAgent({
    llm: model,
    tools: [
      tool(
        async (input: { topic: string }) => {
          console.log(`   🔍 Researcher: Searching for "${input.topic}"...`);

          const topic = input.topic.toLowerCase();
          for (const [key, value] of Object.entries(knowledgeBase)) {
            if (topic.includes(key)) {
              return `Research findings: ${value}`;
            }
          }

          return `Research complete: Found general information about ${input.topic}`;
        },
        {
          name: "research",
          description: "Research a topic and return findings",
          schema: z.object({
            topic: z.string().describe("The topic to research"),
          }),
        }
      ),
    ],
  });

  // Specialized Agent 2: Analyzer
  const analyzerAgent = createReactAgent({
    llm: model,
    tools: [
      tool(
        async (input: { subject: string }) => {
          console.log(`   📊 Analyzer: Analyzing "${input.subject}"...`);

          const subject = input.subject.toLowerCase();
          for (const [key, value] of Object.entries(analysisData)) {
            if (subject.includes(key)) {
              return `Analysis results: ${JSON.stringify(value, null, 2)}`;
            }
          }

          return `Analysis complete: ${input.subject} shows stable patterns`;
        },
        {
          name: "analyze",
          description: "Analyze data or trends for a subject",
          schema: z.object({
            subject: z.string().describe("The subject to analyze"),
          }),
        }
      ),
    ],
  });

  // Specialized Agent 3: Writer
  const writerAgent = createReactAgent({
    llm: model,
    tools: [
      tool(
        async (input: { content: string }) => {
          console.log(`   ✍️ Writer: Formatting report...`);

          const sections = input.content.split("\n\n");
          const formatted = sections
            .map((section: string, i: number) => {
              return `${i + 1}. ${section.trim()}`;
            })
            .join("\n\n");

          return `Formatted Report:\n\n${formatted}\n\n--- End of Report ---`;
        },
        {
          name: "format_report",
          description: "Format content into a professional report",
          schema: z.object({
            content: z.string().describe("The content to format"),
          }),
        }
      ),
    ],
  });

  // Create tools that wrap the specialized agents
  const researcherTool = tool(
    async (input: { query: string }) => {
      const response = await researcherAgent.invoke({
        messages: [new HumanMessage(input.query)],
      });
      return response.messages[response.messages.length - 1].content.toString();
    },
    {
      name: "researcher",
      description: "Use the researcher agent to find information on a topic",
      schema: z.object({
        query: z.string().describe("What to research"),
      }),
    }
  );

  const analyzerTool = tool(
    async (input: { query: string }) => {
      const response = await analyzerAgent.invoke({
        messages: [new HumanMessage(input.query)],
      });
      return response.messages[response.messages.length - 1].content.toString();
    },
    {
      name: "analyzer",
      description: "Use the analyzer agent to analyze data or trends",
      schema: z.object({
        query: z.string().describe("What to analyze"),
      }),
    }
  );

  const writerTool = tool(
    async (input: { query: string }) => {
      const response = await writerAgent.invoke({
        messages: [new HumanMessage(input.query)],
      });
      return response.messages[response.messages.length - 1].content.toString();
    },
    {
      name: "writer",
      description: "Use the writer agent to format content into a professional report",
      schema: z.object({
        query: z.string().describe("Content to format"),
      }),
    }
  );

  // Coordinator Agent
  const coordinator = createReactAgent({
    llm: model,
    tools: [researcherTool, analyzerTool, writerTool],
  });

  console.log("🎯 Multi-Agent System Active\n");
  console.log("   - Coordinator: Routes tasks to specialists");
  console.log("   - Researcher: Finds information");
  console.log("   - Analyzer: Analyzes data");
  console.log("   - Writer: Formats output\n");
  console.log("=".repeat(80) + "\n");

  const complexQueries = [
    "Research artificial intelligence, analyze its market trends, and create a formatted report",
    "Find information about blockchain and analyze user behavior in that space",
  ];

  for (const query of complexQueries) {
    console.log(`📋 Task: ${query}\n`);
    console.log("─".repeat(80) + "\n");

    const response = await coordinator.invoke({
      messages: [new HumanMessage(query)],
    });

    const lastMessage = response.messages[response.messages.length - 1];
    console.log(`\n📄 Final Output:\n${lastMessage.content}\n`);
    console.log("=".repeat(80) + "\n");
  }

  console.log("💡 Multi-Agent System Features:");
  console.log("   ✓ Specialized agents for different tasks");
  console.log("   ✓ Coordinator routes to appropriate specialist");
  console.log("   ✓ Agents can call other agents");
  console.log("   ✓ Complex queries broken down automatically");
  console.log("   ✓ Final output combines all agent insights");
}

main().catch(console.error);
