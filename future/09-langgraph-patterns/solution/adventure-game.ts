/**
 * Chapter 10 Assignment Solution: Challenge 4
 * Choose-Your-Own-Adventure Game
 *
 * Run: npx tsx 10-production-best-practices/solution/adventure-game.ts
 */

import { StateGraph, END, Annotation } from "@langchain/langgraph";
import * as readline from "readline";
import "dotenv/config";

const GameState = Annotation.Root({
  currentScene: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "start",
  }),
  inventory: Annotation<string[]>({
    reducer: (left, right) => [...left, ...right],
    default: () => [],
  }),
  choiceHistory: Annotation<string[]>({
    reducer: (left, right) => [...left, ...right],
    default: () => [],
  }),
  gameStatus: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "playing",
  }),
  nextChoice: Annotation<string>({
    reducer: (_, right) => right,
    default: () => "",
  }),
});

interface SceneData {
  description: string;
  choices: { text: string; nextScene: string; item?: string }[];
}

const scenes: Record<string, SceneData> = {
  start: {
    description: "You stand at the entrance of an ancient forest. Two paths lie before you.",
    choices: [
      { text: "Take the left path through the dark woods", nextScene: "cave" },
      { text: "Take the right path along the river", nextScene: "river" },
    ],
  },
  cave: {
    description:
      "You discover a mysterious cave entrance. Strange glowing symbols adorn the walls.",
    choices: [
      { text: "Enter the cave", nextScene: "treasure_or_trap" },
      { text: "Return to the forest", nextScene: "start" },
      { text: "Search around the entrance", nextScene: "hidden_item" },
    ],
  },
  river: {
    description: "A crystal-clear river flows before you. You hear sounds of a village nearby.",
    choices: [
      { text: "Cross the river", nextScene: "village" },
      { text: "Follow the river downstream", nextScene: "waterfall" },
      { text: "Set up camp here", nextScene: "camp" },
    ],
  },
  treasure_or_trap: {
    description:
      "Inside the cave, you find a glittering treasure chest. But the floor around it looks suspicious...",
    choices: [
      {
        text: "Carefully approach and open the chest",
        nextScene: "treasure_ending",
        item: "golden_amulet",
      },
      { text: "Look for another way around", nextScene: "secret_passage" },
    ],
  },
  hidden_item: {
    description: "You find an ancient map hidden in the rocks!",
    choices: [
      {
        text: "Take the map and enter the cave",
        nextScene: "treasure_or_trap",
        item: "ancient_map",
      },
    ],
  },
  village: {
    description: "You arrive at a peaceful village. The locals welcome you warmly.",
    choices: [
      { text: "Rest and end your journey here", nextScene: "peaceful_ending" },
      { text: "Ask about nearby adventures", nextScene: "new_quest" },
    ],
  },
  waterfall: {
    description: "You discover a magnificent waterfall with a cave behind it!",
    choices: [
      {
        text: "Explore the cave behind the waterfall",
        nextScene: "waterfall_cave",
      },
      { text: "Head back", nextScene: "river" },
    ],
  },
  camp: {
    description: "You set up a cozy camp by the river. It's peaceful here.",
    choices: [{ text: "End your adventure and rest", nextScene: "restful_ending" }],
  },
  secret_passage: {
    description: "You find a secret passage leading to ancient treasure without traps!",
    choices: [
      {
        text: "Claim the treasure",
        nextScene: "treasure_ending",
        item: "ancient_treasure",
      },
    ],
  },
  waterfall_cave: {
    description: "Behind the waterfall, you find a legendary artifact!",
    choices: [
      {
        text: "Take the artifact and return home",
        nextScene: "legendary_ending",
        item: "water_crystal",
      },
    ],
  },
  new_quest: {
    description: "The villagers tell you about a dragon nearby that needs help!",
    choices: [{ text: "Help the dragon", nextScene: "dragon_ending" }],
  },
  // Endings
  treasure_ending: {
    description:
      "You've found incredible treasure! You return home wealthy and celebrated. THE END.",
    choices: [],
  },
  peaceful_ending: {
    description: "You decide to stay in the village and live a peaceful life. THE END.",
    choices: [],
  },
  restful_ending: {
    description: "You enjoy a peaceful rest by the river and return home refreshed. THE END.",
    choices: [],
  },
  legendary_ending: {
    description: "With the legendary water crystal, you become a hero of legend! THE END.",
    choices: [],
  },
  dragon_ending: {
    description:
      "You help the dragon and gain a powerful ally. Together you protect the realm! THE END.",
    choices: [],
  },
};

