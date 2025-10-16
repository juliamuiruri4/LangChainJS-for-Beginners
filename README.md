# 🦜🔗 LangChain.js for Beginners

[![GitHub license](https://img.shields.io/github/license/danwahlin/langchainjs-for-beginners.svg)](https://github.com/danwahlin/langchainjs-for-beginners/blob/main/LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/danwahlin/langchainjs-for-beginners.svg)](https://github.com/danwahlin/langchainjs-for-beginners/graphs/contributors/)
[![GitHub issues](https://img.shields.io/github/issues/danwahlin/langchainjs-for-beginners.svg)](https://github.com/danwahlin/langchainjs-for-beginners/issues/)
[![GitHub pull-requests](https://img.shields.io/github/issues-pr/danwahlin/langchainjs-for-beginners.svg)](https://github.com/danwahlin/langchainjs-for-beginners/pulls/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[![GitHub watchers](https://img.shields.io/github/watchers/danwahlin/langchainjs-for-beginners.svg?style=social&label=Watch)](https://github.com/danwahlin/langchainjs-for-beginners/)
[![GitHub forks](https://img.shields.io/github/forks/danwahlin/langchainjs-for-beginners.svg?style=social&label=Fork)](https://github.com/danwahlin/langchainjs-for-beginners/)
[![GitHub stars](https://img.shields.io/github/stars/danwahlin/langchainjs-for-beginners.svg?style=social&label=Star)](https://github.com/danwahlin/langchainjs-for-beginners/)

[![Azure AI Foundry Discord](https://img.shields.io/badge/Discord-Azure_AI_Foundry_Community_Discord-blue?style=for-the-badge&logo=discord&color=5865f2&logoColor=fff)](https://aka.ms/foundry/discord)

## 🚀 Getting Started

Welcome to **LangChain.js for Beginners** - your complete, hands-on guide to building AI-powered applications with LangChain.js and TypeScript!

Think of building an AI application like cooking a gourmet meal. You could source ingredients from scratch, create every sauce from base components, and build your own cooking tools. Or, you could use a well-stocked kitchen with quality ingredients and proven recipes. **LangChain.js is that well-stocked kitchen for AI development.**

### What You'll Learn and Build

This course takes you from zero to building robust AI applications. Here's your journey:

**🤖 Interactive AI Chatbots**
- Build chatbots that remember your conversation (like ChatGPT)
- See AI responses appear word-by-word as they're generated
- Create AI assistants with different personalities and expertise

**🔍 Intelligent Document Search**
- Build search that understands meaning, not just keywords
  - Search for "indoor pets" and find results about cats and fish (even though those words don't appear!)
- Make AI answer questions using your own documents
  - Upload your company handbook → Ask "What's our vacation policy?" → Get accurate answers

**🛠️ AI with Superpowers**
- Give AI the ability to use tools and take actions
  - "What's the weather in Paris and how do I say hello in French?" → AI uses weather tool + translation tool
- Extract structured data from messy text
  - Turn "Call John at 555-0123 tomorrow" into `{name: "John", phone: "555-0123", date: "tomorrow"}`

**🚀 Autonomous AI Agents**
- Build AI that makes decisions and solves multi-step problems on its own
  - "Find the cheapest flight to Tokyo and book a hotel nearby" → AI searches, compares, and plans automatically
- Connect AI to your favorite tools and services using modern standards

**By the end**, you'll have a solid understanding of LangChain.js and understand how to build real AI applications you can deploy!

### Why LangChain.js?

**You could call AI APIs directly...** but LangChain.js makes your life easier:

- 🔌 **Switch AI providers in seconds** - Start with free GitHub Models, move to Azure for production. Same code, just change one line!
- 🧩 **Don't reinvent the wheel** - Get pre-built solutions for common patterns (chatbots, document search, agents). Focus on your unique features.
- 🐛 **Catch errors before production** - TypeScript support means your editor catches mistakes as you type. No more "undefined is not a function" surprises.
- 👥 **Learn from thousands of developers** - Active community, extensive documentation, and countless examples. When you're stuck, help is available.
- ⚡ **Ship faster** - Get a working prototype in hours, not weeks. Templates and examples help you start strong.

> **New to AI development?** Check out our companion course [**Generative AI with JavaScript**](https://github.com/microsoft/generative-ai-with-javascript) to learn AI fundamentals first!

---

## 📚 Course Structure

This course contains **8 chapters** (setup + 7 chapters), each building on the previous to teach you LangChain.js from the ground up. Each chapter includes conceptual explanations, working code examples, and hands-on challenges.

| # | Chapter | Description | Key Concepts |
|---|---------|-------------|--------------|
| 0 | [Course Setup](./00-course-setup/README.md) | Get your development environment ready | Environment setup, AI provider configuration |
| 1 | [Introduction to LangChain.js](./01-introduction/README.md) | Understanding the framework and core concepts | LangChain fundamentals, first LLM call |
| 2 | [Chat Models & Basic Interactions](./02-chat-models/README.md) | Chat models, messages, and conversations | Message types, streaming, callbacks |
| 3 | [Prompt Engineering with Templates](./03-prompt-templates/README.md) | Creating dynamic, reusable prompts | Prompt templates, few-shot prompting |
| 4 | [Documents, Embeddings & Semantic Search](./04-documents-embeddings-semantic-search/README.md) | Loading documents, creating embeddings, and building semantic search | Vector embeddings, similarity search |
| 5 | [Function Calling & Tooling](./05-function-calling-tooling/README.md) | Extending AI capabilities with function calling and tools | Zod schemas, tool binding, type safety |
| 6 | [Building RAG Systems](./06-rag-systems/README.md) | Combining retrieval with generation using LCEL | RAG pattern, LCEL chains, retrieval |
| 7 | [Getting Started with Agents & MCP](./07-agents-mcp/README.md) | Building autonomous agents and integrating Model Context Protocol | ReAct pattern, agent loops, MCP |

Each chapter includes:
- 📖 **Conceptual explanations** with real-world analogies
- 💻 **Working code examples** you can run immediately
- 🎯 **Hands-on challenges** to test your understanding
- 🔑 **Key takeaways** to reinforce learning

---

## 📋 Prerequisites

Before starting this course, you should be comfortable with:

- **JavaScript/TypeScript fundamentals** - Variables, functions, objects, async/await
- **Node.js (LTS)** and npm - Package management and CLI tools
- **Basic Generative AI concepts** - Basic understanding of LLMs, prompts, tokens which are covered in our [GenAI with JavaScript](https://github.com/microsoft/generative-ai-with-javascript) course

### Required Tools

- [Node.js (LTS)](https://nodejs.org/)
- Code editor ([VS Code recommended](https://code.visualstudio.com/))
- Terminal/Command line
- [Git](https://git-scm.com/)

### AI Provider Account

You'll need access to an AI provider. We recommend:

- ✅ **GitHub Models** - Free for learning and experimentation
- ✅ **Azure AI Foundry** - For production deployments

---

## 📖 Course Resources

- **[Glossary](./GLOSSARY.md)** - Comprehensive definitions of all terms used throughout the course

---

## 📚 Related Courses

Expand your AI development skills with these Microsoft courses:

- [Generative AI with JavaScript](https://github.com/microsoft/generative-ai-with-javascript)
- [Generative AI for Beginners](https://aka.ms/genai-beginners)
- [Generative AI for Beginners .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet)
- [Generative AI with Java](https://github.com/microsoft/Generative-AI-for-beginners-java)
- [AI for Beginners](https://aka.ms/ai-beginners)
- [AI Agents for Beginners - A Course](https://github.com/microsoft/ai-agents-for-beginners)
- [Data Science for Beginners](https://aka.ms/datascience-beginners)
- [ML for Beginners](https://aka.ms/ml-beginners)
- [Cybersecurity for Beginners](https://github.com/microsoft/Security-101) 
- [Web Dev for Beginners](https://aka.ms/webdev-beginners)
- [IoT for Beginners](https://aka.ms/iot-beginners)
- [XR Development for Beginners](https://github.com/microsoft/xr-development-for-beginners)
- [Mastering GitHub Copilot for Paired Programming](https://github.com/microsoft/Mastering-GitHub-Copilot-for-Paired-Programming)
- [Mastering GitHub Copilot for C#/.NET Developers](https://github.com/microsoft/mastering-github-copilot-for-dotnet-csharp-developers)
- [Choose Your Own Copilot Adventure](https://github.com/microsoft/CopilotAdventures)

---

## Getting Help

If you get stuck or have any questions about building AI apps, join:

[![Azure AI Foundry Discord](https://img.shields.io/badge/Discord-Azure_AI_Foundry_Community_Discord-blue?style=for-the-badge&logo=discord&color=5865f2&logoColor=fff)](https://aka.ms/foundry/discord)

If you have product feedback or errors while building visit:

[![Azure AI Foundry Developer Forum](https://img.shields.io/badge/GitHub-Azure_AI_Foundry_Developer_Forum-blue?style=for-the-badge&logo=github&color=000000&logoColor=fff)](https://aka.ms/foundry/forum)

---

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For details, visit <https://cla.opensource.microsoft.com>.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general). Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship. Any use of third-party trademarks or logos is subject to those third-parties' policies.

