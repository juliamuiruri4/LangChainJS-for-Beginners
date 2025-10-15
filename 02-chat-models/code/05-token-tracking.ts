/**
 * Token Usage Tracking Example
 * Run: npx tsx 02-chat-models/code/05-token-tracking.ts
 */

import { createChatModel } from "@/scripts/create-model.js";
import "dotenv/config";

async function trackTokenUsage() {
  const model = createChatModel();

  console.log("📊 Token Usage Tracking Example\n");

  // Make a request
  const response = await model.invoke(
    "Explain what TypeScript is in 2 sentences."
  );

  // Extract token usage from metadata
  const usage = response.response_metadata?.tokenUsage;

  if (usage) {
    console.log("Token Breakdown:");
    console.log(`  Prompt tokens:     ${usage.promptTokens}`);
    console.log(`  Completion tokens: ${usage.completionTokens}`);
    console.log(`  Total tokens:      ${usage.totalTokens}`);
  } else {
    console.log("⚠️  Token usage information not available in response metadata.");
  }

  console.log("\n📝 Response:");
  console.log(response.content);
}

trackTokenUsage().catch(console.error);
