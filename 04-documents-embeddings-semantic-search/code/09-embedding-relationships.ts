/**
 * Embedding Relationships - Vector Math Demo
 *
 * This example demonstrates how embeddings capture semantic relationships
 * that can be manipulated through vector arithmetic.
 *
 * Run: tsx 04-documents-embeddings-semantic-search/code/09-embedding-relationships.ts
 */

import { createEmbeddingsModel } from "@/scripts/create-model.js";
import "dotenv/config";

// Helper function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Helper function to subtract two vectors
function subtractVectors(vecA: number[], vecB: number[]): number[] {
  return vecA.map((a, i) => a - vecB[i]);
}

// Helper function to add two vectors
function addVectors(vecA: number[], vecB: number[]): number[] {
  return vecA.map((a, i) => a + vecB[i]);
}

async function main() {
  console.log("🔬 Embedding Relationships: Vector Math Demo\n");
  console.log("This demonstrates how embeddings capture semantic relationships");
  console.log("that can be manipulated mathematically.\n");
  console.log("=".repeat(70) + "\n");

  // Initialize embeddings model
  const embeddings = createEmbeddingsModel();

  // ============================================================================
  // Example 1: Geography Relationships
  // Demonstrating: Paris - France + Italy ≈ Rome
  // ============================================================================

  console.log("📍 Example 1: Geography Relationships");
  console.log("─".repeat(70));
  console.log("\nTesting: Embedding('Paris') - Embedding('France') + Embedding('Italy')");
  console.log("Expected result: Should be similar to Embedding('Rome')\n");

  // Generate embeddings for geographic terms
  const [parisEmbed, franceEmbed, italyEmbed, romeEmbed] = await Promise.all([
    embeddings.embedQuery("Paris"),
    embeddings.embedQuery("France"),
    embeddings.embedQuery("Italy"),
    embeddings.embedQuery("Rome"),
  ]);

  // Perform vector arithmetic: Paris - France + Italy
  const parisMinusFrance = subtractVectors(parisEmbed, franceEmbed);
  const result1 = addVectors(parisMinusFrance, italyEmbed);

  // Calculate similarity with Rome
  const similarityToRome = cosineSimilarity(result1, romeEmbed);

  console.log(`✅ Similarity to 'Rome': ${(similarityToRome * 100).toFixed(2)}%`);
  console.log("\nWhat this means:");
  console.log("  • Paris is to France as Rome is to Italy");
  console.log("  • The vectors encode 'capital city' and 'country' as separate dimensions");
  console.log("  • Vector math preserves these relationships!");

  // Show comparison with unrelated terms
  const londonEmbed = await embeddings.embedQuery("London");
  const similarityToLondon = cosineSimilarity(result1, londonEmbed);

  console.log(`\n📊 Comparison: Similarity to 'London': ${(similarityToLondon * 100).toFixed(2)}%`);
  console.log(`   (Lower than Rome, as expected - London is capital of UK, not Italy)\n`);

  console.log("=".repeat(70) + "\n");

  // ============================================================================
  // Example 2: Cultural Food Relationships
  // Demonstrating: pizza - Italy + Japan ≈ sushi
  // ============================================================================

  console.log("🍕 Example 2: Cultural Food Relationships");
  console.log("─".repeat(70));
  console.log("\nTesting: Embedding('pizza') - Embedding('Italy') + Embedding('Japan')");
  console.log("Expected result: Should be similar to Embedding('sushi')\n");

  // Generate embeddings for food and countries
  const [pizzaEmbed, japanEmbed, sushiEmbed] = await Promise.all([
    embeddings.embedQuery("pizza"),
    embeddings.embedQuery("Japan"),
    embeddings.embedQuery("sushi"),
  ]);

  // Perform vector arithmetic: pizza - Italy + Japan
  const pizzaMinusItaly = subtractVectors(pizzaEmbed, italyEmbed);
  const result2 = addVectors(pizzaMinusItaly, japanEmbed);

  // Calculate similarity with sushi
  const similarityToSushi = cosineSimilarity(result2, sushiEmbed);

  console.log(`✅ Similarity to 'sushi': ${(similarityToSushi * 100).toFixed(2)}%`);
  console.log("\nWhat this means:");
  console.log("  • Pizza is to Italy as sushi is to Japan");
  console.log("  • The embeddings understand cultural food associations");
  console.log("  • Subtracting 'Italy' removes the country, adding 'Japan' finds Japan's iconic food");

  // Show comparison with unrelated food
  const burgerEmbed = await embeddings.embedQuery("hamburger");
  const similarityToBurger = cosineSimilarity(result2, burgerEmbed);

  console.log(`\n📊 Comparison: Similarity to 'hamburger': ${(similarityToBurger * 100).toFixed(2)}%`);
  console.log(`   (Lower than sushi, as expected - hamburger is more associated with USA)\n`);

  console.log("=".repeat(70) + "\n");

  // ============================================================================
  // Example 3: Synonym Clustering
  // Demonstrating: Similar words have similar embeddings
  // ============================================================================

  console.log("😊 Example 3: Synonym Clustering");
  console.log("─".repeat(70));
  console.log("\nTesting similarity between synonyms:\n");

  // Generate embeddings for synonyms
  const [happyEmbed, joyfulEmbed, cheerfulEmbed, sadEmbed] = await Promise.all([
    embeddings.embedQuery("happy"),
    embeddings.embedQuery("joyful"),
    embeddings.embedQuery("cheerful"),
    embeddings.embedQuery("sad"),
  ]);

  // Calculate similarities
  const happyJoyful = cosineSimilarity(happyEmbed, joyfulEmbed);
  const happyCheerful = cosineSimilarity(happyEmbed, cheerfulEmbed);
  const happySad = cosineSimilarity(happyEmbed, sadEmbed);

  console.log(`Similarity: 'happy' ↔ 'joyful'   = ${(happyJoyful * 100).toFixed(2)}% ✅ (synonyms)`);
  console.log(`Similarity: 'happy' ↔ 'cheerful' = ${(happyCheerful * 100).toFixed(2)}% ✅ (synonyms)`);
  console.log(`Similarity: 'happy' ↔ 'sad'      = ${(happySad * 100).toFixed(2)}% ❌ (opposites)`);

  console.log("\nWhat this means:");
  console.log("  • Words with similar meanings have similar embeddings");
  console.log("  • They cluster close together in vector space");
  console.log("  • Opposite meanings have lower similarity scores");

  console.log("\n" + "=".repeat(70) + "\n");

  // ============================================================================
  // Summary
  // ============================================================================

  console.log("🎓 Key Takeaways:");
  console.log("─".repeat(70));
  console.log("\n1. Embeddings capture semantic relationships:");
  console.log("   • Paris:France :: Rome:Italy (capital cities)");
  console.log("   • pizza:Italy :: sushi:Japan (cultural foods)");
  console.log("");
  console.log("2. Vector arithmetic works on meanings:");
  console.log("   • Adding/subtracting embeddings preserves relationships");
  console.log("   • The math 'understands' concepts like country, capital, food");
  console.log("");
  console.log("3. Synonyms cluster together:");
  console.log("   • Similar meanings = nearby in vector space");
  console.log("   • Different meanings = farther apart");
  console.log("");
  console.log("4. This enables powerful applications:");
  console.log("   • Semantic search (find similar meanings, not just keywords)");
  console.log("   • Analogy completion (A:B :: C:?)");
  console.log("   • Document clustering (group by topic)");
  console.log("   • Recommendation systems (find similar items)");
  console.log("\n✅ These relationships emerge from training on massive text corpora!");
}

main().catch(console.error);
