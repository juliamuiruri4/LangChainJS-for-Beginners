/**
 * Chapter 8 Assignment Solution: Bonus Challenge
 * Persistent Memory with File Storage
 *
 * Run: npx tsx 08-langgraph-memory-conversations/solution/persistent-memory.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { promises as fs } from "fs";
import * as path from "path";
import * as readline from "readline";
import "dotenv/config";

const MEMORY_DIR = path.join(process.cwd(), "data", "memory-data");

interface StoredMessage {
  type: "human" | "ai";
  content: string;
  timestamp: string;
}

async function main() {
  console.log("💾 Persistent Memory System\n");
  console.log("=".repeat(80) + "\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-5-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Ensure memory directory exists
  try {
    await fs.mkdir(MEMORY_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }

  async function saveMemory(userId: string, messages: StoredMessage[]): Promise<void> {
    const filePath = path.join(MEMORY_DIR, `${userId}.json`);
    await fs.writeFile(filePath, JSON.stringify(messages, null, 2));
    console.log(`   💾 Saved to ${filePath}`);
  }

  async function loadMemory(userId: string): Promise<StoredMessage[]> {
    try {
      const filePath = path.join(MEMORY_DIR, `${userId}.json`);
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist or error reading
      return [];
    }
  }

  async function exportMemory(userId: string): Promise<void> {
    const messages = await loadMemory(userId);
    const exportPath = path.join(MEMORY_DIR, `${userId}_export_${Date.now()}.txt`);

    const formatted = messages
      .map((msg) => {
        const role = msg.type === "human" ? "You" : "Assistant";
        const date = new Date(msg.timestamp).toLocaleString();
        return `[${date}] ${role}: ${msg.content}`;
      })
      .join("\n\n");

    await fs.writeFile(exportPath, formatted);
    console.log(`\n📄 Exported conversation to: ${exportPath}\n`);
  }

  async function clearMemory(userId: string): Promise<void> {
    const filePath = path.join(MEMORY_DIR, `${userId}.json`);
    try {
      await fs.unlink(filePath);
      console.log(`\n🗑️ Cleared memory for ${userId}\n`);
    } catch (error) {
      console.log(`\n⚠️ No memory file found for ${userId}\n`);
    }
  }

  async function listSavedUsers(): Promise<string[]> {
    try {
      const files = await fs.readdir(MEMORY_DIR);
      return files
        .filter((f) => f.endsWith(".json") && !f.includes("export"))
        .map((f) => f.replace(".json", ""));
    } catch (error) {
      return [];
    }
  }

  const userId = "user1";

  // Load existing memory
  console.log(`📂 Loading memory for ${userId}...\n`);
  const storedMessages = await loadMemory(userId);

  let messages: any[] = [];

  if (storedMessages.length > 0) {
    console.log(`✅ Loaded ${storedMessages.length} messages from previous session\n`);

    // Convert stored messages back to LangChain format
    messages = storedMessages.map((msg) => {
      return msg.type === "human" ? new HumanMessage(msg.content) : new AIMessage(msg.content);
    });

    // Show preview
    console.log("📜 Recent conversation:");
    storedMessages.slice(-3).forEach((msg) => {
      const role = msg.type === "human" ? "You" : "Assistant";
      const preview = msg.content.substring(0, 60);
      console.log(`   ${role}: ${preview}${msg.content.length > 60 ? "..." : ""}`);
    });
    console.log();
  } else {
    console.log("📝 Starting new conversation\n");
  }

  console.log("=".repeat(80) + "\n");
  console.log("Commands:");
  console.log("  /export  - Export conversation to text file");
  console.log("  /clear   - Clear saved memory");
  console.log("  /users   - List saved users");
  console.log("  /exit    - Exit (auto-saves)\n");
  console.log("=".repeat(80) + "\n");

  // Check if running in CI mode
  const isCI = process.env.CI === "true";

  if (isCI) {
    console.log("🤖 Running in CI mode with test conversation\n");

    const testMessages = ["Hi! My name is Riley", "I'm interested in AI", "What's my name?"];

    for (const userMessage of testMessages) {
      console.log(`👤 You: ${userMessage}\n`);

      const response = await model.invoke([...messages, new HumanMessage(userMessage)]);

      messages.push(new HumanMessage(userMessage), new AIMessage(response.content.toString()));

      console.log(`🤖 Assistant: ${response.content}\n`);
      console.log("─".repeat(80) + "\n");
    }

    // Save memory
    const storedFormat: StoredMessage[] = messages.map((msg) => ({
      type: msg._getType() === "human" ? "human" : "ai",
      content: String(msg.content),
      timestamp: new Date().toISOString(),
    }));

    await saveMemory(userId, storedFormat);

    console.log("\n✅ Persistent memory demonstration complete!");
    console.log("\n💡 Key Features:");
    console.log("   ✓ Conversations saved to disk automatically");
    console.log("   ✓ Memory survives app restarts");
    console.log("   ✓ Export conversations to readable format");
    console.log("   ✓ Multiple users supported");
    console.log(`\n📁 Memory files stored in: ${MEMORY_DIR}`);
  } else {
    // Interactive mode
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const askQuestion = () => {
      rl.question("👤 You: ", async (input) => {
        const userInput = input.trim();

        if (userInput.toLowerCase() === "/exit") {
          // Save before exit
          const storedFormat: StoredMessage[] = messages.map((msg) => ({
            type: msg._getType() === "human" ? "human" : "ai",
            content: String(msg.content),
            timestamp: new Date().toISOString(),
          }));

          await saveMemory(userId, storedFormat);
          console.log("\n👋 Goodbye! Memory saved.\n");
          rl.close();
          return;
        }

        if (userInput.toLowerCase() === "/export") {
          await exportMemory(userId);
          askQuestion();
          return;
        }

        if (userInput.toLowerCase() === "/clear") {
          await clearMemory(userId);
          messages = [];
          askQuestion();
          return;
        }

        if (userInput.toLowerCase() === "/users") {
          const users = await listSavedUsers();
          console.log(`\n👥 Saved users: ${users.length > 0 ? users.join(", ") : "none"}\n`);
          askQuestion();
          return;
        }

        if (!userInput) {
          askQuestion();
          return;
        }

        try {
          const response = await model.invoke([...messages, new HumanMessage(userInput)]);

          messages.push(new HumanMessage(userInput), new AIMessage(response.content.toString()));

          console.log(`\n🤖 Assistant: ${response.content}\n`);

          // Auto-save after each exchange
          const storedFormat: StoredMessage[] = messages.map((msg) => ({
            type: msg._getType() === "human" ? "human" : "ai",
            content: String(msg.content),
            timestamp: new Date().toISOString(),
          }));

          await saveMemory(userId, storedFormat);
          console.log("─".repeat(80) + "\n");
        } catch (error) {
          console.error("\n❌ Error:", error);
          console.log("\n" + "─".repeat(80) + "\n");
        }

        askQuestion();
      });
    };

    askQuestion();
  }
}

main().catch(console.error);
