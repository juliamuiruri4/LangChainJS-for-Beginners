/**
 * Chapter 7 Assignment Solution: Challenge 2
 * Research Agent
 *
 * Run: npx tsx 07-langgraph-agents-tools/solution/research-agent.ts
 */

import { tool } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "langchain";
import * as z from "zod";
import "dotenv/config";

// Simulated knowledge base for research
const knowledgeBase: Record<string, string> = {
  javascript: `JavaScript is a high-level, interpreted programming language. Created by Brendan Eich in 1995 at Netscape.
Key features: dynamic typing, first-class functions, prototype-based OOP.
Major milestones: ES6 (2015) introduced classes, arrow functions, promises. Node.js (2009) enabled server-side JavaScript.
Used for: web development, server applications, mobile apps, desktop applications.`,

  "machine learning": `Machine Learning is a subset of artificial intelligence focused on algorithms that improve through experience.
Types: Supervised learning (labeled data), Unsupervised learning (patterns in unlabeled data), Reinforcement learning (reward-based).
Key algorithms: Linear regression, decision trees, neural networks, support vector machines.
Applications: image recognition, natural language processing, recommendation systems, autonomous vehicles.`,

  typescript: `TypeScript is a strongly typed superset of JavaScript developed by Microsoft (2012).
Key features: static typing, interfaces, generics, type inference.
Benefits: early error detection, better IDE support, improved code maintainability.
Compiles to JavaScript. Widely used in large-scale applications, especially with React, Angular, and Node.js.`,

  python: `Python is a high-level, interpreted programming language created by Guido van Rossum (1991).
Features: simple syntax, dynamic typing, extensive standard library, multiple paradigms.
Popular frameworks: Django, Flask (web), NumPy, Pandas (data), TensorFlow, PyTorch (ML).
Used for: web development, data science, machine learning, automation, scientific computing.`,

  docker: `Docker is a platform for developing, shipping, and running applications in containers (2013).
Containers: Lightweight, portable, isolated environments that package applications with dependencies.
Key concepts: Images (blueprints), containers (running instances), Docker Hub (registry), Dockerfile (build instructions).
Benefits: consistency across environments, faster deployment, resource efficiency, microservices architecture.`,
};

async function main() {
  console.log("📚 Research Agent\n");
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

  // Tool 1: Web Search (simulated)
  const searchTool = tool(
    async (input) => {
      const query = input.query.toLowerCase();

      // Find matching topics
      for (const [topic, content] of Object.entries(knowledgeBase)) {
        if (query.includes(topic)) {
          return `Search results for "${input.query}":\n\n${content}\n\nSource: Research Database`;
        }
      }

      return `No specific information found for "${input.query}". Try searching for: JavaScript, Machine Learning, TypeScript, Python, or Docker.`;
    },
    {
      name: "web_search",
      description: "Search for information on a topic. Returns detailed information if found.",
      schema: z.object({
        query: z.string().describe("The search query or topic to research"),
      }),
    }
  );

  // Tool 2: Summarizer
  const summarizerTool = tool(
    async (input) => {
      const summaryPrompt = `Summarize the following text in 2-3 concise bullet points, focusing on the most important information:\n\n${input.text}`;

      const response = await model.invoke(summaryPrompt);
      return response.content;
    },
    {
      name: "summarize",
      description: "Summarize long text into key points",
      schema: z.object({
        text: z.string().describe("The text to summarize"),
      }),
    }
  );

  // Tool 3: Citation Formatter
  const citationTool = tool(
    async (input) => {
      const citations = input.sources.map((source, index) => {
        return `[${index + 1}] ${source}`;
      });

      return `\n\nReferences:\n${citations.join("\n")}`;
    },
    {
      name: "format_citations",
      description: "Format a list of sources as citations",
      schema: z.object({
        sources: z.array(z.string()).describe("Array of source strings to format as citations"),
      }),
    }
  );

  const agent = createReactAgent({
    llm: model,
    tools: [searchTool, summarizerTool, citationTool],
  });

  const queries = [
    "Research the history of JavaScript and provide a summary",
    "Find information about machine learning and summarize the key types",
    "What is TypeScript? Give me a summary with citations",
  ];

  for (const query of queries) {
    console.log(`🔍 Research Query: ${query}\n`);
    console.log("─".repeat(80) + "\n");

    const response = await agent.invoke({
      messages: [new HumanMessage(query)],
    });

    const lastMessage = response.messages[response.messages.length - 1];
    console.log(`📊 Research Report:\n${lastMessage.content}\n`);
    console.log("=".repeat(80) + "\n");
  }

  console.log("💡 Research Agent Features:");
  console.log("   ✓ Searches for information on topics");
  console.log("   ✓ Summarizes findings into key points");
  console.log("   ✓ Formats citations professionally");
  console.log("   ✓ Chains tools together for comprehensive research");
}

main().catch(console.error);