async function main() {
  console.log("🎮 Choose-Your-Own-Adventure Game\n");
  console.log("=".repeat(80) + "\n");

  const workflow = new StateGraph(GameState);

  // Node: Display scene and get choice
  workflow.addNode("display_scene", async (state: typeof GameState.State) => {
    const scene = scenes[state.currentScene];

    console.log("\n" + "=".repeat(80));
    console.log(`\n📍 ${state.currentScene.toUpperCase().replace(/_/g, " ")}\n`);
    console.log(scene.description);

    if (state.inventory.length > 0) {
      console.log(`\n🎒 Inventory: ${state.inventory.join(", ")}`);
    }

    if (scene.choices.length === 0) {
      console.log("\n" + "=".repeat(80));
      return { gameStatus: "ended" };
    }

    return { gameStatus: "awaiting_choice" };
  });

  // Node: Process choice
  workflow.addNode("process_choice", async (state: typeof GameState.State) => {
    const scene = scenes[state.currentScene];
    const choiceIndex = parseInt(state.nextChoice) - 1;

    if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex >= scene.choices.length) {
      return { gameStatus: "invalid_choice" };
    }

    const choice = scene.choices[choiceIndex];
    const newItems: string[] = [];

    if (choice.item) {
      newItems.push(choice.item);
      console.log(`\n✨ You obtained: ${choice.item}!`);
    }

    return {
      currentScene: choice.nextScene,
      choiceHistory: [`${state.currentScene}: ${choice.text}`],
      inventory: newItems,
      gameStatus: "playing",
    };
  });

  // Routing
  function routeGame(state: typeof GameState.State): string {
    if (state.gameStatus === "ended") {
      return END;
    }
    if (state.gameStatus === "awaiting_choice" || state.gameStatus === "invalid_choice") {
      return "process_choice";
    }
    return "display_scene";
  }

  workflow.addEdge("__start__" as any, "display_scene" as any);
  workflow.addConditionalEdges("display_scene" as any, routeGame, {
    process_choice: "process_choice",
    __end__: END,
  } as any);
  workflow.addEdge("process_choice" as any, "display_scene" as any);

  const app = workflow.compile();

  // Check if running in CI mode
  const isCI = process.env.CI === "true";

  if (isCI) {
    console.log("🤖 Running in CI mode with automated playthrough\n");

    // Automated playthrough: left path -> cave -> enter -> treasure
    const choices = ["1", "1", "1"];
    let state: typeof GameState.State = {
      currentScene: "start",
      inventory: [] as string[],
      choiceHistory: [] as string[],
      gameStatus: "playing",
      nextChoice: "",
    };

    for (const choice of choices) {
      const scene = scenes[state.currentScene];
      console.log("\nChoices:");
      scene.choices.forEach((c, i) => {
        console.log(`  ${i + 1}. ${c.text}`);
      });
      console.log(`\n👤 Choice: ${choice}`);

      state = await app.invoke({ ...state, nextChoice: choice });

      if (state.gameStatus === "ended") {
        break;
      }
    }

    console.log("\n📊 Game Summary:");
    console.log(`   Final Scene: ${state.currentScene}`);
    console.log(`   Choices Made: ${state.choiceHistory.length}`);
    console.log(`   Items Collected: ${state.inventory.length}`);

    console.log("\n✅ Adventure game demonstration complete!");
  } else {
    // Interactive mode
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    let state: typeof GameState.State = {
      currentScene: "start",
      inventory: [] as string[],
      choiceHistory: [] as string[],
      gameStatus: "playing",
      nextChoice: "",
    };

    const playTurn = async () => {
      state = await app.invoke(state);

      if (state.gameStatus === "ended") {
        console.log("\n📊 Game Summary:");
        console.log(`   Choices Made: ${state.choiceHistory.length}`);
        console.log(`   Items Collected: ${state.inventory.join(", ") || "none"}`);
        console.log("\n👋 Thanks for playing!\n");
        rl.close();
        return;
      }

      const scene = scenes[state.currentScene];
      console.log("\nChoices:");
      scene.choices.forEach((choice, index) => {
        console.log(`  ${index + 1}. ${choice.text}`);
      });

      rl.question("\n👤 Your choice (number): ", async (answer) => {
        state.nextChoice = answer.trim();
        await playTurn();
      });
    };

    await playTurn();
  }
}

main().catch(console.error);
