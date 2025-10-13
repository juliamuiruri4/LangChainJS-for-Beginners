/**
 * Chapter 4 Assignment Solution: Challenge 4
 * Web Content Processor
 *
 * Run: npx tsx 04-working-with-documents/solution/web-processor.ts
 */

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";
import { writeFileSync } from "fs";
import "dotenv/config";

const urls = [
  "https://js.langchain.com/docs/introduction/",
  "https://js.langchain.com/docs/tutorials/",
  "https://js.langchain.com/docs/how_to/",
];

interface ProcessedDocument {
  url: string;
  title: string;
  scrapeDate: string;
  wordCount: number;
  chunks: Array<{
    content: string;
    length: number;
  }>;
}

async function scrapeAndProcess(url: string): Promise<ProcessedDocument | null> {
  try {
    console.log(`\n🌐 Processing: ${url}`);
    console.log("─".repeat(80));

    // Load the webpage
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();

    if (docs.length === 0) {
      console.log("❌ No content found");
      return null;
    }

    const doc = docs[0];
    const content = doc.pageContent;

    // Extract title (first line or from metadata)
    const title = content.split("\n")[0].substring(0, 100) || "Untitled";

    // Calculate word count
    const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;

    console.log(`📄 Title: ${title}`);
    console.log(`📝 Content length: ${content.length} characters`);
    console.log(`📊 Word count: ${wordCount} words`);

    // Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const chunks = await splitter.splitDocuments([
      new Document({
        pageContent: content,
        metadata: {
          url: url,
          scrapeDate: new Date().toISOString().split("T")[0],
          wordCount: wordCount,
          title: title,
        },
      }),
    ]);

    console.log(`✂️  Chunks created: ${chunks.length}`);
    console.log("✅ Processing complete");

    return {
      url,
      title,
      scrapeDate: new Date().toISOString().split("T")[0],
      wordCount,
      chunks: chunks.map((chunk) => ({
        content: chunk.pageContent,
        length: chunk.pageContent.length,
      })),
    };
  } catch (error: any) {
    console.log(`❌ Error processing ${url}: ${error.message}`);
    return null;
  }
}

function searchContent(
  processedDocs: ProcessedDocument[],
  searchTerm: string
): void {
  console.log(`\n🔍 Searching for: "${searchTerm}"`);
  console.log("─".repeat(80) + "\n");

  let resultsFound = 0;

  for (const doc of processedDocs) {
    const matchingChunks = doc.chunks.filter((chunk) =>
      chunk.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingChunks.length > 0) {
      console.log(`📄 ${doc.title}`);
      console.log(`   URL: ${doc.url}`);
      console.log(`   Matches: ${matchingChunks.length} chunks\n`);

      matchingChunks.slice(0, 2).forEach((chunk, index) => {
        const startIndex = chunk.content
          .toLowerCase()
          .indexOf(searchTerm.toLowerCase());
        const excerpt =
          chunk.content.substring(Math.max(0, startIndex - 50), startIndex + 100) +
          "...";
        console.log(`   Match ${index + 1}: ...${excerpt}`);
      });

      console.log();
      resultsFound += matchingChunks.length;
    }
  }

  if (resultsFound === 0) {
    console.log("No results found.\n");
  } else {
    console.log(`Total results: ${resultsFound}\n`);
  }
}

async function main() {
  console.log("🌐 Web Content Processor\n");
  console.log("=".repeat(80) + "\n");

  console.log("Starting to scrape and process web pages...");

  const processedDocs: ProcessedDocument[] = [];

  for (const url of urls) {
    const result = await scrapeAndProcess(url);
    if (result) {
      processedDocs.push(result);
    }

    // Add a small delay to be respectful to the server
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n" + "=".repeat(80) + "\n");

  // Summary
  console.log("📊 Processing Summary\n");
  console.log("─".repeat(80));

  const totalChunks = processedDocs.reduce(
    (sum, doc) => sum + doc.chunks.length,
    0
  );
  const totalWords = processedDocs.reduce((sum, doc) => sum + doc.wordCount, 0);

  console.log(`Total pages processed: ${processedDocs.length}`);
  console.log(`Total chunks created: ${totalChunks}`);
  console.log(`Total words processed: ${totalWords}`);
  console.log();

  // Save to JSON
  const outputPath = "./data/processed-web-content.json";
  writeFileSync(outputPath, JSON.stringify(processedDocs, null, 2));
  console.log(`💾 Saved to: ${outputPath}\n`);

  console.log("=".repeat(80));

  // Demonstrate search functionality
  if (processedDocs.length > 0) {
    searchContent(processedDocs, "langchain");
    searchContent(processedDocs, "tutorial");
  }

  console.log("=".repeat(80));
  console.log("\n✅ Web content processing complete!");
  console.log("💡 The processed content is now searchable and ready to use!");
}

main().catch(console.error);
