/**
 * Error Handling and Retries
 * Run: npx tsx 02-chat-models/code/05-error-handling.ts
 *
 * 🤖 Try asking GitHub Copilot Chat (https://github.com/features/copilot):
 * - "Explain how the exponential backoff calculation works in this retry logic"
 * - "How can I add different error handling for rate limit vs network errors?"
 * - "What's the purpose of the setTimeout with Promise in the retry logic?"
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

/**
 * Makes an API call with automatic retry logic
 */
async function robustCall(prompt: string, maxRetries = 3): Promise<string> {
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
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
      model: process.env.AI_MODEL,
      configuration: { baseURL: process.env.AI_ENDPOINT },
      apiKey: process.env.AI_API_KEY,
    });

    await badModel.invoke("Hello");
  } catch (error: any) {
    console.log("❌ Caught error:", error.message);
    console.log("💡 Solution: Check your API key in .env file\n");
  }

  // Example 2: Network timeout (simulated with very short timeout)
  console.log("\n2️⃣  Example: Timeout Handling\n");

  // Skip timeout test in CI mode (unreliable with some providers)
  if (process.env.CI === "true") {
    console.log("⏭️  Skipped in CI mode (timeout behavior varies by provider)");
    console.log("💡 Timeout errors happen when requests take too long\n");
  } else {
    try {
      const timeoutModel = new ChatOpenAI({
        model: process.env.AI_MODEL,
        configuration: { baseURL: process.env.AI_ENDPOINT },
        apiKey: process.env.AI_API_KEY,
      });

      await timeoutModel.invoke("Write a detailed essay about the history of computing");
    } catch (error: any) {
      console.log(
        "❌ Caught error:",
        error.message?.includes("timeout") ? "Request timeout" : error.message
      );
      console.log("💡 Solution: Increase timeout or retry\n");
    }
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
   const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY
  });

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
