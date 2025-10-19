/**
 * Validate All Code Examples (Parallel Version)
 *
 * This script runs code examples with controlled parallelism (5 concurrent tests)
 * to speed up validation while avoiding rate limiting from AI providers.
 *
 * Run: npx tsx scripts/validate-examples-parallel.ts
 *    or: npm run test:parallel
 *
 * Benefits over sequential version:
 * - ~10x faster execution (runs 10 tests at once)
 * - Still avoids rate limiting (only 10 concurrent API calls)
 * - Same reliability and error handling
 * - As each test completes, the next one starts immediately
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

// Timeout for all examples (generous to handle API calls and complex examples)
const TIMEOUT_MS = 90000; // 90 seconds

// Concurrency limit - run this many tests at once
const CONCURRENCY = 10;

async function findCodeFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively search subdirectories
        files.push(...(await findCodeFiles(fullPath)));
      } else if (entry.isFile() && entry.name.endsWith(".ts")) {
        // Skip the validate script itself
        if (!entry.name.includes("validate-examples")) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
    // console.warn(`Warning: Could not read directory ${dir}`);
  }

  return files;
}

function getInteractiveInput(filePath: string): string | null {
  const interactive = INTERACTIVE_FILES.find((item) => filePath.includes(item.file));
  return interactive ? interactive.input : null;
}

function runExample(filePath: string): Promise<TestResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
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
        error: `Timeout after ${TIMEOUT_MS}ms`,
      });
    }, TIMEOUT_MS);

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      clearTimeout(timeoutHandle);
      const duration = Date.now() - startTime;

      // Check for error indicators in stderr even if exit code is 0
      const hasError =
        stderr &&
        (stderr.includes("Error:") ||
          stderr.includes("Error\n") ||
          stderr.includes("at ") || // Stack trace indicator
          stderr.toLowerCase().includes("exception"));

      if (code === 0 && !hasError) {
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
          error: hasError ? stderr : stderr || `Exit code: ${code}`,
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

async function findChapters(projectRoot: string): Promise<string[]> {
  const entries = await readdir(projectRoot, { withFileTypes: true });
  // Match directories starting with 2 digits followed by "-", for example "00-", "01-", etc.
  const chapterPattern = /^\d{2}-/;

  return entries
    .filter((entry) => entry.isDirectory() && chapterPattern.test(entry.name))
    .map((entry) => entry.name)
    .sort(); // Ensure chapters are in numerical order
}

/**
 * Run tests with controlled concurrency using a queue-based worker pool
 *
 * @param files - Array of file paths to test
 * @param concurrency - Number of tests to run in parallel
 * @param projectRoot - Project root path for relative paths
 * @returns Array of test results
 */
async function runTestsWithConcurrency(
  files: string[],
  concurrency: number,
  projectRoot: string
): Promise<TestResult[]> {
  const results: TestResult[] = new Array(files.length);
  let nextIndex = 0;
  let completed = 0;
  let passed = 0;
  let failed = 0;

  // Worker function that processes items from the queue
  const worker = async (): Promise<void> => {
    while (true) {
      // Grab the next file index and increment atomically
      const currentIndex = nextIndex++;

      // Check if we've run out of files
      if (currentIndex >= files.length) break;

      const file = files[currentIndex];
      const relativePath = file.replace(projectRoot + "/", "");

      // Show when test STARTS (so you can see 3 running at once)
      console.log(`▶️  [${currentIndex + 1}/${files.length}] Starting: ${relativePath}`);

      // Run the test (this is where the parallel execution happens)
      const result = await runExample(file);

      // Store result
      results[currentIndex] = result;
      completed++;

      // Show when test COMPLETES
      if (result.success) {
        passed++;
        console.log(`   ✅ [${currentIndex + 1}/${files.length}] Passed: ${relativePath} (${result.duration}ms)\n`);
      } else {
        failed++;
        console.log(`   ❌ [${currentIndex + 1}/${files.length}] Failed: ${relativePath}`);
        if (result.error) {
          console.log(`      Error: ${result.error.split("\n")[0]}`);
        }
        console.log();
      }
    }
  };

  // Start worker pool
  const workers: Promise<void>[] = [];
  for (let i = 0; i < Math.min(concurrency, files.length); i++) {
    workers.push(worker());
  }

  // Wait for all workers to complete
  await Promise.all(workers);

  return results;
}

async function main() {
  console.log("🧪 Validating All Code Examples (Parallel Mode)\n");
  console.log("=" + "=".repeat(79) + "\n");

  // Get project root (parent directory of scripts folder)
  const projectRoot = join(__dirname, "..");

  // Dynamically find all chapter directories (e.g., 00-*, 01-*, etc.)
  const chapters = await findChapters(projectRoot);
  console.log(`📂 Found ${chapters.length} chapters: ${chapters.join(", ")}\n`);

  const allFiles: string[] = [];

  // Collect all code files
  for (const chapter of chapters) {
    const chapterPath = join(projectRoot, chapter, "code");
    const files = await findCodeFiles(chapterPath);
    allFiles.push(...files);

    // Also check solution folders
    const solutionPath = join(projectRoot, chapter, "solution");
    const solutionFiles = await findCodeFiles(solutionPath);
    allFiles.push(...solutionFiles);

    // Also check samples folders
    const samplesPath = join(projectRoot, chapter, "samples");
    const samplesFiles = await findCodeFiles(samplesPath);
    allFiles.push(...samplesFiles);
  }

  console.log(`📁 Found ${allFiles.length} code files\n`);

  // Identify interactive files (will be tested with automated input)
  const interactiveCount = allFiles.filter((file) => getInteractiveInput(file)).length;
  if (interactiveCount > 0) {
    console.log(`🤖 ${interactiveCount} interactive files will be tested with automated input\n`);
  }

  console.log(`🚀 Running ${allFiles.length} examples with concurrency: ${CONCURRENCY}\n`);
  console.log(`💡 This means ${CONCURRENCY} tests run in parallel at all times\n`);
  console.log(`⚡ As each test completes, the next one starts immediately\n`);
  console.log("=" + "=".repeat(79) + "\n");

  const startTime = Date.now();

  // Run tests with controlled concurrency
  const results = await runTestsWithConcurrency(allFiles, CONCURRENCY, projectRoot);

  const totalDuration = Date.now() - startTime;
  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log("\n" + "=" + "=".repeat(79) + "\n");
  console.log("📊 Test Results:\n");
  console.log(`   Total:    ${allFiles.length}`);
  console.log(`   Passed:   ${passed} ✅`);
  console.log(`   Failed:   ${failed} ❌`);

  const successRate = ((passed / allFiles.length) * 100).toFixed(1);
  console.log(`   Success:  ${successRate}%`);
  console.log(`   Duration: ${(totalDuration / 1000).toFixed(1)}s (${(totalDuration / 60000).toFixed(1)} minutes)`);

  if (failed > 0) {
    console.log("\n" + "=" + "=".repeat(79) + "\n");
    console.log("❌ Failed Examples:\n");

    results
      .filter((r) => !r.success)
      .forEach((result) => {
        const relativePath = result.file.replace(projectRoot + "/", "");
        console.log(`   ${relativePath}`);
        if (result.error) {
          console.log(`   → ${result.error.split("\n").slice(0, 3).join("\n   ")}`);
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
    console.log(`⚡ Parallel execution (${CONCURRENCY} tests at a time) completed in ${(totalDuration / 60000).toFixed(1)} minutes\n`);
    process.exit(0);
  }
}

main().catch((error) => {
  console.error("❌ Validation script error:", error);
  process.exit(1);
});
