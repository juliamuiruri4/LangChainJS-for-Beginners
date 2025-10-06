# Course Setup

Welcome! Before we dive into building AI applications with LangChain.js, let's get your development environment ready.

## ⏱️ Estimated Time

15-20 minutes

## 📋 What You'll Set Up

1. Node.js and npm
2. GitHub Personal Access Token (for free AI models)
3. Project dependencies
4. Environment variables
5. VS Code (recommended IDE)

## 🎯 Prerequisites

- A GitHub account (free)
- Basic command line knowledge
- Text editor or IDE

---

## Step 1: Install Node.js

You'll need **Node.js 18+** to run LangChain.js applications.

### Check if Node.js is installed:

```bash
node --version
```

If you see a version number (v18.0.0 or higher), you're good! Skip to Step 2.

### Install Node.js:

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version
3. Run the installer
4. Verify installation:

```bash
node --version
npm --version
```

---

## Step 2: Clone the Repository

```bash
# Clone the course repository
git clone https://github.com/yourusername/langchainjs-for-beginners.git

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

GitHub Models provides free access to powerful AI models! You just need a Personal Access Token.

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

Open `.env` in your text editor and add your GitHub token:

```bash
# GitHub Models (Free for all GitHub users)
GITHUB_TOKEN=ghp_your_token_here_replace_this

# Azure AI Foundry (Optional - for Chapter 9)
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_ENDPOINT=
AZURE_DEPLOYMENT_NAME=

# LangSmith (Optional - for Chapter 9)
LANGCHAIN_TRACING_V2=false
LANGCHAIN_API_KEY=
LANGCHAIN_PROJECT=langchainjs-for-beginners
```

**Replace `ghp_your_token_here_replace_this` with your actual GitHub token!**

---

## Step 5: Test Your Setup

Let's verify everything works!

### Create a test file:

Create `test-setup.ts` in the project root:

```typescript
/**
 * Setup Test - Verify GitHub Models Access
 */
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

async function testSetup() {
  console.log("🚀 Testing GitHub Models connection...\n");

  // Check if token is set
  if (!process.env.GITHUB_TOKEN) {
    console.error("❌ ERROR: GITHUB_TOKEN not found in .env file");
    process.exit(1);
  }

  try {
    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      configuration: {
        baseURL: "https://models.inference.ai.azure.com",
      },
      apiKey: process.env.GITHUB_TOKEN,
    });

    const response = await model.invoke("Say 'Setup successful!' if you can read this.");

    console.log("✅ SUCCESS! GitHub Models is working!");
    console.log("\nModel response:", response.content);
    console.log("\n🎉 You're ready to start the course!");
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    console.log("\nTroubleshooting:");
    console.log("1. Check your GITHUB_TOKEN in .env file");
    console.log("2. Verify the token has no extra spaces");
    console.log("3. Create a new token if this one doesn't work");
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
🚀 Testing GitHub Models connection...

✅ SUCCESS! GitHub Models is working!

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

### Issue: "GITHUB_TOKEN not found"

**Solutions**:
1. Make sure `.env` file exists in project root
2. Check that `.env` contains `GITHUB_TOKEN=your_token`
3. No quotes needed around the token
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

- [ ] Node.js 18+ installed
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
- Ask in [GitHub Discussions](https://github.com/yourusername/langchainjs-for-beginners/discussions)
- Check the [FAQ](../FAQ.md)
