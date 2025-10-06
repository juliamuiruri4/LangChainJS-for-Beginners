/**
 * Challenge 1 Solution: Verify Setup
 *
 * This script verifies that your environment is correctly configured.
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function verifySetup() {
  console.log("🔍 Verifying setup...\n");

  // Check if AI_API_KEY is set
  if (!process.env.AI_API_KEY) {
    console.error("❌ ERROR: AI_API_KEY not found in .env file");
    console.log("\n📝 Next steps:");
    console.log("1. Create a .env file in the project root");
    console.log("2. Add: AI_API_KEY=your_token_here");
    console.log("3. Get a token at: https://github.com/settings/tokens");
    process.exit(1);
  }

  console.log("✅ AI_API_KEY found");
  try {
    console.log("🧪 Testing API connection...\n");

    const model = new ChatOpenAI({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      configuration: {
        baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION ? { "api-version": process.env.AI_API_VERSION } : undefined,
      },
      apiKey: process.env.AI_API_KEY,
    });

    const response = await model.invoke("Say 'Hello from LangChain.js!' if you can read this.");

    console.log("✅ API connection successful!");
    console.log(`🤖 Response: ${response.content}\n`);
    console.log("🎉 Setup verified! You're ready to go!");
  } catch (error: any) {
    console.error("❌ API connection failed");
    console.error(`Error: ${error.message}\n`);
    console.log("📝 Troubleshooting:");
    console.log("1. Check that your AI_API_KEY is valid");
    console.log("2. Verify you have no extra spaces in .env");
    console.log("3. Try creating a new token");
    process.exit(1);
  }
}

verifySetup();
