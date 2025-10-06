/**
 * Challenge 2 Solution: Simple Q&A Program
 *
 * A simple interactive Q&A program that lets users ask questions.
 */

import { ChatOpenAI } from "@langchain/openai";
import readline from "readline";
import "dotenv/config";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  configuration: {
    baseURL: "https://models.inference.ai.azure.com",
  },
  apiKey: process.env.GITHUB_TOKEN,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askQuestion() {
  rl.question("\n❓ Ask me anything (or 'quit' to exit): ", async (question) => {
    // Check for exit commands
    if (question.toLowerCase() === "quit" || question.toLowerCase() === "exit") {
      console.log("\n👋 Goodbye!");
      rl.close();
      return;
    }

    // Skip empty questions
    if (!question.trim()) {
      askQuestion();
      return;
    }

    try {
      console.log("\n🤔 Thinking...");

      const response = await model.invoke(question);

      console.log("\n🤖 AI:");
      console.log(response.content);

      // Ask another question
      askQuestion();
    } catch (error: any) {
      console.error("\n❌ Error:", error.message);
      askQuestion();
    }
  });
}

console.log("🎉 Welcome to the Q&A Program!");
console.log("Type your question and press Enter.");
console.log("Type 'quit' or 'exit' to stop.\n");

askQuestion();
