/**
 * Validate All Code Examples
 *
 * This script runs all code examples across all chapters to ensure they execute without errors.
 * Used in CI/CD pipeline to validate course content.
 *
 * Run: npm run validate
 */

import { spawn } from "child_process";
import { readdir } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface TestResult {
  file: string;
  success: boolean;
  duration: number;
  error?: string;
}

// Files that require user input - test with automated input
const INTERACTIVE_FILES = [
  { file: "chatbot.ts", input: "Hello\n" },
  { file: "streaming-chat.ts", input: "Hello\n" },
  { file: "qa-program.ts", input: "What is 2+2?\n" },
  { file: "03-human-in-loop.ts", input: "yes\nno\nno\n" },
];

// Files that are slow or make external API calls - run with longer timeout
const SLOW_FILES = [
  "03-model-comparison.ts",
  "model-performance.ts",
  "personality-test.ts",
  "03-parameters.ts", // Makes 9 API calls
  "temperature-lab.ts",
  "04-error-handling.ts",
  "robust-chat.ts",
  "01-multi-turn.ts",
  "02-streaming.ts",
  "03-summary-memory.ts",
  "chatbot.ts", // Interactive with API calls
  "streaming-chat.ts", // Interactive with API calls
  "qa-program.ts", // Interactive with API calls
  "03-human-in-loop.ts", // Interactive (no API but complex)
];

const TIMEOUT_MS = 30000; // 30 seconds default
const SLOW_TIMEOUT_MS = 60000; // 60 seconds for slow files

async function findCodeFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively search subdirectories
        files.push(...await findCodeFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith(".ts")) {
        // Skip the validate script itself
        if (!entry.name.includes("validate-examples")) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
    console.warn(`Warning: Could not read directory ${dir}`);
  }

  return files;
}

function getInteractiveInput(filePath: string): string | null {
  const interactive = INTERACTIVE_FILES.find(item => filePath.includes(item.file));
  return interactive ? interactive.input : null;
}

function isSlow(filePath: string): boolean {
  return SLOW_FILES.some(slow => filePath.includes(slow));
}

function runExample(filePath: string): Promise<TestResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const timeout = isSlow(filePath) ? SLOW_TIMEOUT_MS : TIMEOUT_MS;
    const interactiveInput = getInteractiveInput(filePath);

    const child = spawn("npx", ["tsx", filePath], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, CI: "true" },
    });

    let stdout = "";
    let stderr = "";
    let timeoutHandle: NodeJS.Timeout;

    // Provide automated input for interactive files
    if (interactiveInput) {
      child.stdin.write(interactiveInput);
      child.stdin.end();
    }

    // Set timeout
    timeoutHandle = setTimeout(() => {
      child.kill();
      resolve({
        file: filePath,
        success: false,
        duration: Date.now() - startTime,
        error: `Timeout after ${timeout}ms`,
      });
    }, timeout);

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      clearTimeout(timeoutHandle);
      const duration = Date.now() - startTime;

      if (code === 0) {
        resolve({
          file: filePath,
          success: true,
          duration,
        });
      } else {
        resolve({
          file: filePath,
          success: false,
          duration,
          error: stderr || `Exit code: ${code}`,
        });
      }
    });

    child.on("error", (error) => {
      clearTimeout(timeoutHandle);
      resolve({
        file: filePath,
        success: false,
        duration: Date.now() - startTime,
        error: error.message,
      });
    });
  });
}

async function main() {
  console.log("🧪 Validating All Code Examples\n");
  console.log("=" + "=".repeat(79) + "\n");

  // Find all chapters
  const chapters = [
    "00-course-setup",
    "01-introduction",
    "02-chat-models",
    "03-prompt-templates",
    "04-working-with-documents",
    "05-embeddings-semantic-search",
    "06-rag-systems",
    "07-agents-tools",
    "08-memory-conversations",
    "09-production-best-practices",
    "10-langgraph-intro",
  ];

  const allFiles: string[] = [];

  // Collect all code files
  for (const chapter of chapters) {
    const chapterPath = join(__dirname, chapter, "code");
    const files = await findCodeFiles(chapterPath);
    allFiles.push(...files);

    // Also check solution folders
    const solutionPath = join(__dirname, chapter, "solution");
    const solutionFiles = await findCodeFiles(solutionPath);
    allFiles.push(...solutionFiles);
  }

  console.log(`📁 Found ${allFiles.length} code files\n`);

  // Identify interactive files (will be tested with automated input)
  const interactiveCount = allFiles.filter(file => getInteractiveInput(file)).length;
  if (interactiveCount > 0) {
    console.log(`🤖 ${interactiveCount} interactive files will be tested with automated input\n`);
  }

  console.log(`🏃 Running ${allFiles.length} examples...\n`);
  console.log("=" + "=".repeat(79) + "\n");

  const results: TestResult[] = [];
  let passed = 0;
  let failed = 0;

  // Run tests sequentially to avoid rate limiting
  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i];
    const relativePath = file.replace(__dirname + "/", "");

    process.stdout.write(`[${i + 1}/${allFiles.length}] ${relativePath}... `);

    const result = await runExample(file);
    results.push(result);

    if (result.success) {
      passed++;
      console.log(`✅ (${result.duration}ms)`);
    } else {
      failed++;
      console.log(`❌`);
      if (result.error) {
        console.log(`   Error: ${result.error.split('\n')[0]}`);
      }
    }
  }

  console.log("\n" + "=" + "=".repeat(79) + "\n");
  console.log("📊 Test Results:\n");
  console.log(`   Total:    ${allFiles.length}`);
  console.log(`   Passed:   ${passed} ✅`);
  console.log(`   Failed:   ${failed} ❌`);

  const successRate = ((passed / allFiles.length) * 100).toFixed(1);
  console.log(`   Success:  ${successRate}%`);

  if (failed > 0) {
    console.log("\n" + "=" + "=".repeat(79) + "\n");
    console.log("❌ Failed Examples:\n");

    results
      .filter(r => !r.success)
      .forEach(result => {
        const relativePath = result.file.replace(__dirname + "/", "");
        console.log(`   ${relativePath}`);
        if (result.error) {
          console.log(`   → ${result.error.split('\n').slice(0, 3).join('\n   ')}`);
        }
        console.log();
      });
  }

  console.log("=" + "=".repeat(79) + "\n");

  // Exit with error code if any tests failed
  if (failed > 0) {
    console.log("❌ Validation failed. Please fix the errors above.\n");
    process.exit(1);
  } else {
    console.log("✅ All examples validated successfully!\n");
    process.exit(0);
  }
}

main().catch((error) => {
  console.error("❌ Validation script error:", error);
  process.exit(1);
});
