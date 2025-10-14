# 🦜🔗 LangChain.js for Beginners

Welcome to **LangChain.js for Beginners** - your complete guide to building AI-powered applications with LangChain.js and TypeScript!

## What You'll Build

By the end of this course, you'll know how to:
- ✅ Create intelligent chatbots with context-aware responses
- ✅ Build semantic search engines that understand meaning
- ✅ Develop AI agents that can reason and use tools autonomously
- ✅ Construct Retrieval Augmented Generation (RAG) systems
- ✅ Integrate function calling and external tools
- ✅ Connect to Model Context Protocol (MCP) servers

## Why LangChain.js?

Think of building an AI application like cooking a gourmet meal. You could source ingredients from scratch, create every sauce from base components, and build your own cooking tools—or you could use a well-stocked kitchen with quality ingredients and proven recipes. LangChain.js is that well-stocked kitchen for AI development.

LangChain.js provides:
- 🔌 **Model Flexibility**: Switch between AI providers (OpenAI, Anthropic, Azure, etc.) with minimal code changes
- 🧩 **Pre-built Components**: Reusable building blocks for common AI patterns
- 🔄 **Easy Integration**: Connect LLMs with your data, APIs, and tools
- 🎯 **Production Ready**: Built-in features for monitoring, debugging, and scaling

## Course Structure

This course contains **8 sections** (setup + 7 chapters), each focusing on a specific aspect of LangChain.js:

0. **[Course Setup](./00-course-setup/README.md)** - Get your development environment ready
1. **[Introduction to LangChain.js](./01-introduction/README.md)** - Understanding the framework and core concepts
2. **[Chat Models & Basic Interactions](./02-chat-models/README.md)** - Chat models, messages, and making your first API call
3. **[Prompt Engineering with Templates](./03-prompt-templates/README.md)** - Creating dynamic, reusable prompts
4. **[Documents, Embeddings & Semantic Search](./04-documents-embeddings-semantic-search/README.md)** - Loading documents, creating embeddings, and building semantic search
5. **[Function Calling & Tooling](./05-function-calling-tooling/README.md)** - Extending AI capabilities with function calling and tools
6. **[Building RAG Systems](./06-rag-systems/README.md)** - Combining retrieval with generation using LCEL
7. **[Agents & MCP](./07-agents-mcp/README.md)** - Building autonomous agents and integrating Model Context Protocol

## Prerequisites

Before starting this course, you should be comfortable with:
- JavaScript/TypeScript fundamentals
- Node.js >=22.0.0 (LTS) and npm
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

**Estimated Time**: 12-15 hours total (including hands-on exercises)

## Testing & Validation

All code examples in this course are automatically tested to ensure they work correctly.

### Build Check

Compile all TypeScript files to check for errors and warnings:

```bash
# Check all files compile without errors
npm run build
```

This will:
- ✅ Compile all 98 TypeScript files across all chapters
- ✅ Show type errors and warnings
- ✅ Validate imports and syntax
- ✅ Fast - no API calls, just compilation check

### Runtime Validation

Run all code examples with actual API calls:

```bash
# Validate all code examples
npm test

# Or test individual examples
npx tsx 01-introduction/code/01-hello-world.ts
npx tsx 05-function-calling-tooling/code/01-simple-tool.ts
```

The validation script:
- ✅ Tests all TypeScript examples across all chapters
- ✅ Automatically handles interactive examples with simulated input
- ✅ Provides detailed error reports if issues are found
- ✅ Runs in GitHub Actions when triggered (see below)

**GitHub Actions Validation**: To save CI time and API costs, validation only runs when you include `validate-examples` in your commit message:

```bash
git commit -m "Update RAG examples validate-examples"
```

Or trigger manually via the GitHub Actions UI.

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
