/**
 * Loading Text Files
 * Run: npx tsx 04-working-with-documents/code/01-load-text.ts
 */

import { TextLoader } from "langchain/document_loaders/fs/text";
import { writeFileSync, mkdirSync } from "fs";

async function main() {
  console.log("📄 Loading Text Files Example\n");

  // Create data directory if it doesn't exist
  try {
    mkdirSync("./data", { recursive: true });
  } catch (e) {
    // Directory already exists
  }

  // Create sample text file
  const sampleText = `
LangChain.js: A Framework for AI Applications

LangChain.js is a framework for building applications with large language models.
It provides a comprehensive set of tools and abstractions that make it easier
to work with LLMs in production environments.

Key Features:
- Model Abstraction: Work with different AI providers using the same interface
- Prompt Management: Create reusable, testable prompts with templates
- Document Processing: Load, split, and manage documents efficiently
- Vector Stores: Store and retrieve embeddings for semantic search
- Chains: Combine multiple operations into cohesive workflows
- Agents: Build AI systems that can make decisions and use tools
- Memory: Maintain conversation context across interactions

The framework is designed to be modular and composable, allowing developers
to build complex AI applications by combining simple, reusable components.

Getting Started:
Install LangChain.js using npm or yarn, configure your API keys, and start
building AI-powered applications with just a few lines of code.
`.trim();

  writeFileSync("./data/sample.txt", sampleText);
  console.log("✅ Created sample.txt in ./data/\n");

  // Load the document
  const loader = new TextLoader("./data/sample.txt");
  const docs = await loader.load();

  console.log(`📚 Loaded ${docs.length} document(s)\n`);

  // Examine the loaded document
  console.log("Document Properties:");
  console.log("─".repeat(80));
  console.log("\n📝 Content (first 200 characters):");
  console.log(docs[0].pageContent.substring(0, 200) + "...\n");

  console.log("🏷️  Metadata:");
  console.log(docs[0].metadata);

  console.log("\n📊 Statistics:");
  console.log(`   Total characters: ${docs[0].pageContent.length}`);
  console.log(`   Total lines: ${docs[0].pageContent.split("\n").length}`);
  console.log(`   Approximate words: ${docs[0].pageContent.split(/\s+/).length}`);

  console.log("\n✅ Text file loaded successfully!");
}

main().catch(console.error);
