# Chapter 3 Assignment: Prompt Engineering with Templates

## Overview

Practice creating reusable, maintainable prompts using templates, few-shot learning, and composition techniques.

## Prerequisites

- Completed [Chapter 3](./README.md)
- Run all four code examples
- Understand template syntax and composition

---

## Challenge 1: Email Response Generator 📧

**Goal**: Create a template system for generating customer service email responses.

**Tasks**:
1. Create `email-generator.ts` in the `03-prompt-templates/code/` folder
2. Build a template that generates emails with:
   - Company name variable
   - Customer name variable
   - Issue type variable (refund, exchange, technical support)
   - Tone variable (formal, friendly, apologetic)
3. Test with at least 3 different scenarios
4. Print both the filled template and the AI response

**Example Scenarios**:
- Refund request - apologetic tone
- Technical support - friendly and helpful tone
- Exchange request - formal and professional tone

**Success Criteria**:
- Template is reusable for different scenarios
- Generated emails match the requested tone
- All variables are properly substituted

---

## Challenge 2: Few-Shot Format Teacher 🎓

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

---

## Challenge 3: Multi-Language Translation System 🌍

**Goal**: Build a translation system that supports multiple language pairs.

**Tasks**:
1. Create `translator.ts`
2. Build a template system that:
   - Supports at least 5 target languages
   - Includes context about formality level (casual/formal)
   - Handles both single sentences and paragraphs
   - Shows the source language and target language clearly
3. Create a menu-driven interface (using readline) where users can:
   - Select target language
   - Choose formality level
   - Enter text to translate
4. Display formatted results

**Languages to Support**:
- Spanish
- French
- German
- Japanese
- Italian

**Success Criteria**:
- Users can select language and formality
- Translations reflect formality level
- Clear, formatted output
- Template is reusable across all language pairs

---

## Challenge 4: Dynamic Prompt Builder 🏗️

**Goal**: Create a system that composes prompts dynamically based on user preferences.

**Tasks**:
1. Create `prompt-builder.ts`
2. Build a modular prompt system with these composable pieces:
   - **Role options**: Teacher, Expert, Friend, Professional
   - **Style options**: Concise, Detailed, Creative, Technical
   - **Format options**: Bullet points, Paragraph, Step-by-step, Q&A
3. Let users select their preferences
4. Compose a final template from their choices
5. Test with the same question using different combinations

**Example Question**: "How does photosynthesis work?"

**Test Combinations**:
- Teacher + Detailed + Step-by-step
- Expert + Technical + Bullet points
- Friend + Concise + Paragraph

**Success Criteria**:
- All combinations work correctly
- Responses clearly reflect chosen options
- System is easily extensible (can add new options)
- Display which combination was used for each response

---

## Bonus Challenge: Prompt Template Library 📚

**Goal**: Create a reusable library of prompt templates for common tasks.

**Tasks**:
1. Create `template-library.ts`
2. Build a collection of at least 5 reusable templates for:
   - Code explanation
   - Text summarization
   - Creative writing prompts
   - Data formatting
   - Question answering
3. Create a CLI that:
   - Lists available templates
   - Lets users select a template
   - Prompts for required variables
   - Executes and displays result
4. Make it easy to add new templates

**Example Templates**:
```typescript
const templates = {
  codeExplainer: ChatPromptTemplate.fromMessages([...]),
  summarizer: ChatPromptTemplate.fromMessages([...]),
  // ... more templates
};
```

**Success Criteria**:
- At least 5 working templates
- Clean CLI interface
- Easy to add new templates
- All templates properly handle variables

---

## Submission Checklist

Before moving to Chapter 4, make sure you've completed:

- [ ] Challenge 1: Email response generator
- [ ] Challenge 2: Few-shot format teacher with JSON output
- [ ] Challenge 3: Multi-language translation system
- [ ] Challenge 4: Dynamic prompt builder
- [ ] Bonus: Prompt template library (optional)

---

## Solutions

Solutions for all challenges are available in the [`solution/`](./solution/) folder. Try to complete the challenges on your own first!

---

## Need Help?

- **Template syntax**: Review examples in [`code/`](./code/)
- **Few-shot issues**: Check example 3 in the code folder
- **Composition**: Review example 4
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## Next Steps

Once you've completed these challenges, you're ready for:

**[Chapter 4: Working with Documents](../04-working-with-documents/README.md)**

Excellent progress! You're mastering prompt engineering! 🚀
