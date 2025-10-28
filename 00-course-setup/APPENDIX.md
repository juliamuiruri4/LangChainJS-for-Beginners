# Appendix

## Azure AI Foundry Setup

While GitHub Models is a great option for many users, if you have an Azure subscription, you can use Azure AI Foundry for production-grade AI applications with enterprise features. This appendix will guide you through setting up an Azure AI Foundry project and deploying models for this course.

## Step-by-Step Setup

You can follow the steps below to deploy models in Azure AI Foundry or visit the [Deploy an Azure OpenAI model quickstart](https://learn.microsoft.com/azure/ai-foundry/quickstarts/get-started-code?tabs=azure-ai-foundry) which will also walk you through the process.

### 1. Create an Azure AI Foundry Project

1. Visit the [Azure AI Foundry portal](https://ai.azure.com/)
2. Sign in with your Azure account
3. Click **+ New project**
4. Fill in the project details:
   - **Project name**: `langchain-course` (or your preferred name)
   - **Subscription**: Select your Azure subscription
   - **Resource group**: Create new or select existing
   - **Region**: Choose a region close to you (e.g., East US, West Europe)
5. Click **Create** (the portal will automatically set up the necessary resources)

### 2. Deploy Required Models

You'll need to deploy two models for this course:

**Deploy gpt-4o-mini & gpt-4o (Chat Model):**

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
7. Follow the same process and deploy `gpt-4o` as well

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

### 3. Get Your Configuration Values

After deploying your models, you need two pieces of information:

1. **API Key**:
   - In your project, go to **Overview** in the left navigation
   - Find **Endpoints and keys**
   - Locate your **API Key**

2. **Endpoint URL**:
   - Locate the **Azure OpenAI** → **Azure OpenAI endpoint** value (looks like: `https://your-resource.openai.azure.com`)

### 4. Add the API Key and Endpoint to Your `.env` File

Ensure that you add `/openai/v1` to the end of your endpoint URL.

```bash
# Azure AI Foundry Configuration
AI_API_KEY=your_azure_api_key_here
AI_ENDPOINT=https://your-resource.openai.azure.com/openai/v1
AI_MODEL=gpt-4o-mini
```

**Replace `your_azure_api_key_here` with your actual Azure API key and update the endpoint URL!**

### Why Azure AI Foundry?

- ✅ **Production-ready**: Enterprise-grade infrastructure and SLAs
- ✅ **Higher limits**: More requests per minute than free tiers
- ✅ **Additional features**: Private endpoints, content filtering, monitoring
- ✅ **Azure integration**: Works seamlessly with other Azure services

---

## Back to Course Setup

Once you've completed the Azure setup, return to the [main setup guide](./00-course-setup.md) and continue with testing your setup.



## 🐛 Troubleshooting

### Issue: "Cannot find module '@langchain/openai'"

**Solution**: Run `npm install` in the project directory

### Issue: "AI_API_KEY not found" or "AI_ENDPOINT not found"

**Solutions**:
1. Make sure `.env` file exists in the project root
2. Check that `.env` contains all required variables:
   - `AI_API_KEY=your_key`
   - `AI_ENDPOINT=your_endpoint_url`
   - `AI_MODEL=gpt-5-mini`
3. No quotes needed around the values
4. No spaces before or after the `=`

### Issue: "401 Unauthorized" or "Invalid token"

**Solutions**:
1. Create a new GitHub Personal Access Token
2. Make sure you copied the entire token
3. The token should start with `ghp_` or `github_pat_`
4. Check for extra spaces in the `.env` file

### Issue: Rate limit errors

**Solution**: GitHub Models have rate limits. If you hit them:
- Wait a few minutes
- The limits reset quickly
- You can use Azure AI Foundry instead if you went through the optional setup above