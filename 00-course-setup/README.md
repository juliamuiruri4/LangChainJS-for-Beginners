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

If you see an LTS version number (visit [nodejs.org](https://nodejs.org/) to check), you're good! Skip to Step 2.

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
git clone https://github.com/danwahlin/langchainjs-for-beginners

# Navigate to the project
cd langchainjs-for-beginners

# Install dependencies
npm install

# Install tsx globally
npm install -g tsx
```

This will install all required packages:
- `@langchain/openai` - OpenAI integration
- `@langchain/core` - Core LangChain functionality
- `@langchain/langgraph` - Agent workflow orchestration
- `langchain` - Main LangChain package
- `dotenv` - Environment variable management

### Why install tsx globally?

**tsx** is a TypeScript execution engine that lets you run `.ts` files directly without compiling them first.

**Without tsx**:
```bash
# You'd need to compile first, then run
tsc myfile.ts        # Compile TypeScript → JavaScript
node myfile.js       # Run the JavaScript file
```

**With tsx** (what we'll use):
```bash
# Run TypeScript files directly - no compilation step needed!
tsx myfile.ts
```

**Benefits**:
- ✅ **Faster development** - No compile step needed
- ✅ **Simpler workflow** - One command instead of two
- ✅ **Global installation** - Available everywhere on your system
- ✅ **Perfect for learning** - Focus on code, not build processes

Throughout this course, you'll run examples using `tsx filename.ts` - quick and easy!

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

If you have an Azure subscription, you can use Azure AI Foundry for production-grade AI applications with enterprise features.

#### Step-by-Step Setup:

**1. Create an Azure AI Foundry Project**

1. Visit the [Azure AI Foundry portal](https://ai.azure.com/)
2. Sign in with your Azure account
3. Click **+ New project**
4. Fill in the project details:
   - **Project name**: `langchain-course` (or your preferred name)
   - **Subscription**: Select your Azure subscription
   - **Resource group**: Create new or select existing
   - **Region**: Choose a region close to you (e.g., East US, West Europe)
5. Click **Create** (the portal will automatically set up the necessary resources)

**2. Deploy Required Models**

You'll need to deploy two models for this course:

**Deploy GPT-4o-mini (Chat Model):**

1. In your project, go to **Models + endpoints** in the left navigation
2. Click **+ Deploy model** → **Deploy base model**
3. Search for and select **gpt-4o-mini**
4. Click **Confirm**
5. Configure deployment:
   - **Deployment name**: `gpt-4o-mini` (keep this name for consistency)
   - **Model version**: Select the latest available
   - **Deployment type**: Global Standard
   - Click **Deploy**
6. Wait for deployment to complete

**Deploy Text Embedding Model:**

1. Click **+ Deploy model** → **Deploy base model** again
2. Search for and select **text-embedding-3-small**
3. Click **Confirm**
4. Configure deployment:
   - **Deployment name**: `text-embedding-3-small` (keep this name)
   - **Model version**: Select the latest available
   - **Deployment type**: Global Standard
   - Click **Deploy**
5. Wait for deployment to complete

**3. Get Your Configuration Values**

After deploying your models, you need two pieces of information:

1. **API Key**:
   - In your project, go to **Overview** in the left navigation
   - Find **Endpoints and keys**
   - Locate your **API Key**

2. **Endpoint URL**:
   - Locate the **Azure OpenAI** → **Azure OpenAI endpoint** value (looks like: `https://your-resource.openai.azure.com`)

**4. Add the API Key and Endpoint to Your `.env` File:**

```bash
# Azure AI Foundry Configuration
AI_API_KEY=your_azure_api_key_here
AI_ENDPOINT=https://your-resource.openai.azure.com
```

**Important Notes:**
- ✅ **Deployment names must match**: The course uses `gpt-4o-mini` and `text-embedding-3-small` as deployment names
- ✅ **Keep your API key secure**: Never commit `.env` to version control
- ✅ **Cost management**: Azure AI Foundry is a paid service. Set up cost alerts in the Azure portal
- ✅ **Production ready**: Azure AI Foundry provides enterprise features like Responsible AI, monitoring, logging, and SLA guarantees

**Additional Resources:**
- [Azure AI Foundry Quickstart](https://learn.microsoft.com/en-us/azure/ai-foundry/quickstarts/get-started-code?tabs=typescript)
- [Azure OpenAI Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/)
- [Model Deployment Guide](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/deploy-models)



## Step 5: Test Your Setup

Let's verify everything works!

### Run the test:

Run the following command in your terminal from the root of the project:

```bash
tsx scripts/test-setup.ts
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
- Ask in [GitHub Discussions](https://github.com/danwahlin/langchainjs-for-beginners/discussions)
- Check the [FAQ](../FAQ.md)

---

## 🗺️ Navigation

- **Next**: [01-introduction](../01-introduction/README.md)
- **Home**: [Course Home](../README.md)

---

## 💬 Questions or stuck?

If you get stuck or have any questions about building AI apps, join:

[![Azure AI Foundry Discord](https://img.shields.io/badge/Discord-Azure_AI_Foundry_Community_Discord-blue?style=for-the-badge&logo=discord&color=5865f2&logoColor=fff)](https://aka.ms/foundry/discord)

If you have product feedback or errors while building visit:

[![Azure AI Foundry Developer Forum](https://img.shields.io/badge/GitHub-Azure_AI_Foundry_Developer_Forum-blue?style=for-the-badge&logo=github&color=000000&logoColor=fff)](https://aka.ms/foundry/forum)
