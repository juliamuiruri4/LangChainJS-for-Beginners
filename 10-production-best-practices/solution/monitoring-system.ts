/**
 * Chapter 9 Assignment Solution: Challenge 3
 * Monitoring Dashboard
 *
 * Run: npx tsx 09-production-best-practices/solution/monitoring-system.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { promises as fs } from "fs";
import * as path from "path";
import "dotenv/config";

interface MetricData {
  timestamp: string;
  query: string;
  success: boolean;
  responseTime: number;
  tokens: number;
  cost: number;
  error?: string;
}

class MonitoringSystem {
  private metrics: MetricData[] = [];
  private startTime: number = Date.now();

  async logRequest(data: MetricData): Promise<void> {
    this.metrics.push(data);
  }

  getStats() {
    const total = this.metrics.length;
    const successful = this.metrics.filter((m) => m.success).length;
    const failed = total - successful;
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    const responseTimes = this.metrics.map((m) => m.responseTime);
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0;

    const totalTokens = this.metrics.reduce((sum, m) => sum + m.tokens, 0);
    const totalCost = this.metrics.reduce((sum, m) => sum + m.cost, 0);

    const errorCounts: Record<string, number> = {};
    this.metrics
      .filter((m) => !m.success && m.error)
      .forEach((m) => {
        const errorType = m.error!.split(":")[0];
        errorCounts[errorType] = (errorCounts[errorType] || 0) + 1;
      });

    return {
      total,
      successful,
      failed,
      successRate,
      avgResponseTime,
      totalTokens,
      totalCost,
      errorCounts,
      uptime: Date.now() - this.startTime,
    };
  }

  displayDashboard(): void {
    const stats = this.getStats();

    console.log("\n" + "=".repeat(80));
    console.log("📊 LangChain Monitoring Dashboard");
    console.log("=".repeat(80));
    console.log(`Requests:     ${stats.total}`);
    console.log(`Success:      ${stats.successful} (${stats.successRate.toFixed(1)}%)`);
    console.log(`Errors:       ${stats.failed} (${(100 - stats.successRate).toFixed(1)}%)`);
    console.log(`Avg Time:     ${(stats.avgResponseTime / 1000).toFixed(2)}s`);
    console.log(`Total Tokens: ${stats.totalTokens.toLocaleString()}`);
    console.log(`Total Cost:   $${stats.totalCost.toFixed(4)}`);
    console.log(`Uptime:       ${Math.floor(stats.uptime / 1000)}s`);
    console.log("=".repeat(80));

    if (Object.keys(stats.errorCounts).length > 0) {
      console.log(`\n❌ Error Summary:`);
      Object.entries(stats.errorCounts).forEach(([error, count]) => {
        console.log(`   - ${error}: ${count} occurrence(s)`);
      });
      console.log();
    }
  }

  async exportJSON(filepath: string): Promise<void> {
    const stats = this.getStats();
    const exportData = {
      generatedAt: new Date().toISOString(),
      summary: stats,
      requests: this.metrics,
    };

    await fs.writeFile(filepath, JSON.stringify(exportData, null, 2));
    console.log(`\n📁 Metrics exported to: ${filepath}`);
  }

  async exportCSV(filepath: string): Promise<void> {
    const header = "Timestamp,Query,Success,ResponseTime(ms),Tokens,Cost,Error\n";
    const rows = this.metrics
      .map(
        (m) =>
          `${m.timestamp},"${m.query.replace(/"/g, '""')}",${m.success},${m.responseTime},${m.tokens},${m.cost},"${
            m.error || ""
          }"`
      )
      .join("\n");

    await fs.writeFile(filepath, header + rows);
    console.log(`\n📊 Metrics exported to: ${filepath}`);
  }

  getHealthCheck(): { status: string; details: any } {
    const stats = this.getStats();

    const isHealthy = stats.successRate > 90 && stats.avgResponseTime < 5000 && stats.failed < 10;

    return {
      status: isHealthy ? "healthy" : "degraded",
      details: {
        successRate: `${stats.successRate.toFixed(1)}%`,
        avgResponseTime: `${(stats.avgResponseTime / 1000).toFixed(2)}s`,
        errorCount: stats.failed,
        uptime: `${Math.floor(stats.uptime / 1000)}s`,
      },
    };
  }
}

async function makeRequest(monitor: MonitoringSystem, query: string, shouldFail: boolean = false): Promise<void> {
  const startTime = Date.now();

  try {
    if (shouldFail) {
      throw new Error("Simulated failure");
    }

    const model = new ChatOpenAI({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      configuration: {
        baseURL: process.env.AI_ENDPOINT,
        defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
      },
      apiKey: process.env.AI_API_KEY,
    });

    const response = await model.invoke(query);
    const responseTime = Date.now() - startTime;

    const tokens = Math.ceil((query.length + response.content.toString().length) / 4);
    const cost = (tokens / 1_000_000) * 0.15;

    await monitor.logRequest({
      timestamp: new Date().toISOString(),
      query,
      success: true,
      responseTime,
      tokens,
      cost,
    });

    console.log(`✅ Success: ${query.substring(0, 50)}... (${responseTime}ms)`);
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    await monitor.logRequest({
      timestamp: new Date().toISOString(),
      query,
      success: false,
      responseTime,
      tokens: 0,
      cost: 0,
      error: error.message,
    });

    console.log(`❌ Error: ${query.substring(0, 50)}... (${error.message})`);
  }
}

async function main() {
  console.log("📊 Monitoring System Demo\n");
  console.log("=".repeat(80) + "\n");

  const monitor = new MonitoringSystem();

  const queries = [
    { text: "What is TypeScript?", shouldFail: false },
    { text: "Explain JavaScript promises", shouldFail: false },
    { text: "What is Docker?", shouldFail: false },
    { text: "Simulated timeout error", shouldFail: true },
    { text: "What are microservices?", shouldFail: false },
    { text: "Another simulated error", shouldFail: true },
    { text: "Explain REST APIs", shouldFail: false },
  ];

  console.log("🚀 Simulating requests...\n");

  for (const query of queries) {
    await makeRequest(monitor, query.text, query.shouldFail);
  }

  // Display dashboard
  monitor.displayDashboard();

  // Health check
  const health = monitor.getHealthCheck();
  console.log(`\n🏥 Health Check: ${health.status.toUpperCase()}`);
  console.log(JSON.stringify(health.details, null, 2));

  // Export metrics
  const exportDir = path.join(process.cwd(), "data", "metrics-exports");
  try {
    await fs.mkdir(exportDir, { recursive: true });

    await monitor.exportJSON(path.join(exportDir, "metrics.json"));
    await monitor.exportCSV(path.join(exportDir, "metrics.csv"));

    console.log("\n💡 Monitoring System Features:");
    console.log("   ✓ Real-time metrics tracking");
    console.log("   ✓ Success/error rate monitoring");
    console.log("   ✓ Response time tracking");
    console.log("   ✓ Cost monitoring");
    console.log("   ✓ Health check endpoint");
    console.log("   ✓ Export to JSON and CSV");
  } catch (error) {
    console.log("\n⚠️ Could not export files (permissions may be needed)");
  }
}

main().catch(console.error);
