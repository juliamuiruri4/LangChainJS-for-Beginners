/**
 * Chapter 7 Assignment Solution: Challenge 1
 * Personal Assistant Agent
 *
 * Run: npx tsx 07-langgraph-agents-tools/solution/personal-assistant.ts
 */

import { tool } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "langchain";
import * as z from "zod";
import "dotenv/config";

// In-memory storage
const reminders: Array<{ text: string; time: string }> = [];
const notes: Array<{ title: string; content: string; timestamp: string }> = [];

async function main() {
  console.log("🤖 Personal Assistant Agent\n");
  console.log("=".repeat(80) + "\n");

  // Tool 1: Date/Time
  const dateTimeTool = tool(
    async (input) => {
      const now = new Date();

      switch (input.type) {
        case "date":
          return now.toLocaleDateString();
        case "time":
          return now.toLocaleTimeString();
        case "both":
        default:
          return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      }
    },
    {
      name: "get_datetime",
      description: "Get current date, time, or both",
      schema: z.object({
        type: z.enum(["date", "time", "both"]).describe("What to get: date, time, or both"),
      }),
    }
  );

  // Tool 2: Reminder
  const reminderTool = tool(
    async (input) => {
      const reminder = {
        text: input.text,
        time: input.time,
      };
      reminders.push(reminder);
      return `Reminder set: "${input.text}" at ${input.time}. Total reminders: ${reminders.length}`;
    },
    {
      name: "set_reminder",
      description: "Save a reminder with text and time",
      schema: z.object({
        text: z.string().describe("The reminder text"),
        time: z.string().describe("When the reminder is for (e.g., '3pm', 'tomorrow', '2:30')"),
      }),
    }
  );

  // Tool 3: Note Taker
  const noteTool = tool(
    async (input) => {
      const note = {
        title: input.title,
        content: input.content,
        timestamp: new Date().toISOString(),
      };
      notes.push(note);
      return `Note saved: "${input.title}". Total notes: ${notes.length}`;
    },
    {
      name: "save_note",
      description: "Save a note with title and content",
      schema: z.object({
        title: z.string().describe("The note title"),
        content: z.string().describe("The note content"),
      }),
    }
  );

  // Tool 4: Unit Converter
  const converterTool = tool(
    async (input) => {
      const { value, from, to } = input;

      // Temperature conversions
      if (from === "fahrenheit" && to === "celsius") {
        const result = ((value - 32) * 5) / 9;
        return `${value}°F = ${result.toFixed(2)}°C`;
      }
      if (from === "celsius" && to === "fahrenheit") {
        const result = (value * 9) / 5 + 32;
        return `${value}°C = ${result.toFixed(2)}°F`;
      }

      // Distance conversions
      if (from === "miles" && to === "kilometers") {
        const result = value * 1.60934;
        return `${value} miles = ${result.toFixed(2)} km`;
      }
      if (from === "kilometers" && to === "miles") {
        const result = value / 1.60934;
        return `${value} km = ${result.toFixed(2)} miles`;
      }

      // Weight conversions
      if (from === "pounds" && to === "kilograms") {
        const result = value * 0.453592;
        return `${value} lbs = ${result.toFixed(2)} kg`;
      }
      if (from === "kilograms" && to === "pounds") {
        const result = value / 0.453592;
        return `${value} kg = ${result.toFixed(2)} lbs`;
      }

      return `Conversion from ${from} to ${to} not supported`;
    },
    {
      name: "convert_units",
      description:
        "Convert between units (temperature: fahrenheit/celsius, distance: miles/kilometers, weight: pounds/kilograms)",
      schema: z.object({
        value: z.number().describe("The value to convert"),
        from: z.string().describe("The unit to convert from"),
        to: z.string().describe("The unit to convert to"),
      }),
    }
  );

  // Tool 5: List Reminders
  const listRemindersTool = tool(
    async () => {
      if (reminders.length === 0) {
        return "No reminders found";
      }
      return reminders.map((r, i) => `${i + 1}. "${r.text}" at ${r.time}`).join("\n");
    },
    {
      name: "list_reminders",
      description: "List all saved reminders",
      schema: z.object({}),
    }
  );

  // Tool 6: List Notes
  const listNotesTool = tool(
    async () => {
      if (notes.length === 0) {
        return "No notes found";
      }
      return notes
        .map(
          (n, i) => `${i + 1}. ${n.title}: ${n.content} (${new Date(n.timestamp).toLocaleString()})`
        )
        .join("\n");
    },
    {
      name: "list_notes",
      description: "List all saved notes",
      schema: z.object({}),
    }
  );

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-5-mini",
    temperature: 0,
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  const agent = createReactAgent({
    llm: model,
    tools: [dateTimeTool, reminderTool, noteTool, converterTool, listRemindersTool, listNotesTool],
  });

  const queries = [
    "What time is it?",
    "Set a reminder to call mom at 3pm",
    "Convert 100 miles to kilometers",
    "Save a note: Meeting Notes - Discuss Q4 goals and budget planning",
    "What's the date today?",
    "Convert 72 fahrenheit to celsius",
    "Show me my reminders",
    "Set a reminder to submit report at 5pm tomorrow",
    "List my notes",
  ];

  for (const query of queries) {
    console.log(`❓ ${query}\n`);

    const response = await agent.invoke({
      messages: [new HumanMessage(query)],
    });

    const lastMessage = response.messages[response.messages.length - 1];
    console.log(`✅ ${lastMessage.content}\n`);
    console.log("─".repeat(80) + "\n");
  }

  console.log("=".repeat(80));
  console.log("\n💡 Personal Assistant Features:");
  console.log("   ✓ 6 different tools working together");
  console.log("   ✓ Handles date/time queries");
  console.log("   ✓ Manages reminders (create & list)");
  console.log("   ✓ Saves and retrieves notes");
  console.log("   ✓ Converts between multiple unit types");
  console.log("   ✓ Multi-step reasoning with tool chaining");
}

main().catch(console.error);
