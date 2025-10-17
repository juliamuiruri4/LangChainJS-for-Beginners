/**
 * Chapter 7 Assignment Solution: Challenge 3
 * Data Analysis Agent
 *
 * Run: npx tsx 07-langgraph-agents-tools/solution/data-analyst-agent.ts
 */

import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import "dotenv/config";

// Sample sales dataset
interface SalesData {
  product: string;
  sales: number;
  revenue: number;
  month: string;
}

const salesData: SalesData[] = [
  { product: "Widget A", sales: 150, revenue: 3000, month: "Jan" },
  { product: "Widget B", sales: 200, revenue: 5000, month: "Jan" },
  { product: "Widget C", sales: 120, revenue: 2400, month: "Jan" },
  { product: "Widget A", sales: 180, revenue: 3600, month: "Feb" },
  { product: "Widget B", sales: 220, revenue: 5500, month: "Feb" },
  { product: "Widget C", sales: 140, revenue: 2800, month: "Feb" },
  { product: "Widget A", sales: 160, revenue: 3200, month: "Mar" },
  { product: "Widget B", sales: 190, revenue: 4750, month: "Mar" },
  { product: "Widget C", sales: 130, revenue: 2600, month: "Mar" },
];

async function main() {
  console.log("📊 Data Analysis Agent\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-5-mini",
    temperature: 0,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Tool 1: Filter Data
  const filterTool = tool(
    async (input) => {
      const { field, value } = input;
      const filtered = salesData.filter((item: any) => item[field] === value);

      if (filtered.length === 0) {
        return `No data found for ${field} = ${value}`;
      }

      return JSON.stringify(filtered, null, 2);
    },
    {
      name: "filter_data",
      description: "Filter sales data by field and value (e.g., month='Jan', product='Widget A')",
      schema: z.object({
        field: z.enum(["product", "month"]).describe("The field to filter by"),
        value: z.string().describe("The value to filter for"),
      }),
    }
  );

  // Tool 2: Calculate Statistics
  const statsTool = tool(
    async (input) => {
      const { metric, operation } = input;
      const values = salesData.map((item: any) => item[metric]);

      let result: number;

      switch (operation) {
        case "sum":
          result = values.reduce((a, b) => a + b, 0);
          break;
        case "average":
          result = values.reduce((a, b) => a + b, 0) / values.length;
          break;
        case "min":
          result = Math.min(...values);
          break;
        case "max":
          result = Math.max(...values);
          break;
        default:
          return "Invalid operation";
      }

      return `${operation.toUpperCase()} of ${metric}: ${result.toFixed(2)}`;
    },
    {
      name: "calculate_stats",
      description: "Calculate statistics on sales or revenue (sum, average, min, max)",
      schema: z.object({
        metric: z.enum(["sales", "revenue"]).describe("The metric to calculate"),
        operation: z.enum(["sum", "average", "min", "max"]).describe("The calculation to perform"),
      }),
    }
  );

  // Tool 3: Find Top Items
  const topItemsTool = tool(
    async (input) => {
      const { metric, count } = input;

      // Group by product and sum
      const productTotals = salesData.reduce(
        (acc, item) => {
          if (!acc[item.product]) {
            acc[item.product] = { sales: 0, revenue: 0 };
          }
          acc[item.product].sales += item.sales;
          acc[item.product].revenue += item.revenue;
          return acc;
        },
        {} as Record<string, { sales: number; revenue: number }>
      );

      // Sort by metric
      const sorted = Object.entries(productTotals)
        .map(([product, data]) => ({ product, ...data }))
        .sort((a: any, b: any) => b[metric] - a[metric])
        .slice(0, count);

      return JSON.stringify(sorted, null, 2);
    },
    {
      name: "find_top_items",
      description: "Find top N products by sales or revenue",
      schema: z.object({
        metric: z.enum(["sales", "revenue"]).describe("What to rank by"),
        count: z.number().describe("How many top items to return"),
      }),
    }
  );

  // Tool 4: Compare Products
  const compareTool = tool(
    async (input) => {
      const { product1, product2 } = input;

      const data1 = salesData.filter((item) => item.product === product1);
      const data2 = salesData.filter((item) => item.product === product2);

      if (data1.length === 0 || data2.length === 0) {
        return "One or both products not found";
      }

      const total1 = data1.reduce((sum, item) => sum + item.sales, 0);
      const total2 = data2.reduce((sum, item) => sum + item.sales, 0);
      const revenue1 = data1.reduce((sum, item) => sum + item.revenue, 0);
      const revenue2 = data2.reduce((sum, item) => sum + item.revenue, 0);

      return `Comparison:
${product1}: ${total1} total sales, $${revenue1} revenue
${product2}: ${total2} total sales, $${revenue2} revenue
Difference: ${Math.abs(total1 - total2)} sales, $${Math.abs(revenue1 - revenue2)} revenue`;
    },
    {
      name: "compare_products",
      description: "Compare two products by their total sales and revenue",
      schema: z.object({
        product1: z.string().describe("First product name"),
        product2: z.string().describe("Second product name"),
      }),
    }
  );

  const agent = createReactAgent({
    llm: model,
    tools: [filterTool, statsTool, topItemsTool, compareTool],
  });

  console.log("📋 Sample Data Preview:");
  console.log(
    salesData
      .slice(0, 3)
      .map((d) => `${d.month}: ${d.product} - ${d.sales} sales, $${d.revenue}`)
      .join("\n")
  );
  console.log("...\n");
  console.log("=".repeat(80) + "\n");

  const questions = [
    "What was the total revenue in January?",
    "Which product had the highest sales overall?",
    "What's the average revenue per month?",
    "Compare Widget A and Widget B sales",
    "Show me the top 2 products by revenue",
  ];

  for (const question of questions) {
    console.log(`❓ ${question}\n`);

    const response = await agent.invoke({
      messages: [new HumanMessage(question)],
    });

    const lastMessage = response.messages[response.messages.length - 1];
    console.log(`📊 ${lastMessage.content}\n`);
    console.log("─".repeat(80) + "\n");
  }

  console.log("=".repeat(80));
  console.log("\n💡 Data Analysis Agent Features:");
  console.log("   ✓ Filters data by criteria");
  console.log("   ✓ Calculates statistics (sum, avg, min, max)");
  console.log("   ✓ Finds top performers");
  console.log("   ✓ Compares items side-by-side");
  console.log("   ✓ Answers analytical questions naturally");
}

main().catch(console.error);
