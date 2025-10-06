/**
 * Example 1: Basic Prompt Template
 *
 * Learn how to create reusable prompt templates with variables.
 *
 * Run: npx tsx 03-prompt-templates/code/01-basic-template.ts
 */

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function main() {
  console.log("📝 Basic Prompt Template Example\n");

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    configuration: {
      baseURL: "https://models.inference.ai.azure.com",
    },
    apiKey: process.env.GITHUB_TOKEN,
  });

  // Create a reusable translation template
  const template = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful assistant that translates {input_language} to {output_language}.",
    ],
    ["human", "{text}"],
  ]);

  console.log("Template created with variables: input_language, output_language, text\n");

  // Create a chain by piping template to model
  const chain = template.pipe(model);

  // Example 1: English to French
  console.log("1️⃣  Translating to French:");
  const result1 = await chain.invoke({
    input_language: "English",
    output_language: "French",
    text: "Hello, how are you?",
  });
  console.log("   →", result1.content, "\n");

  // Example 2: English to Spanish
  console.log("2️⃣  Translating to Spanish:");
  const result2 = await chain.invoke({
    input_language: "English",
    output_language: "Spanish",
    text: "Hello, how are you?",
  });
  console.log("   →", result2.content, "\n");

  // Example 3: English to Japanese
  console.log("3️⃣  Translating to Japanese:");
  const result3 = await chain.invoke({
    input_language: "English",
    output_language: "Japanese",
    text: "Hello, how are you?",
  });
  console.log("   →", result3.content, "\n");

  console.log("✅ Same template, different outputs!");
  console.log("💡 Templates make prompts reusable and maintainable.");
}

main().catch(console.error);
