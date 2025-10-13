# Course Setup

Welcome! Before we dive into building AI applications with LangChain.js, let's get your development environment ready. This chapter walks you through installing Node.js, setting up your GitHub token for free AI model access, and configuring your project environment. By the end, you'll have everything you need to start building with LangChain.js.

## Prerequisites

- A GitHub account (free)
- Basic command line knowledge
- Text editor or IDE

## 📋 What You'll Set Up

1. Node.js and npm
2. GitHub Personal Access Token (for free AI models)
3. Project dependencies
4. Environment variables
5. VS Code (recommended IDE)

---

## 📖 The Workshop Analogy

**Imagine you're about to start building a custom piece of furniture.**

Before you start cutting wood or assembling pieces, you need to:
- 🔧 **Set up your workbench** (Install Node.js)
- 🔑 **Get access to the hardware store** (GitHub token for AI models)
- 📦 **Gather your materials** (Install dependencies)
- 📋 **Organize your blueprints** (Configure environment variables)
- 🛠️ **Prepare your tools** (Set up your code editor)

**Would you start building without these?** Of course not!

The same applies to AI development. This setup chapter ensures you have:
- ✅ A solid foundation to build on
- ✅ Access to the AI models you need
- ✅ All tools properly configured
- ✅ A smooth development experience

**Let's get your workshop ready!** In just 15 minutes, you'll be equipped to build powerful AI applications.

---

## Step 1: Install Node.js

You'll need **Node.js LTS (Long Term Support)** to run LangChain.js applications.

### Check if Node.js is installed:

```bash
node --version
```

If you see an LTS version number, you're good! Skip to Step 2.

### Install Node.js:

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version (recommended)
3. Run the installer
4. Verify installation:

```bash
node --version  # Should show an LTS version
npm --version
```

**Why LTS?**
- ✅ **Stable**: Production-ready and well-tested
- ✅ **Supported**: Receives security updates and bug fixes
- ✅ **Reliable**: Recommended for all applications
- ✅ **Compatible**: Works with all LangChain.js packages

---

## Step 2: Clone the Repository

```bash
# Clone the course repository
git clone https://github.com/microsoft/langchainjs-for-beginners

# Navigate to the project
cd langchainjs-for-beginners

# Install dependencies
npm install
```

This will install all required packages:
- `@langchain/openai` - OpenAI integration
- `@langchain/core` - Core LangChain functionality
- `@langchain/langgraph` - Agent workflow orchestration
- `langchain` - Main LangChain package
- `dotenv` - Environment variable management

---

## Step 3: Create GitHub Personal Access Token

GitHub Models provides free access to powerful AI models—you just need a Personal Access Token.

### Create Your Token:

1. **Visit**: https://github.com/settings/tokens/new
2. **Token name**: `langchain-course` (or any name you prefer)
3. **Expiration**: Choose your preference (90 days recommended for learning)
4. **Scopes/Permissions**:
   - ✅ No scopes needed for GitHub Models!
   - You can leave all checkboxes unchecked
5. **Click**: "Generate token"
6. **⚠️ IMPORTANT**: Copy your token now - you won't see it again!

### Why GitHub Models?

- ✅ **Free**: No credit card required
- ✅ **Powerful**: Access to GPT-4o, GPT-4o-mini, and other models
- ✅ **Easy**: Use your existing GitHub account
- ✅ **Learning**: Perfect for this course!

---

## Step 4: Configure Environment Variables

### Create `.env` file:

```bash
# Copy the example file
cp .env.example .env
```

### Edit `.env` file:

Open `.env` in your text editor and configure your AI provider.

**For GitHub Models (Free - Recommended):**

```bash
AI_API_KEY=ghp_your_github_token_here
AI_ENDPOINT=https://models.inference.ai.azure.com
AI_MODEL=gpt-4o-mini
```

**Replace `ghp_your_github_token_here` with your actual GitHub token!**

### Alternative: Azure AI Foundry (Optional)

If you have Azure AI Foundry access, you can use it instead:

```bash
AI_API_KEY=your_azure_openai_api_key
AI_ENDPOINT=https://your-resource.openai.azure.com
AI_MODEL=gpt-4o-mini
```

### Alternative: OpenAI Direct (Optional)

Or use OpenAI directly:

