# 🦜🔗 LangChain.js for Beginners

Welcome to **LangChain.js for Beginners** - your complete guide to building AI-powered applications with LangChain.js and TypeScript!

## What You'll Build

By the end of this course, you'll know how to:
- ✅ Create intelligent chatbots that remember conversation context
- ✅ Build search engines that understand meaning, not just keywords
- ✅ Develop AI agents that can use tools and make decisions
- ✅ Construct Retrieval Augmented Generation (RAG) systems
- ✅ Build multi-step AI workflows with LangGraph

## Why LangChain.js?

Think of building an AI application like cooking a gourmet meal. You could source ingredients from scratch, create every sauce from base components, and build your own cooking tools—or you could use a well-stocked kitchen with quality ingredients and proven recipes. LangChain.js is that well-stocked kitchen for AI development.

LangChain.js provides:
- 🔌 **Model Flexibility**: Switch between AI providers (OpenAI, Anthropic, Azure, etc.) with minimal code changes
- 🧩 **Pre-built Components**: Reusable building blocks for common AI patterns
- 🔄 **Easy Integration**: Connect LLMs with your data, APIs, and tools
- 🎯 **Production Ready**: Built-in features for monitoring, debugging, and scaling

## Course Structure

This course contains **11 sections** (setup + 10 chapters), each focusing on a specific aspect of LangChain.js:

0. **[Course Setup](./00-course-setup/README.md)** - Get your development environment ready
1. **[Introduction to LangChain.js](./01-introduction/README.md)** - Understanding the framework and setting up your environment
2. **[Chat Models & Basic Interactions](./02-chat-models/README.md)** - Chat models, messages, and making your first API call
3. **[Prompt Engineering with Templates](./03-prompt-templates/README.md)** - Creating dynamic, reusable prompts
4. **[Working with Documents](./04-working-with-documents/README.md)** - Loading, splitting, and processing text data
5. **[Embeddings & Semantic Search](./05-embeddings-semantic-search/README.md)** - Understanding vector representations and similarity
6. **[Building RAG Systems](./06-rag-systems/README.md)** - Combining retrieval with generation for accurate answers
7. **[Agents & Tools](./07-agents-tools/README.md)** - Creating AI agents with tools using LangGraph
8. **[Memory & Conversations](./08-memory-conversations/README.md)** - Building stateful chatbots with LangGraph memory
9. **[Production Best Practices](./09-production-best-practices/README.md)** - Model switching, Azure AI Foundry, and deployment
10. **[Advanced LangGraph Patterns](./10-langgraph-intro/README.md)** - Complex workflows and decision trees

## Prerequisites

Before starting this course, you should be comfortable with:
- JavaScript/TypeScript fundamentals
- Node.js and npm
- Async/await and Promises
- Basic Generative AI concepts (covered in our "GenAI for JavaScript Developers" course)

## Getting Started

Each chapter is self-contained with:
- 📖 **Conceptual explanations** with real-world analogies
- 💻 **Working code examples** you can run immediately
- 🎯 **Hands-on challenges** to test your understanding
- 🔑 **Key takeaways** to reinforce learning

### Setup

```bash
# Clone this repository
git clone https://github.com/microsoft/langchainjs-for-beginners.git

# Navigate to the project
cd langchainjs-for-beginners

# Install dependencies
npm install

# Copy the example environment file
cp .env.example .env

# Edit .env with your AI provider credentials
# See .env.example for all options
```

### AI Provider Configuration

**This course is provider-agnostic!** All examples work with:
- ✅ **GitHub Models** (Free - recommended for learning)
- ✅ **Azure AI Foundry** (Production deployments)
- ✅ **OpenAI Direct** (Also production-ready)

Edit `.env` file with three values:

```bash
AI_API_KEY=your_api_key_here
AI_ENDPOINT=your_endpoint_url
AI_MODEL=gpt-4o-mini
```

**No code changes needed to switch providers** - just update `.env`!

👉 **Start with [Course Setup](./00-course-setup/README.md)** for detailed configuration!

## Learning Path

Each chapter builds on the previous one, but you can also jump to specific topics of interest. We recommend following the sequence for the best learning experience.

**Estimated Time**: 15-20 hours total (including hands-on exercises)

## Testing & Validation

All code examples in this course are automatically tested to ensure they work correctly.

### Build Check

Compile all TypeScript files to check for errors and warnings:

```bash
# Check all files compile without errors
npm run build
```

This will:
- ✅ Compile all 44+ TypeScript files across all chapters
- ✅ Show type errors and warnings
- ✅ Validate imports and syntax
- ✅ Fast - no API calls, just compilation check

### Runtime Validation

Run all code examples with actual API calls:

```bash
# Validate all code examples (takes 20-40 minutes)
npm test

# Or test individual examples
npx tsx 01-introduction/code/01-hello-world.ts
```

The validation script:
- ✅ Tests all TypeScript examples across all chapters
- ✅ Skips interactive examples that require user input
- ✅ Provides detailed error reports if issues are found
- ✅ Runs automatically on every commit via GitHub Actions

**Note**: Runtime validation requires `AI_API_KEY`, `AI_ENDPOINT`, and `AI_MODEL` environment variables. See [Course Setup](./00-course-setup/README.md) for details.

📖 **Full Testing Guide**: See [TESTING.md](./TESTING.md) for detailed testing instructions, troubleshooting, and best practices.

## Support & Community

- 💬 **Issues**: Found a bug or have a question? [Open an issue](https://github.com/microsoft/langchainjs-for-beginners/issues)
- 🌟 **Star this repo** if you find it helpful!
- 🤝 **Contribute**: Pull requests are welcome

If you get stuck or have any questions about building AI apps, join:

[![Azure AI Foundry Discord](https://img.shields.io/badge/Discord-Azure_AI_Foundry_Community_Discord-blue?style=for-the-badge&logo=discord&color=5865f2&logoColor=fff)](https://aka.ms/foundry/discord)

If you have product feedback or errors while building visit:

[![Azure AI Foundry Developer Forum](https://img.shields.io/badge/GitHub-Azure_AI_Foundry_Developer_Forum-blue?style=for-the-badge&logo=github&color=000000&logoColor=fff)](https://aka.ms/foundry/forum)

## Additional Resources

- [LangChain.js Official Documentation](https://js.langchain.com/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraphjs/)
- [GitHub Models](https://github.com/marketplace/models)
- [Azure AI Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/)

---

**Ready to build amazing AI applications?** Let's get started with [Course Setup](./00-course-setup/README.md)! 🚀
