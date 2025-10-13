/**
 * Chapter 1 Assignment Solution: Challenge 1
 * Verify Setup
 *
 * Run: npx tsx 01-introduction/solution/verify-setup.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function main() {
  console.log("🔍 Verifying LangChain.js Setup...\n");

  // Check if API key is set
  if (!process.env.AI_API_KEY) {
    console.error("❌ Error: AI_API_KEY environment variable is not set!");
    console.log("\n💡 To fix this:");
    console.log("   1. Copy .env.example to .env");
    console.log("   2. Add your API key to the .env file");
    console.log("   3. Run this script again\n");
    process.exit(1);
  }

  console.log("✅ AI_API_KEY is set");

  // Try to make a simple API call
  try {
    console.log("🔄 Testing connection to AI model...\n");

    const model = new ChatOpenAI({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      configuration: {
        baseURL: process.env.AI_ENDPOINT,
        defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
      },
      apiKey: process.env.AI_API_KEY,
    });

    const response = await model.invoke("Say 'Hello from LangChain!'");

    console.log("🤖 AI Response:", response.content);
    console.log("\n✅ Setup verified! Everything is working correctly!");
    console.log("\n📊 Configuration:");
    console.log(`   Model: ${process.env.AI_MODEL || "gpt-4o-mini"}`);
    console.log(`   Endpoint: ${process.env.AI_ENDPOINT || "default"}`);

  } catch (error) {
    console.error("\n❌ Setup verification failed!");

    if (error instanceof Error) {
      console.error(`\n❌ Error: ${error.message}\n`);

      if (error.message.includes("404")) {
        console.log("💡 This looks like a 404 Resource not found error:");
        console.log("   - For Azure: Verify the model deployment name matches AI_MODEL");
        console.log("   - For Azure: Ensure AI_API_VERSION is set (e.g., 2024-02-15-preview)");
        console.log("   - Check that AI_ENDPOINT points to the correct resource");
        console.log("   - Verify the model is deployed at that endpoint");
      } else if (error.message.includes("401") || error.message.includes("authentication")) {
        console.log("💡 This looks like an authentication error:");
        console.log("   - Check that your API key is correct");
        console.log("   - Make sure it has not expired");
      } else if (error.message.includes("network") || error.message.includes("ENOTFOUND")) {
        console.log("💡 This looks like a network error:");
        console.log("   - Check your internet connection");
        console.log("   - Verify the AI_ENDPOINT is correct");
      } else {
        console.log("💡 For help, check:");
        console.log("   - Course Setup documentation");
        console.log("   - Discord community");
      }
    }

    process.exit(1);
  }
}

main().catch(console.error);
