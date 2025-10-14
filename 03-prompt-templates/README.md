# Chapter 3: Prompt Engineering with Templates

In this chapter, you'll learn how to create reusable, maintainable prompts using templates instead of hardcoding prompts throughout your application. You'll discover how to use variables and dynamic content, implement few-shot prompting to teach AI by example, and compose multiple templates together for complex use cases. Templates make your AI applications more consistent, testable, and easy to maintain.

## Prerequisites

- Completed [Chapter 2](../02-chat-models/README.md)

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Create reusable prompt templates
- Use variables and dynamic content in prompts
- Implement few-shot prompting (teaching by example)
- Combine multiple prompts together
- Generate structured outputs with Zod schemas
- Understand when and why to use templates

---

## 📖 The Mail Merge Analogy

**Imagine you need to send 100 personalized emails.**

You could write each one from scratch:
```
Dear John,
Your order #12345 is ready for pickup...

Dear Sarah,
Your order #12346 is ready for pickup...
```

Or you could use **mail merge** with a template:
```
Dear {name},
Your order #{orderId} is ready for pickup...
```

**Prompt templates work exactly the same way!**

Instead of writing similar prompts over and over, you:
- ✅ Create a template once with placeholders
- ✅ Fill in the specifics each time you use it
- ✅ Ensure consistency across your application
- ✅ Make testing and updates easier

This chapter teaches you how to create reusable, maintainable prompts.

---

## 🤔 Why Use Prompt Templates?

### The Problem Without Templates

```typescript
// Hardcoded prompts everywhere - hard to maintain!
await model.invoke("Translate this English text to French: Hello");
await model.invoke("Translate this English text to Spanish: Hello");
await model.invoke("Translate this English text to German: Hello");
```

**Issues**:
- Code duplication
- Hard to update prompts
- Difficult to test
- Inconsistent formatting

### The Solution With Templates

```typescript
// Create once, reuse everywhere!
const template = ChatPromptTemplate.fromMessages([
  ["system", "You are a translator from {input_language} to {output_language}."],
  ["human", "{text}"],
]);
```

**Benefits**:
- ✅ **Consistency**: Same prompt structure everywhere
- ✅ **Maintainability**: Update once, changes everywhere
- ✅ **Testability**: Easy to test with different inputs
- ✅ **Version control**: Track prompt changes over time
- ✅ **Separation of concerns**: Logic separate from prompts

---

## 📝 Creating Basic Templates

### Example 1: Simple Translation Template

In this example, you'll create a reusable translation template with variables for input language, output language, and text to be translated.

**Code**: [`code/01-basic-template.ts`](./code/01-basic-template.ts)
**Run**: `tsx 03-prompt-templates/code/01-basic-template.ts`

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function main() {
  // Create a reusable template
  const template = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant that translates {input_language} to {output_language}."],
    ["human", "{text}"],
  ]);

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Use the template multiple times with different values
  const chain = template.pipe(model);

  const result1 = await chain.invoke({
    input_language: "English",
    output_language: "French",
    text: "Hello, how are you?",
  });

  console.log("French:", result1.content);

  const result2 = await chain.invoke({
    input_language: "English",
    output_language: "Spanish",
    text: "Hello, how are you?",
  });

  console.log("Spanish:", result2.content);
}

main().catch(console.error);
```

### Expected Output

When you run this example with `tsx 03-prompt-templates/code/01-basic-template.ts`, you'll see:

```
French: Bonjour, comment allez-vous ?
Spanish: Hola, ¿cómo estás?
```

### How It Works

**Key Concepts**:
1. `{variable_name}` creates placeholders in the template
2. `ChatPromptTemplate.fromMessages()` defines the structure with system and human messages
3. `template.pipe(model)` creates a chain that connects the template to the model
4. `invoke()` fills in the variables and sends the complete prompt to the AI

**What's happening**:
- We create ONE template with three variables: `{input_language}`, `{output_language}`, and `{text}`
- We use the template twice with different values (French and Spanish)
- Each time, the variables are replaced with actual values
- The complete prompt is sent to the AI model
- We get translations without having to write separate prompts

**Benefits**: If you want to change how translations work (e.g., add "Be formal" to the system message), you update ONE place and it affects all translations.

---

## 🎨 Different Template Formats

### Message Templates

The most common format uses message arrays:

```typescript
const template = ChatPromptTemplate.fromMessages([
  ["system", "You are a {role}."],
  ["human", "{input}"],
]);
```

### String Templates

For simpler use cases:

```typescript
import { PromptTemplate } from "@langchain/core/prompts";

