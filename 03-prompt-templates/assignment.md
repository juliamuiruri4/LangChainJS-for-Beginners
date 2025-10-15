# Chapter 3 Assignment: Prompt Engineering with Templates

## Overview

Practice creating reusable, maintainable prompts using templates, few-shot learning, and structured output techniques.

## Prerequisites

- Completed [Chapter 3](./README.md)
- Run all code examples (including structured outputs examples)
- Understand template syntax and composition

---

## Challenge: Few-Shot Format Teacher 🎓

**Goal**: Use few-shot prompting to teach the AI a custom output format.

**Tasks**:
1. Create `format-teacher.ts`
2. Teach the AI to convert product descriptions into a specific JSON format:
   ```json
   {
     "name": "Product name",
     "price": "$XX.XX",
     "category": "Category",
     "highlight": "Key feature"
   }
   ```
3. Provide 3-4 example conversions
4. Test with new product descriptions
5. Parse and validate the JSON output

**Teaching Examples** (provide these as few-shot examples):
- Input: "Premium wireless headphones with noise cancellation, $199"
- Input: "Organic cotton t-shirt in blue, comfortable fit, $29.99"
- Input: "Gaming laptop with RTX 4070, 32GB RAM, $1,499"

**Success Criteria**:
- AI consistently outputs valid JSON
- Format matches your examples
- Works with various product descriptions

**Hints**:
```typescript
// 1. Import required modules
import { ChatPromptTemplate, FewShotChatMessagePromptTemplate } from "@langchain/core/prompts";
import { createChatModel } from "@/scripts/create-model.js";
import "dotenv/config";

// 2. Create model with temperature 0 for consistent formatting
const model = createChatModel({ temperature: 0 });

// 3. Define teaching examples
const examples = [
  {
    input: "Product description",
    output: JSON.stringify({ name: "...", price: "...", category: "...", highlight: "..." }, null, 2)
  }
];

// 4. Create few-shot template
const exampleTemplate = ChatPromptTemplate.fromMessages([
  ["human", "{input}"],
  ["ai", "{output}"]
]);

const fewShotTemplate = new FewShotChatMessagePromptTemplate({
  examplePrompt: exampleTemplate,
  examples: examples,
  inputVariables: [],
});

// 5. Validate JSON output
const parsed = JSON.parse(result.content.toString());
```

---

## Bonus Challenge: Product Data Extractor with Structured Outputs 🏷️

**Goal**: Build a system that extracts product information into validated, typed data structures.

**Tasks**:
1. Create `product-extractor.ts`
2. Define a Zod schema for product information:
   ```typescript
   {
     name: string,
     price: number,
     category: string (enum: Electronics, Clothing, Food, Books, Home),
     inStock: boolean,
     rating: number (1-5),
     features: string[]
   }
   ```
3. Use `withStructuredOutput()` to extract product data
4. Test with product descriptions in various formats:
   - Formal product listings
   - Casual marketplace descriptions
   - Mixed content (reviews + specifications)
5. Validate that all outputs match your schema
6. Handle edge cases (missing information)

**Example Inputs**:
- "MacBook Pro 16-inch with M3 chip, $2,499. Currently in stock. Users rate it 4.8/5. Features: Liquid Retina display, 18-hour battery, 1TB SSD"
- "Cozy wool sweater, blue color, medium size. $89, available now! Customers love it - 4.5 stars. Hand-washable, made in Ireland"
- "The Great Gatsby by F. Scott Fitzgerald. Classic novel, paperback edition for $12.99. In stock. Rated 4.9 stars. 180 pages, published 1925"

**Success Criteria**:
- All outputs are properly typed
- Schema validation works correctly
- Handles various input formats
- Correctly categorizes products
- Gracefully handles missing data

**Hints**:
```typescript
// 1. Import required modules
import { createChatModel } from "@/scripts/create-model.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import "dotenv/config";

// 2. Create model
const model = createChatModel();

// 3. Define Zod schema for validation
const ProductSchema = z.object({
  name: z.string().describe("Product name"),
  price: z.number().describe("Price in USD"),
  category: z.enum(["Electronics", "Clothing", "Food", "Books", "Home"]),
  inStock: z.boolean(),
  rating: z.number().min(1).max(5),
  features: z.array(z.string())
});

// 4. Create structured output model
const structuredModel = model.withStructuredOutput(ProductSchema);

// 5. Create prompt template and chain
const template = ChatPromptTemplate.fromMessages([
  ["system", "Extract product information from the description."],
  ["human", "{description}"]
]);

const chain = template.pipe(structuredModel);

// 6. Invoke with description
const result = await chain.invoke({ description: "Your product description" });
// Result is now fully typed!
```

---

## Submission Checklist

Before moving to Chapter 4, make sure you've completed:

- [ ] Challenge: Few-shot format teacher with JSON output
- [ ] Bonus: Product data extractor with structured outputs (optional)

---

## Solutions

Solutions for all challenges are available in the [`solution/`](./solution/) folder. Try to complete the challenges on your own first!

**Additional Examples**: Check out the [`samples/`](./samples/) folder for more examples including email generation, translation systems, dynamic prompt builders, and template libraries!

---

## Need Help?

- **Template syntax**: Review examples in [`code/`](./code/)
- **Few-shot issues**: Check example 3 in the code folder
- **Composition**: Review example 4
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## Next Steps

Once you've completed these challenges, you're ready for:

**[Chapter 4: Documents, Embeddings & Semantic Search](../04-documents-embeddings-semantic-search/README.md)**

Excellent progress! You're mastering prompt engineering! 🚀
