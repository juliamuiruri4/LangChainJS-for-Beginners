/**
 * Run: npx tsx 01-introduction/code/01-hello-world.ts
 */

import { createChatModel } from "@/scripts/create-model.js";
import "dotenv/config";

async function main() {
  console.log("🚀 Hello LangChain.js!\n");

  const model = createChatModel();

  const response = await model.invoke("What is LangChain in one sentence?");

  console.log("🤖 AI Response:", response.content);
  console.log("\n✅ Success! You just made your first LangChain.js call!");
}

main().catch(console.error);