const template = PromptTemplate.fromTemplate(
  "Tell me a {adjective} joke about {topic}."
);
```

### Example 2: Multiple Template Formats

This example compares different template formats (ChatPromptTemplate vs PromptTemplate) and shows you when to use each approach.

**Code**: [`code/02-template-formats.ts`](./code/02-template-formats.ts)
**Run**: `tsx 03-prompt-templates/code/02-template-formats.ts`

```typescript
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function main() {
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Format 1: ChatPromptTemplate (for chat models)
  console.log("1️⃣  ChatPromptTemplate:\n");

  const chatTemplate = ChatPromptTemplate.fromMessages([
    ["system", "You are a {role} who speaks in {style} style."],
    ["human", "{question}"],
  ]);

  const result1 = await chatTemplate.pipe(model).invoke({
    role: "pirate",
    style: "dramatic",
    question: "What is TypeScript?",
  });

  console.log(result1.content);

  // Format 2: PromptTemplate (simpler, string-based)
  console.log("\n2️⃣  PromptTemplate:\n");

  const stringTemplate = PromptTemplate.fromTemplate(
    "Write a {adjective} {item} about {topic}."
  );

  const prompt = await stringTemplate.format({
    adjective: "funny",
    item: "poem",
    topic: "JavaScript",
  });

  console.log("Generated prompt:", prompt);

  const result2 = await model.invoke(prompt);
  console.log("\nResponse:", result2.content);
}

main().catch(console.error);
```

### Expected Output

When you run this example with `tsx 03-prompt-templates/code/02-template-formats.ts`, you'll see:

```
1️⃣  ChatPromptTemplate:

Arr matey! TypeScript be a mighty tool forged by Microsoft, ye see! It be JavaScript with types, helpin' ye catch errors before yer ship sets sail! With TypeScript, ye define the shape of yer data like a treasure map, and the compiler checks if ye be followin' it correctly. No more surprises when yer code runs - it's all verified beforehand! Savvy?

2️⃣  PromptTemplate:

Generated prompt: Write a funny poem about JavaScript.

