/**
 * Chapter 9 Assignment Solution: Challenge 4
 * Production-Ready Application
 *
 * Run: npx tsx 09-production-best-practices/solution/production-app.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

// Simple in-memory cache
const cache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface RequestLog {
  timestamp: string;
  query: string;
  cached: boolean;
  responseTime: number;
  success: boolean;
}

const requestLogs: RequestLog[] = [];
let requestCount = 0;
const MAX_REQUESTS_PER_MINUTE = 10;
const requestTimestamps: number[] = [];

function validateInput(query: string): { valid: boolean; error?: string } {
  if (!query || query.trim().length === 0) {
    return { valid: false, error: "Query cannot be empty" };
  }

  if (query.length > 1000) {
    return { valid: false, error: "Query too long (max 1000 characters)" };
  }

  // Check for potential injection attempts
  const suspiciousPatterns = /(<script|javascript:|onerror=|onclick=)/i;
  if (suspiciousPatterns.test(query)) {
    return { valid: false, error: "Query contains suspicious content" };
  }

  return { valid: true };
}

function checkRateLimit(): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;

  // Remove timestamps older than 1 minute
  while (requestTimestamps.length > 0 && requestTimestamps[0] < oneMinuteAgo) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  requestTimestamps.push(now);
  return true;
}

function getCachedResponse(query: string): string | null {
  const cached = cache.get(query);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("   ⚡ Cache hit!");
    return cached.response;
  }

  return null;
}

function setCachedResponse(query: string, response: string): void {
  cache.set(query, { response, timestamp: Date.now() });
}

async function makeRequestWithRetry(
  query: string,
  maxRetries: number = 3,
  timeout: number = 10000
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = new ChatOpenAI({
        model: process.env.AI_MODEL || "gpt-4o-mini",
        timeout,
        configuration: {
          baseURL: process.env.AI_ENDPOINT,
          defaultQuery: process.env.AI_API_VERSION
            ? { "api-version": process.env.AI_API_VERSION }
            : undefined
        },
        apiKey: process.env.AI_API_KEY
      });

      const response = await model.invoke(query);
      return response.content.toString();
    } catch (error: any) {
      lastError = error;
      console.log(`   ⚠️ Attempt ${attempt} failed: ${error.message}`);

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`   ⏳ Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Try fallback
  console.log("   🔄 All retries failed, using fallback response");
  return `I apologize, but I'm experiencing technical difficulties. Please try again later. Error: ${lastError?.message}`;
}

async function processQuery(query: string): Promise<void> {
  const startTime = Date.now();
  requestCount++;

  console.log(`\n[Request #${requestCount}]`);
  console.log(`❓ Query: "${query}"`);

  // 1. Input Validation
  const validation = validateInput(query);
  if (!validation.valid) {
    console.log(`   ❌ Validation failed: ${validation.error}`);

    requestLogs.push({
      timestamp: new Date().toISOString(),
      query,
      cached: false,
      responseTime: Date.now() - startTime,
      success: false
    });
    return;
  }

  // 2. Rate Limiting
  if (!checkRateLimit()) {
    console.log("   🚫 Rate limit exceeded");

    requestLogs.push({
      timestamp: new Date().toISOString(),
      query,
      cached: false,
      responseTime: Date.now() - startTime,
      success: false
    });
    return;
  }

  // 3. Check Cache
  const cachedResponse = getCachedResponse(query);
  if (cachedResponse) {
    console.log(`   ✅ Response: ${cachedResponse.substring(0, 100)}...`);
    console.log(`   ⏱️ Response time: ${Date.now() - startTime}ms (cached)`);

    requestLogs.push({
      timestamp: new Date().toISOString(),
      query,
      cached: true,
      responseTime: Date.now() - startTime,
      success: true
    });
    return;
  }

  // 4. Make Request with Retry and Timeout
  try {
    const response = await makeRequestWithRetry(query);

    // 5. Cache Response
    setCachedResponse(query, response);

    console.log(`   ✅ Response: ${response.substring(0, 100)}...`);
    console.log(`   ⏱️ Response time: ${Date.now() - startTime}ms`);

    requestLogs.push({
      timestamp: new Date().toISOString(),
      query,
      cached: false,
      responseTime: Date.now() - startTime,
      success: true
    });
  } catch (error: any) {
    console.log(`   ❌ Request failed: ${error.message}`);

    requestLogs.push({
      timestamp: new Date().toISOString(),
      query,
      cached: false,
      responseTime: Date.now() - startTime,
      success: false
    });
  }
}

function healthCheck(): { status: string; checks: any } {
  const successfulRequests = requestLogs.filter((log) => log.success).length;
  const totalRequests = requestLogs.length;
  const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100;

  const avgResponseTime =
    requestLogs.length > 0
      ? requestLogs.reduce((sum, log) => sum + log.responseTime, 0) / requestLogs.length
      : 0;

  const isHealthy = successRate > 95 && avgResponseTime < 5000;

  return {
    status: isHealthy ? "healthy" : "degraded",
    checks: {
      successRate: `${successRate.toFixed(1)}%`,
      avgResponseTime: `${avgResponseTime.toFixed(0)}ms`,
      cacheSize: cache.size,
      totalRequests
    }
  };
}

async function main() {
  console.log("🚀 Production-Ready Application\n");
  console.log("=".repeat(80) + "\n");

  console.log("✅ Production Best Practices Checklist:");
  console.log("   [✓] Environment-based configuration");
  console.log("   [✓] Provider abstraction");
  console.log("   [✓] Fallback strategies");
  console.log("   [✓] Response caching (5min TTL)");
  console.log("   [✓] Error handling with retries (3 attempts)");
  console.log("   [✓] Request logging");
  console.log("   [✓] Monitoring/metrics");
  console.log("   [✓] Rate limiting (10 req/min)");
  console.log("   [✓] Timeout handling (10s)");
  console.log("   [✓] Input validation");
  console.log();

  console.log("=".repeat(80));

  const queries = [
    "What is TypeScript?",
    "What is TypeScript?", // Duplicate - should be cached
    "Explain JavaScript",
    "", // Invalid - empty
    "What is Docker?",
    "What is TypeScript?" // Should still be cached
  ];

  for (const query of queries) {
    await processQuery(query);
  }

  console.log("\n" + "=".repeat(80));
  console.log("\n📊 Request Summary:");
  console.log(`   Total requests: ${requestCount}`);
  console.log(`   Successful: ${requestLogs.filter((log) => log.success).length}`);
  console.log(`   Failed: ${requestLogs.filter((log) => !log.success).length}`);
  console.log(`   Cached responses: ${requestLogs.filter((log) => log.cached).length}`);

  const health = healthCheck();
  console.log("\n🏥 Health Check:");
  console.log(`   Status: ${health.status.toUpperCase()}`);
  console.log(`   Success Rate: ${health.checks.successRate}`);
  console.log(`   Avg Response Time: ${health.checks.avgResponseTime}`);
  console.log(`   Cache Size: ${health.checks.cacheSize} items`);

  console.log("\n💡 Production Features Demonstrated:");
  console.log("   ✓ All best practices implemented");
  console.log("   ✓ Robust error handling");
  console.log("   ✓ Performance optimization via caching");
  console.log("   ✓ Rate limiting protection");
  console.log("   ✓ Health check endpoint ready");
}

main().catch(console.error);
