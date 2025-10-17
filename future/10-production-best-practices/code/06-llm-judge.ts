/**
 * LLM-as-Judge - Using AI to Evaluate AI Responses
 * Run: npx tsx 10-production-best-practices/code/06-llm-judge.ts
 */

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import "dotenv/config";

async function main() {
  console.log("🎯 LLM-as-Judge Evaluation Example\n");

  // Setup
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
      defaultQuery: process.env.AI_API_VERSION
        ? { "api-version": process.env.AI_API_VERSION }
        : undefined,
    },
    apiKey: process.env.AI_API_KEY,
  });

  console.log("=".repeat(80));

  // Define evaluation criteria schema
  const EvaluationSchema = z.object({
    accuracy: z.number().min(1).max(5).describe("Factual accuracy and correctness (1-5)"),
    completeness: z
      .number()
      .min(1)
      .max(5)
      .describe("How complete and comprehensive the answer is (1-5)"),
    clarity: z
      .number()
      .min(1)
      .max(5)
      .describe("How clear, well-written, and easy to understand (1-5)"),
    relevance: z
      .number()
      .min(1)
      .max(5)
      .describe("How relevant the answer is to the question (1-5)"),
    reasoning: z.string().describe("Brief explanation of the scores and overall assessment"),
  });

  // Create evaluator model with structured output
  const evaluator = model.withStructuredOutput(EvaluationSchema);

  // Create evaluation prompt
  const evaluationPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are an expert evaluator assessing the quality of AI-generated responses.

Evaluate the response based on:
- Accuracy: Is the information factually correct?
- Completeness: Does it fully answer the question?
- Clarity: Is it well-written and easy to understand?
- Relevance: Does it stay on topic?

Rate each criterion from 1 (poor) to 5 (excellent).`,
    ],
    [
      "human",
      `Question: {question}

Answer to evaluate: {answer}

Provide your evaluation:`,
    ],
  ]);

  /**
   * LLM-as-Judge evaluation function
   */
  async function evaluateWithLLM(question: string, answer: string) {
    console.log(`\n❓ Question: "${question}"\n`);
    console.log(`🤖 Answer:\n${answer}\n`);
    console.log("🎯 Evaluating with LLM-as-Judge...\n");

    const evaluation = await evaluationPrompt.pipe(evaluator).invoke({ question, answer });

    // Display results
    console.log("📊 Evaluation Results:\n");
    console.log(`   Accuracy:     ${evaluation.accuracy}/5 ${"⭐".repeat(evaluation.accuracy)}`);
    console.log(
      `   Completeness: ${evaluation.completeness}/5 ${"⭐".repeat(evaluation.completeness)}`
    );
    console.log(`   Clarity:      ${evaluation.clarity}/5 ${"⭐".repeat(evaluation.clarity)}`);
    console.log(`   Relevance:    ${evaluation.relevance}/5 ${"⭐".repeat(evaluation.relevance)}`);

    const averageScore =
      (evaluation.accuracy + evaluation.completeness + evaluation.clarity + evaluation.relevance) /
      4;

    console.log(`\n   Average Score: ${averageScore.toFixed(2)}/5.00`);

    // Quality assessment
    if (averageScore >= 4.5) {
      console.log("   Quality: 🌟 EXCELLENT - Exceptional response");
    } else if (averageScore >= 4.0) {
      console.log("   Quality: ✅ VERY GOOD - High quality response");
    } else if (averageScore >= 3.5) {
      console.log("   Quality: 👍 GOOD - Solid response");
    } else if (averageScore >= 3.0) {
      console.log("   Quality: ⚠️  ACCEPTABLE - Room for improvement");
    } else {
      console.log("   Quality: ❌ POOR - Needs significant improvement");
    }

    console.log(`\n💭 Reasoning:\n${evaluation.reasoning}`);
    console.log("─".repeat(80));

    return {
      question,
      answer,
      evaluation,
      averageScore,
    };
  }

  // Test Case 1: Good Answer
  console.log("\n📝 Test Case 1: Evaluating a good answer\n");
  await evaluateWithLLM(
    "What is machine learning?",
    "Machine learning is a subset of artificial intelligence that enables computer systems to learn and improve from experience without being explicitly programmed. It uses algorithms to analyze data, identify patterns, and make predictions or decisions. Common types include supervised learning (learning from labeled data), unsupervised learning (finding patterns in unlabeled data), and reinforcement learning (learning through trial and error). Applications range from image recognition to natural language processing."
  );

  // Test Case 2: Incomplete Answer
  console.log("\n📝 Test Case 2: Evaluating an incomplete answer\n");
  await evaluateWithLLM(
    "Explain how neural networks work",
    "Neural networks are inspired by the human brain. They have layers and nodes."
  );

  // Test Case 3: Off-Topic Answer
  console.log("\n📝 Test Case 3: Evaluating an off-topic answer\n");
  await evaluateWithLLM(
    "What is the capital of France?",
    "France is a beautiful country known for its cuisine, art, and culture. It has many famous landmarks like the Eiffel Tower and the Louvre Museum. The French Revolution was a significant historical event that shaped modern democracy."
  );

  // Test Case 4: Generate and Evaluate in One Go
  console.log("\n📝 Test Case 4: Generate answer and evaluate it\n");
  const question = "Explain the difference between LangChain and traditional prompt engineering";
  console.log(`❓ Question: "${question}"\n`);

  const generatedResponse = await model.invoke(question);
  const generatedAnswer = generatedResponse.content as string;

  await evaluateWithLLM(question, generatedAnswer);

  console.log("\n💡 Benefits of LLM-as-Judge:\n");
  console.log("   ✅ Nuanced evaluation - Understands semantic quality");
  console.log("   ✅ Scalable - Can evaluate thousands of responses");
  console.log("   ✅ Consistent - Applies same criteria to all responses");
  console.log("   ✅ Explainable - Provides reasoning for scores");
  console.log("   ✅ Multi-dimensional - Evaluates multiple aspects");

  console.log("\n🎯 When to Use LLM-as-Judge:\n");
  console.log("   1. Evaluating creative or open-ended responses");
  console.log("   2. Comparing different prompt strategies");
  console.log("   3. Automated quality assurance at scale");
  console.log("   4. When human evaluation is too expensive/slow");
  console.log("   5. Regression testing for complex outputs");

  console.log("\n⚠️  Best Practices:\n");
  console.log("   - Use a stronger model as judge (e.g., GPT-4 evaluating GPT-3.5)");
  console.log("   - Define clear evaluation criteria");
  console.log("   - Use structured outputs for consistency");
  console.log("   - Validate with human evaluation on sample");
  console.log("   - Consider potential biases in evaluation");
  console.log("   - Use multiple judges for critical applications");

  console.log("\n🔬 Advanced Patterns:\n");
  console.log("   1. Multi-judge ensemble (use 3+ evaluators, take average)");
  console.log("   2. Comparative evaluation (judge which of 2 answers is better)");
  console.log("   3. Reference-based evaluation (compare against golden answer)");
  console.log("   4. Chain-of-thought evaluation (judge explains step-by-step)");
  console.log("   5. Adversarial evaluation (find weaknesses in responses)");
}

main().catch(console.error);
