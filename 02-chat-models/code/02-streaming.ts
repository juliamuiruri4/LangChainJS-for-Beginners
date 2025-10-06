/**
 * Example 2: Streaming Responses
 *
 * Stream responses word-by-word for better user experience.
 * Perfect for long responses where users want immediate feedback.
 *
 * Run: npx tsx 02-chat-models/code/02-streaming.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function nonStreamingExample() {
  console.log("📝 Non-Streaming (traditional way):\n");

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    configuration: {
      baseURL: "https://models.inference.ai.azure.com",
    },
    apiKey: process.env.GITHUB_TOKEN,
  });

  const startTime = Date.now();
  const response = await model.invoke("Explain how the internet works in 2 paragraphs.");
  const endTime = Date.now();

  console.log(response.content);
  console.log(`\n⏱️  Received after: ${endTime - startTime}ms\n`);
}

async function streamingExample() {
  console.log("\n" + "=".repeat(80));
  console.log("⚡ Streaming (appears immediately):\n");

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    configuration: {
      baseURL: "https://models.inference.ai.azure.com",
    },
    apiKey: process.env.GITHUB_TOKEN,
  });

  const startTime = Date.now();
  let firstChunkTime = 0;

  // Stream the response chunk by chunk
  const stream = await model.stream("Explain how the internet works in 2 paragraphs.");

  for await (const chunk of stream) {
    if (firstChunkTime === 0) {
      firstChunkTime = Date.now();
    }
    // Write each chunk as it arrives (no newline)
    process.stdout.write(chunk.content);
  }

  const endTime = Date.now();

  console.log("\n");
  console.log(`⏱️  First chunk arrived: ${firstChunkTime - startTime}ms`);
  console.log(`⏱️  Stream completed: ${endTime - startTime}ms`);
  console.log("\n✅ Notice how streaming feels more responsive!");
}

async function main() {
  console.log("🎯 Comparing Streaming vs Non-Streaming\n");
  console.log("=".repeat(80));

  await nonStreamingExample();
  await streamingExample();

  console.log("\n💡 Key Insight:");
  console.log("   Streaming provides immediate feedback, making your app feel faster!");
}

main().catch(console.error);
