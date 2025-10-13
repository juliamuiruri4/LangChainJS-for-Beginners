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

**Code**: [`code/01-basic-template.ts`](./code/01-basic-template.ts)

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

**Key Concepts**:
- `{variable_name}` creates placeholders
- `template.pipe(model)` creates a chain
- `invoke()` fills in the variables

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

**Code**: [`code/02-template-formats.ts`](./code/02-template-formats.ts)

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

---

## 💡 Few-Shot Prompting

Few-shot prompting means teaching the AI by showing examples.

**Think of it like training a new employee**: Instead of just telling them what to do, you show them examples of good work.

### Example 3: Few-Shot Prompting

**Code**: [`code/03-few-shot.ts`](./code/03-few-shot.ts)

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

**Benefits of Few-Shot**:
- Teaches the model your desired format
- More reliable than just instructions
- Great for structured outputs

---

## 🔗 Prompt Composition

You can combine multiple templates to create complex prompts.

### Example 4: Composing Templates

**Code**: [`code/04-composition.ts`](./code/04-composition.ts)

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

**Code**: [`code/05-structured-output.ts`](./code/05-structured-output.ts)

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

**Key Points**:
- `z.object()` defines the structure
- `.describe()` tells the AI what each field means
- `withStructuredOutput()` ensures the AI returns data in that format
- Result is fully typed in TypeScript!

### Example 6: Complex Structured Data

**Code**: [`code/06-zod-schemas.ts`](./code/06-zod-schemas.ts)

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
1. **Email Generator** - Create templated email responses
2. **Few-Shot Formatter** - Teach the AI a custom format
3. **Multi-Language Support** - Build a translation system
4. **Dynamic Prompt Builder** - Compose prompts based on user preferences

---

## 📚 Additional Resources

- [Prompt Templates Documentation](https://js.langchain.com/docs/modules/prompts/)
- [Few-Shot Prompting Guide](https://js.langchain.com/docs/modules/prompts/few_shot/)
- [LCEL Piping](https://js.langchain.com/docs/expression_language/)

---

## 🗺️ Navigation

- **Previous**: [02-chat-models](../02-chat-models/README.md)
- **Next**: [04-working-with-documents](../04-working-with-documents/README.md)
- **Home**: [Course Home](../README.md)

---

💬 **Questions or stuck?** Join our [Discord community](https://aka.ms/foundry/discord) or open a [GitHub Discussion](https://github.com/microsoft/langchainjs-for-beginners/discussions)!