Response:
JavaScript, oh JavaScript,
You're quirky and you're quick,
With "undefined" and "null" to spare,
You drive us up the wall sometimes,
But we still love you, I swear!
```

### How It Works

**Two Template Types**:

1. **ChatPromptTemplate** (for conversational AI):
   - Uses message arrays: `["system", "..."], ["human", "..."]`
   - Supports system messages to set AI personality
   - Best for chat models and conversations
   - Pipes directly to the model

2. **PromptTemplate** (for simple text):
   - Uses plain string templates
   - No system/human message distinction
   - Must call `.format()` to get the filled template
   - Then pass the formatted string to the model

**When to use each**:
- Use `ChatPromptTemplate` when you need system messages or multi-turn conversations
- Use `PromptTemplate` for simple, single-shot prompts without roles

---

## 💡 Few-Shot Prompting

Few-shot prompting means teaching the AI by showing examples.

**Think of it like training a new employee**: Instead of just telling them what to do, you show them examples of good work.

### Example 3: Few-Shot Prompting

Here you'll learn how to teach the AI by example using few-shot prompting to convert emotions to emojis based on provided examples.

**Code**: [`code/03-few-shot.ts`](./code/03-few-shot.ts)
**Run**: `tsx 03-prompt-templates/code/03-few-shot.ts`

```typescript
import { ChatPromptTemplate, FewShotChatMessagePromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function main() {
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Define examples to teach the model
  const examples = [
    {
      input: "happy",
      output: "😊",
    },
    {
      input: "sad",
      output: "😢",
    },
    {
      input: "excited",
      output: "🎉",
    },
  ];

  // Create example template
  const exampleTemplate = ChatPromptTemplate.fromMessages([
    ["human", "{input}"],
    ["ai", "{output}"],
  ]);

  // Create few-shot template
  const fewShotTemplate = new FewShotChatMessagePromptTemplate({
    examplePrompt: exampleTemplate,
    examples: examples,
    inputVariables: [],
  });

  // Combine with the final question
  const finalTemplate = ChatPromptTemplate.fromMessages([
    ["system", "Convert emotions to emojis based on these examples:"],
    fewShotTemplate,
    ["human", "{input}"],
  ]);

  const chain = finalTemplate.pipe(model);

  // Test with new input
  const result = await chain.invoke({ input: "surprised" });
  console.log("surprised →", result.content);

  const result2 = await chain.invoke({ input: "angry" });
  console.log("angry →", result2.content);
}

main().catch(console.error);
```

### Expected Output

When you run this example with `tsx 03-prompt-templates/code/03-few-shot.ts`, you'll see:

```
surprised → 😮
angry → 😠
```

### How It Works

**What's happening**:
1. **We provide examples** showing the pattern: "happy" → 😊, "sad" → 😢, "excited" → 🎉
2. **The AI learns the pattern** by seeing these input-output pairs
3. **We ask for new emotions** like "surprised" and "angry"
4. **The AI follows the learned pattern** and provides appropriate emojis

**Few-Shot Components**:
- `examples` array: Contains the teaching examples
- `exampleTemplate`: Defines how each example is formatted (human → AI)
- `FewShotChatMessagePromptTemplate`: Injects the examples into the conversation
- Final template: Combines system message + examples + user input

**Benefits of Few-Shot**:
- Teaches the model your desired format without complex instructions
- More reliable than just instructions alone
- Great for structured outputs and consistent formatting
- Reduces need for fine-tuning for many tasks

---

## 🔗 Prompt Composition

You can combine multiple templates to create complex prompts.

### Example 4: Composing Templates

In this example, you'll learn how to combine multiple template pieces together to create complex, reusable prompts for different educational contexts.

**Code**: [`code/04-composition.ts`](./code/04-composition.ts)
**Run**: `tsx 03-prompt-templates/code/04-composition.ts`

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function main() {
  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Create reusable prompt pieces
  const systemTemplate = "You are an expert {domain} educator.";
  const contextTemplate = "Teaching level: {level}\nAudience: {audience}";
  const taskTemplate = "Explain {topic} in simple terms.";

  // Compose them together
  const fullTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate + "\n\n" + contextTemplate],
    ["human", taskTemplate],
  ]);

  const chain = fullTemplate.pipe(model);

  // Use for different scenarios
  const result1 = await chain.invoke({
    domain: "programming",
    level: "beginner",
    audience: "high school students",
    topic: "variables",
  });

  console.log("🎓 Beginner explanation:\n");
  console.log(result1.content);

  const result2 = await chain.invoke({
    domain: "programming",
    level: "intermediate",
    audience: "college students",
    topic: "closures",
  });

  console.log("\n\n🎓 Intermediate explanation:\n");
  console.log(result2.content);
}

main().catch(console.error);
```

### Expected Output

When you run this example with `tsx 03-prompt-templates/code/04-composition.ts`, you'll see:

```
🎓 Beginner explanation:

Think of a variable as a labeled box where you can store information! Just like you might have a box labeled "toys" or "books," in programming, you create variables with names like "score" or "playerName." You can put different types of information in these boxes - numbers, words, or yes/no answers - and use them whenever you need that information in your program.


🎓 Intermediate explanation:

Closures are a fundamental concept where a function retains access to variables from its outer scope, even after the outer function has finished executing. This happens because JavaScript functions create a "closure" over the environment in which they were defined. For example, if an inner function references a variable from its parent function, that variable remains accessible to the inner function even after the parent function returns. This is particularly useful for data privacy, creating factory functions, and maintaining state in functional programming patterns.
```

### How It Works

**What's happening**:
1. **We create reusable template pieces**: `systemTemplate`, `contextTemplate`, `taskTemplate`
2. **We combine them with string concatenation**: `systemTemplate + "\n\n" + contextTemplate`
3. **We use the same template for different scenarios**: beginner vs intermediate explanations
4. **Variables customize each piece**: `domain`, `level`, `audience`, `topic`

**Benefits of Composition**:
- **Reusable pieces**: Write common parts once, mix and match
- **Consistency**: Same structure across similar prompts
- **Flexibility**: Different combinations for different needs
- **Maintainability**: Update shared pieces in one place

**Real-world use**: Build a library of prompt components (tone, context, task) and compose them based on user needs or application state.

---

## 📋 Structured Outputs

So far, we've been getting text responses from AI models. But what if you need **structured data** - like JSON objects with specific fields?

### The Form Analogy

**Think about asking someone for their contact information:**

❌ **Without structure**:
```
"Tell me about yourself"
Response: "Well, I'm John, I live somewhere in Seattle,
my email is... let me think... john@something.com, and my phone
number is... hmm, I think it's 555-1234"
```

✅ **With structure** (a form):
```
Name: [____]
Email: [____]
Phone: [____]
City: [____]
```

**Structured outputs work the same way!** Instead of parsing free text, you get data in the exact format you need.

### Why Use Structured Outputs?

- ✅ **Type Safety**: TypeScript types match AI output
- ✅ **Validation**: Ensure data meets requirements
- ✅ **Parsing**: No need to parse free text
- ✅ **Consistency**: Always get the same format
- ✅ **Integration**: Easy to use with databases, APIs, etc.

### Example 5: Basic Structured Output

Here you'll use Zod schemas to get typed, structured data from AI instead of free text, ensuring type safety and validation.

**Code**: [`code/05-structured-output.ts`](./code/05-structured-output.ts)
**Run**: `tsx 03-prompt-templates/code/05-structured-output.ts`

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import "dotenv/config";

async function main() {
  console.log("📋 Structured Output Example\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Define the structure using Zod schema
  const PersonSchema = z.object({
    name: z.string().describe("The person's full name"),
    age: z.number().describe("The person's age in years"),
    email: z.string().email().describe("The person's email address"),
    occupation: z.string().describe("The person's job or profession"),
  });

  // Create a model that returns structured output
  const structuredModel = model.withStructuredOutput(PersonSchema);

  // Now the AI returns typed data, not just text!
  const result = await structuredModel.invoke(
    "My name is Alice Johnson, I'm 28 years old, work as a software engineer, and you can reach me at alice.j@email.com"
  );

  console.log("✅ Structured Output (typed!):\n");
  console.log(result);
  console.log("\n📝 Accessing fields:");
  console.log(`   Name: ${result.name}`);
  console.log(`   Age: ${result.age}`);
  console.log(`   Email: ${result.email}`);
  console.log(`   Occupation: ${result.occupation}`);
}

main().catch(console.error);
```

### Expected Output

When you run this example with `tsx 03-prompt-templates/code/05-structured-output.ts`, you'll see:

```
📋 Structured Output Example

✅ Structured Output (typed!):

{
  name: 'Alice Johnson',
  age: 28,
  email: 'alice.j@email.com',
  occupation: 'software engineer'
}

📝 Accessing fields:
   Name: Alice Johnson
   Age: 28
   Email: alice.j@email.com
   Occupation: software engineer
```

### How It Works

**What's happening**:
1. **Define the schema** with Zod: `PersonSchema` specifies exactly what fields we want
2. **Use `.describe()`** to tell the AI what each field represents
3. **Create structured model**: `model.withStructuredOutput(PersonSchema)`
4. **Get typed data**: The AI extracts information and returns it in the exact format we specified
5. **Type-safe access**: TypeScript knows the structure, giving us autocomplete and type checking

**Key Points**:
- `z.object()` defines the structure with field names and types
- `.describe()` tells the AI what each field means (helps extraction accuracy)
- `withStructuredOutput()` ensures the AI returns data in that format
- Result is fully typed in TypeScript - no manual parsing needed!
- Zod validates the data automatically - if the AI returns invalid data, you'll get an error

**Why this is powerful**: No more parsing free text with regex or string splitting. The AI does the extraction and formatting for you!

### Example 6: Complex Structured Data

In this example, you'll extract complex nested company information from text using Zod schemas with arrays, nested objects, and various data types.

**Code**: [`code/06-zod-schemas.ts`](./code/06-zod-schemas.ts)
**Run**: `tsx 03-prompt-templates/code/06-zod-schemas.ts`

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import "dotenv/config";

async function main() {
  console.log("🏢 Complex Structured Output Example\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    configuration: {
      baseURL: process.env.AI_ENDPOINT,
    },
    apiKey: process.env.AI_API_KEY,
  });

  // Define a complex nested schema
  const CompanySchema = z.object({
    name: z.string().describe("Company name"),
    founded: z.number().describe("Year the company was founded"),
    headquarters: z.object({
      city: z.string(),
      country: z.string(),
    }).describe("Company headquarters location"),
    products: z.array(z.string()).describe("List of main products or services"),
    employeeCount: z.number().describe("Approximate number of employees"),
    isPublic: z.boolean().describe("Whether the company is publicly traded"),
  });

  // Create structured model
  const structuredModel = model.withStructuredOutput(CompanySchema);

  // Create a prompt template
  const template = ChatPromptTemplate.fromMessages([
    ["system", "Extract company information from the text. If information is not available, make reasonable estimates."],
    ["human", "{text}"],
  ]);

  // Combine template with structured output
  const chain = template.pipe(structuredModel);

  const companyInfo = `
    Microsoft was founded in 1975 and is headquartered in Redmond, Washington.
    The company is publicly traded and has over 220,000 employees worldwide.
    Their main products include Windows, Office, Azure, and Xbox.
  `;

  const result = await chain.invoke({ text: companyInfo });

  console.log("✅ Extracted Company Data:\n");
  console.log(JSON.stringify(result, null, 2));

  console.log("\n📊 Type-safe access:");
  console.log(`   ${result.name} (${result.isPublic ? "Public" : "Private"})`);
  console.log(`   Founded: ${result.founded}`);
  console.log(`   Location: ${result.headquarters.city}, ${result.headquarters.country}`);
  console.log(`   Products: ${result.products.join(", ")}`);
  console.log(`   Employees: ${result.employeeCount.toLocaleString()}`);
}

main().catch(console.error);
```

### Expected Output

When you run this example with `tsx 03-prompt-templates/code/06-zod-schemas.ts`, you'll see:

```
🏢 Complex Structured Output Example

✅ Extracted Company Data:

{
  "name": "Microsoft",
  "founded": 1975,
  "headquarters": {
    "city": "Redmond",
    "country": "United States"
  },
  "products": [
    "Windows",
    "Office",
    "Azure",
    "Xbox"
  ],
  "employeeCount": 220000,
  "isPublic": true
}

📊 Type-safe access:
   Microsoft (Public)
   Founded: 1975
   Location: Redmond, United States
   Products: Windows, Office, Azure, Xbox
   Employees: 220,000
```

### How It Works

**What's happening**:
1. **Complex schema with nested objects**: `headquarters` is an object with `city` and `country`
2. **Arrays**: `products` is an array of strings
3. **Multiple data types**: string, number, boolean, object, array
4. **Template integration**: We use `ChatPromptTemplate` with `withStructuredOutput()`
5. **Smart extraction**: The AI reads unstructured text and extracts data into our schema

**Schema Structure**:
```typescript
CompanySchema = {
  name: string,
  founded: number,
  headquarters: {       // Nested object
    city: string,
    country: string
  },
  products: string[],   // Array
  employeeCount: number,
  isPublic: boolean
}
```

**Real-world applications**:
- Extract contact info from emails into structured database records
- Parse resumes into standardized candidate profiles
- Convert natural language forms into API payloads
- Build data pipelines that transform unstructured content into structured databases

**When to Use Structured Outputs**:
- 📊 **Data extraction** from text
- 🗂️ **Database inserts** with validated data
- 🔄 **API responses** with guaranteed format
- 🎯 **Form filling** from natural language
- ✅ **Classification tasks** with predefined categories

---

## 🎓 Key Takeaways

- ✅ **Templates reduce code duplication** - Write once, use everywhere
- ✅ **Variables with `{name}` syntax** - Create dynamic prompts
- ✅ **ChatPromptTemplate for chat models** - Works with message arrays
- ✅ **PromptTemplate for simple cases** - String-based templates
- ✅ **Few-shot prompting** - Teach by example for better results
- ✅ **Composition** - Combine templates for complex prompts
- ✅ **Structured outputs with Zod** - Get typed data, not just text
- ✅ **Type safety** - Validate AI responses match your schema
- ✅ **Maintainability** - Update prompts in one place

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Few-Shot Format Teacher** - Use few-shot prompting to teach the AI a custom output format
2. **Product Data Extractor** (Bonus) - Build a system that extracts product information with structured outputs

---

## 📚 Additional Resources

- [Prompt Templates Documentation](https://js.langchain.com/docs/modules/prompts/)
- [Few-Shot Prompting Guide](https://js.langchain.com/docs/modules/prompts/few_shot/)
- [LCEL Piping](https://js.langchain.com/docs/expression_language/)

---

## 🗺️ Navigation

- **Previous**: [02-chat-models](../02-chat-models/README.md)
- **Next**: [04-documents-embeddings-semantic-search](../04-documents-embeddings-semantic-search/README.md)
- **Home**: [Course Home](../README.md)

---

## 💬 Questions or stuck?

If you get stuck or have any questions about building AI apps, join:

[![Azure AI Foundry Discord](https://img.shields.io/badge/Discord-Azure_AI_Foundry_Community_Discord-blue?style=for-the-badge&logo=discord&color=5865f2&logoColor=fff)](https://aka.ms/foundry/discord)

If you have product feedback or errors while building visit:

[![Azure AI Foundry Developer Forum](https://img.shields.io/badge/GitHub-Azure_AI_Foundry_Developer_Forum-blue?style=for-the-badge&logo=github&color=000000&logoColor=fff)](https://aka.ms/foundry/forum)
