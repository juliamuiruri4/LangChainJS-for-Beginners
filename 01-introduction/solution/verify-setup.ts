/**
 * Challenge 1 Solution: Verify Setup
 *
 * This script verifies that your environment is correctly configured.
 */

import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function verifySetup() {
  console.log("🔍 Verifying setup...\n");

  // Check if GITHUB_TOKEN is set
  if (!process.env.GITHUB_TOKEN) {
    console.error("❌ ERROR: GITHUB_TOKEN not found in .env file");
    console.log("\n📝 Next steps:");
    console.log("1. Create a .env file in the project root");
    console.log("2. Add: GITHUB_TOKEN=your_token_here");
    console.log("3. Get a token at: https://github.com/settings/tokens");
    process.exit(1);
  }

  console.log("✅ GITHUB_TOKEN found");

  // Test API call
  try {
    console.log("🧪 Testing API connection...\n");

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      configuration: {
        baseURL: "https://models.inference.ai.azure.com",
      },
      apiKey: process.env.GITHUB_TOKEN,
    });

    const response = await model.invoke("Say 'Hello from LangChain.js!' if you can read this.");

    console.log("✅ API connection successful!");
    console.log(`🤖 Response: ${response.content}\n`);
    console.log("🎉 Setup verified! You're ready to go!");
  } catch (error: any) {
    console.error("❌ API connection failed");
    console.error(`Error: ${error.message}\n`);
    console.log("📝 Troubleshooting:");
    console.log("1. Check that your GITHUB_TOKEN is valid");
    console.log("2. Verify you have no extra spaces in .env");
    console.log("3. Try creating a new token");
    process.exit(1);
  }
}

verifySetup();