```bash
AI_API_KEY=your_openai_api_key
AI_ENDPOINT=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

**✨ The Magic**: All course examples work with ANY provider - just change the `.env` values!

---

## Step 5: Test Your Setup

Let's verify everything works!

### Create a test file:

Create `test-setup.ts` in the project root:

```typescript
/**
 * Setup Test - Verify AI Provider Access
 */
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function testSetup() {
  console.log("🚀 Testing AI provider connection...\n");

  // Check if required variables are set
  if (!process.env.AI_API_KEY) {
    console.error("❌ ERROR: AI_API_KEY not found in .env file");
    process.exit(1);
  }

  if (!process.env.AI_ENDPOINT) {
    console.error("❌ ERROR: AI_ENDPOINT not found in .env file");
    process.exit(1);
  }

  try {
    const model = new ChatOpenAI({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      configuration: {
        baseURL: process.env.AI_ENDPOINT,
      },
      apiKey: process.env.AI_API_KEY,
    });

    const response = await model.invoke("Say 'Setup successful!' if you can read this.");

    console.log("✅ SUCCESS! Your AI provider is working!");
    console.log(`   Provider: ${process.env.AI_ENDPOINT}`);
    console.log(`   Model: ${process.env.AI_MODEL || "gpt-4o-mini"}`);
    console.log("\nModel response:", response.content);
    console.log("\n🎉 You're ready to start the course!");
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    console.log("\nTroubleshooting:");
    console.log("1. Check your AI_API_KEY in .env file");
    console.log("2. Verify the AI_ENDPOINT is correct");
    console.log("3. Ensure the AI_MODEL is valid for your provider");
    console.log("4. Verify the token/key has no extra spaces");
  }
}

testSetup();
```

### Run the test:

```bash
npx tsx test-setup.ts
```

### Expected output:

```
🚀 Testing AI provider connection...

✅ SUCCESS! Your AI provider is working!
   Provider: https://models.inference.ai.azure.com
   Model: gpt-4o-mini

Model response: Setup successful!

🎉 You're ready to start the course!
```

If you see this, you're all set! If not, check the troubleshooting section below.

---

## Step 6: Install VS Code (Recommended)

While you can use any text editor, we recommend **Visual Studio Code** for the best experience.

### Install VS Code:

1. Visit [code.visualstudio.com](https://code.visualstudio.com/)
2. Download for your OS
3. Install

### Recommended VS Code Extensions:

- **TypeScript** (built-in)
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Error Lens** - Inline error display

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@langchain/openai'"

**Solution**: Run `npm install` in the project directory

### Issue: "AI_API_KEY not found" or "AI_ENDPOINT not found"

**Solutions**:
1. Make sure `.env` file exists in project root
2. Check that `.env` contains all required variables:
   - `AI_API_KEY=your_key`
   - `AI_ENDPOINT=your_endpoint_url`
   - `AI_MODEL=gpt-4o-mini`
3. No quotes needed around the values
4. No spaces before or after the `=`

### Issue: "401 Unauthorized" or "Invalid token"

**Solutions**:
1. Create a new GitHub Personal Access Token
2. Make sure you copied the entire token
3. Token should start with `ghp_` or `github_pat_`
4. Check for extra spaces in `.env` file

### Issue: Rate limit errors

**Solution**: GitHub Models has rate limits. If you hit them:
- Wait a few minutes
- The limits reset quickly
- In Chapter 9, we'll move to Azure AI Foundry for production

---

## ✅ Setup Checklist

Before moving to Chapter 1, make sure you have:

- [ ] Node.js LTS installed
- [ ] Project cloned and dependencies installed (`npm install`)
- [ ] GitHub Personal Access Token created
- [ ] `.env` file configured with your token
- [ ] Test script runs successfully
- [ ] VS Code installed (optional but recommended)

---

## 🎯 What's Next?

You're all set! Time to build your first AI application.

**👉 Continue to [Chapter 1: Introduction to LangChain.js](../01-introduction/README.md)**

---

## 📚 Additional Resources

- [GitHub Models Documentation](https://github.com/marketplace/models)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [Environment Variables Best Practices](https://www.npmjs.com/package/dotenv)

---

## 💬 Need Help?

- Join our [Discord community](https://aka.ms/foundry/discord)
- Ask in [GitHub Discussions](https://github.com/microsoft/langchainjs-for-beginners/discussions)
- Check the [FAQ](../FAQ.md)

---

## 🗺️ Navigation

- **Next**: [01-introduction](../01-introduction/README.md)
- **Home**: [Course Home](../README.md)

---

💬 **Questions or stuck?** Join our [Discord community](https://aka.ms/foundry/discord) or open a [GitHub Discussion](https://github.com/microsoft/langchainjs-for-beginners/discussions)!
