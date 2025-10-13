/**
 * Chapter 4 Assignment Solution: Challenge 1
 * Multi-Format Document Loader
 *
 * Run: npx tsx 04-working-with-documents/solution/multi-loader.ts
 */

import { TextLoader } from "langchain/document_loaders/fs/text";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { writeFileSync, mkdirSync } from "fs";
import "dotenv/config";

async function main() {
  console.log("📚 Multi-Format Document Loader\n");
  console.log("=".repeat(80) + "\n");

  // Create data directory
  try {
    mkdirSync("./data", { recursive: true });
  } catch (e) {
    // Directory already exists
  }

  // Create sample files
  console.log("📝 Creating sample files...\n");

  // 1. Text file
  const textContent = `The Evolution of Artificial Intelligence

Artificial Intelligence has transformed from a theoretical concept to a practical
reality. Modern AI systems can process natural language, recognize images, and
make complex decisions. Machine learning algorithms learn from data without explicit
programming, while deep learning uses neural networks inspired by the human brain.

The future of AI promises even more exciting developments as researchers continue
to push the boundaries of what's possible.`;

  writeFileSync("./data/article.txt", textContent);
  console.log("✅ Created article.txt");

  // 2. JSON file
  const jsonContent = {
    articles: [
      {
        id: 1,
        title: "Introduction to LangChain",
        author: "Jane Doe",
        content: "LangChain is a framework for building AI applications...",
        tags: ["ai", "langchain", "tutorial"],
      },
      {
        id: 2,
        title: "Working with Documents",
        author: "John Smith",
        content: "Document processing is essential for RAG systems...",
        tags: ["documents", "rag", "vectors"],
      },
      {
        id: 3,
        title: "Advanced Prompting",
        author: "Alice Johnson",
        content: "Effective prompt engineering can dramatically improve results...",
        tags: ["prompts", "engineering", "best-practices"],
      },
    ],
  };

  writeFileSync("./data/articles.json", JSON.stringify(jsonContent, null, 2));
  console.log("✅ Created articles.json");

  // 3. CSV file
  const csvContent = `name,role,department,email
Sarah Chen,Senior Developer,Engineering,sarah@example.com
Mike Rodriguez,Product Manager,Product,mike@example.com
Emily Watson,Data Scientist,Analytics,emily@example.com
David Kim,UX Designer,Design,david@example.com
Lisa Brown,DevOps Engineer,Engineering,lisa@example.com`;

  writeFileSync("./data/employees.csv", csvContent);
  console.log("✅ Created employees.csv\n");

  console.log("=".repeat(80) + "\n");

  // Load and process each file type
  console.log("📖 Loading documents...\n");

  // Load text file
  try {
    console.log("1️⃣  TEXT FILE");
    console.log("─".repeat(80));

    const textLoader = new TextLoader("./data/article.txt");
    const textDocs = await textLoader.load();

    console.log(`📄 File type: Text (.txt)`);
    console.log(`📚 Documents loaded: ${textDocs.length}`);
    console.log(`📝 Content preview:\n${textDocs[0].pageContent.substring(0, 150)}...`);
    console.log(`📊 Character count: ${textDocs[0].pageContent.length}`);
    console.log(`🏷️  Metadata:`, textDocs[0].metadata);
    console.log();
  } catch (error: any) {
    console.error(`❌ Error loading text file: ${error.message}\n`);
  }

  // Load JSON file
  try {
    console.log("2️⃣  JSON FILE");
    console.log("─".repeat(80));

    const jsonLoader = new JSONLoader("./data/articles.json", ["/articles"]);
    const jsonDocs = await jsonLoader.load();

    console.log(`📄 File type: JSON (.json)`);
    console.log(`📚 Documents loaded: ${jsonDocs.length}`);
    console.log(`📝 Content preview:\n${jsonDocs[0].pageContent.substring(0, 150)}...`);
    console.log(`📊 Record count: ${jsonDocs.length}`);
    console.log(`🏷️  Metadata:`, jsonDocs[0].metadata);
    console.log();
  } catch (error: any) {
    console.error(`❌ Error loading JSON file: ${error.message}\n`);
  }

  // Load CSV file
  try {
    console.log("3️⃣  CSV FILE");
    console.log("─".repeat(80));

    const csvLoader = new CSVLoader("./data/employees.csv");
    const csvDocs = await csvLoader.load();

    console.log(`📄 File type: CSV (.csv)`);
    console.log(`📚 Documents loaded: ${csvDocs.length}`);
    console.log(`📝 Content preview:\n${csvDocs[0].pageContent.substring(0, 150)}...`);
    console.log(`📊 Record count: ${csvDocs.length}`);
    console.log(`🏷️  Metadata:`, csvDocs[0].metadata);
    console.log();
  } catch (error: any) {
    console.error(`❌ Error loading CSV file: ${error.message}\n`);
  }

  console.log("=".repeat(80));
  console.log("\n✅ All file types loaded successfully!");
  console.log("💡 The same interface works for different document formats!");
}

main().catch(console.error);
