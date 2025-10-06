/**
 * Example 4: Error Handling and Retries
 *
 * Learn how to handle errors gracefully and implement retry logic
 * for resilient applications.
 *
 * Run: npx tsx 02-chat-models/code/04-error-handling.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

/**
 * Makes an API call with automatic retry logic
 */
async function robustCall(prompt: string, maxRetries = 3): Promise<string> {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    configuration: {
      baseURL: "https://models.inference.ai.azure.com",
    },
    apiKey: process.env.GITHUB_TOKEN,
    timeout: 30000, // 30 second timeout
  });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}...`);

      const response = await model.invoke(prompt);
      console.log(`✅ Success on attempt ${attempt}!`);

      return response.content.toString();
    } catch (error: any) {
      console.error(`❌ Attempt ${attempt} failed: ${error.message}`);

      // Check if this is the last attempt
      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }

      // Exponential backoff: wait longer after each failure
      const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s, etc.
      console.log(`⏳ Waiting ${waitTime}ms before retry...\n`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw new Error("Unexpected error in robustCall");
}

/**
 * Demonstrates different error scenarios
 */
async function errorExamples() {
  console.log("🛡️  Error Handling Examples\n");
  console.log("=".repeat(80));

  // Example 1: Invalid API key
  console.log("\n1️⃣  Example: Invalid API Key\n");
  try {
    const badModel = new ChatOpenAI({
      model: "gpt-4o-mini",
      configuration: {
        baseURL: "https://models.inference.ai.azure.com",
      },
      apiKey: "invalid_key_12345",
    });

    await badModel.invoke("Hello");
  } catch (error: any) {
    console.log("❌ Caught error:", error.message);
    console.log("💡 Solution: Check your API key in .env file\n");
  }

  // Example 2: Network timeout (simulated with very short timeout)
  console.log("\n2️⃣  Example: Timeout Handling\n");
  try {
    const timeoutModel = new ChatOpenAI({
      model: "gpt-4o-mini",
      configuration: {
        baseURL: "https://models.inference.ai.azure.com",
      },
      apiKey: process.env.GITHUB_TOKEN,
      timeout: 1, // Unreasonably short timeout
    });

    await timeoutModel.invoke("Write a long essay");
  } catch (error: any) {
    console.log("❌ Caught error: Request timeout");
    console.log("💡 Solution: Increase timeout or retry\n");
  }

  // Example 3: Successful retry
  console.log("\n3️⃣  Example: Retry Logic (Success)\n");
  try {
    const response = await robustCall("What is 2+2?");
    console.log("\n🤖 Response:", response);
  } catch (error: any) {
    console.log("\n❌ All retries failed:", error.message);
  }
}

/**
 * Best practices for error handling
 */
function showBestPractices() {
  console.log("\n\n📋 Error Handling Best Practices\n");
  console.log("=".repeat(80));

  console.log(`
1. ✅ Always wrap API calls in try-catch
   try {
     const response = await model.invoke(prompt);
   } catch (error) {
     console.error("Error:", error.message);
   }

2. ✅ Implement exponential backoff for retries
   const waitTime = Math.pow(2, attempt) * 1000;

3. ✅ Set reasonable timeouts
   const model = new ChatOpenAI({ timeout: 30000 });

4. ✅ Log errors for debugging
   console.error("API Error:", error.message, error.stack);

5. ✅ Provide helpful error messages to users
   "Sorry, I'm having trouble connecting. Please try again."

6. ✅ Have fallback behavior
   if (apiCallFails) {
     return cachedResponse || defaultResponse;
   }

7. ✅ Monitor error rates in production
   Track failed requests to identify issues early
`);
}

async function main() {
  await errorExamples();
  showBestPractices();

  console.log("\n✅ Remember: Good error handling makes your app reliable!");
}

main();
