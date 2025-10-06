# Chapter 9 Assignment: Production Best Practices

## Overview

Practice building production-ready LangChain.js applications with proper error handling, monitoring, and optimization.

## Prerequisites

- Completed [Chapter 9](./README.md)
- Run all code examples
- Understand provider abstraction and best practices

---

## Challenge 1: Multi-Provider Application 🔄

**Goal**: Build an app that easily switches between AI providers.

**Tasks**:
1. Create `multi-provider-app.ts` in the `09-production-best-practices/code/` folder
2. Support at least 3 providers:
   - GitHub Models
   - Azure OpenAI (if available)
   - OpenAI (if available)
3. Configuration via:
   - Environment variables
   - Config file (JSON or YAML)
   - CLI arguments
4. Display current provider and model in use
5. Easy switching without code changes

**Example Usage**:
```bash
# Via environment
AI_PROVIDER=github npm run start

# Via CLI
node app.js --provider azure --model gpt-4o

# Via config file
# config.json: { "provider": "github", "model": "gpt-4o-mini" }
```

**Success Criteria**:
- Supports 3+ providers
- Multiple configuration methods
- Clear provider indication
- Zero code changes to switch

---

## Challenge 2: Smart Cost Optimizer 💰

**Goal**: Build a system that optimizes costs by routing to appropriate models.

**Tasks**:
1. Create `cost-optimizer.ts`
2. Implement routing logic:
   ```typescript
   function selectModel(query: string, complexity: string) {
     if (complexity === "simple" || query.length < 50) {
       return cheapModel; // gpt-4o-mini
     } else {
       return premiumModel; // gpt-4o
     }
   }
   ```
3. Track costs:
   - Count tokens
   - Calculate cost per request
   - Running total
4. Features:
   - Complexity detection (simple vs complex)
   - Cost reporting
   - Budget alerts
5. Display cost savings vs always using premium

**Pricing** (approximate):
- gpt-4o-mini: $0.15 per 1M input tokens
- gpt-4o: $2.50 per 1M input tokens

**Success Criteria**:
- Routes queries appropriately
- Accurate cost tracking
- Clear cost reports
- Demonstrates savings

---

## Challenge 3: Monitoring Dashboard 📊

**Goal**: Build a monitoring system for your LangChain app.

**Tasks**:
1. Create `monitoring-system.ts`
2. Track metrics:
   - Request count
   - Average response time
   - Error rate
   - Token usage
   - Cost per request
3. Implement:
   - Real-time stats display
   - Error logging
   - Performance tracking
   - Health checks
4. Output formats:
   - Console dashboard
   - JSON export
   - (Optional) CSV export

**Dashboard Example**:
```
📊 LangChain Monitoring Dashboard
================================
Requests:     127
Success:      122 (96%)
Errors:       5 (4%)
Avg Time:     1.2s
Total Tokens: 45,320
Total Cost:   $0.24
================================
Last 5 Errors:
- Timeout (2 occurrences)
- Rate limit (2 occurrences)
- Invalid model (1 occurrence)
```

**Success Criteria**:
- All metrics tracked
- Real-time updates
- Error logging works
- Export functionality

---

## Challenge 4: Production Deployment Checklist ✅

**Goal**: Create a production-ready application with all best practices.

**Tasks**:
1. Create `production-app.ts`
2. Implement ALL best practices:
   - ✅ Environment-based configuration
   - ✅ Provider abstraction
   - ✅ Fallback strategies
   - ✅ Response caching
   - ✅ Error handling with retries
   - ✅ Request logging
   - ✅ Monitoring/metrics
   - ✅ Rate limiting
   - ✅ Timeout handling
   - ✅ Input validation
3. Create deployment guide (DEPLOYMENT.md)
4. Add health check endpoint
5. Docker configuration (optional)

**DEPLOYMENT.md Should Include**:
- Environment setup
- Required API keys
- Configuration options
- Deployment steps
- Monitoring setup
- Troubleshooting

**Success Criteria**:
- All checklist items implemented
- Complete deployment documentation
- Health check works
- Ready for production

---

## Bonus Challenge: LangSmith Integration 🔬

**Goal**: Integrate LangSmith for observability.

**Tasks**:
1. Create `langsmith-app.ts`
2. Set up LangSmith:
   ```typescript
   process.env.LANGCHAIN_TRACING_V2 = "true";
   process.env.LANGCHAIN_API_KEY = "your-key";
   process.env.LANGCHAIN_PROJECT = "production-app";
   ```
3. Implement:
   - Automatic trace logging
   - Custom metadata tagging
   - Error tracking
   - Performance monitoring
4. Create dashboard views in LangSmith
5. Document findings and insights

**Metrics to Track**:
- Request latency
- Token usage patterns
- Error trends
- Popular queries
- Model performance comparison

**Success Criteria**:
- LangSmith configured correctly
- Traces visible in dashboard
- Custom metadata tagged
- Performance insights documented

---

## Submission Checklist

Before moving to Chapter 10:

- [ ] Challenge 1: Multi-provider app with easy switching
- [ ] Challenge 2: Cost optimizer with routing logic
- [ ] Challenge 3: Monitoring dashboard
- [ ] Challenge 4: Production checklist complete
- [ ] Bonus: LangSmith integration (optional)

---

## Solutions

Solutions available in [`solution/`](./solution/) folder. Try on your own first!

---

## Need Help?

- **Provider switching**: Review example 1
- **Fallback strategies**: Check example 2
- **Caching**: See example 3
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## 🎉 Course Complete!

You've completed all chapters of the LangChain.js for Beginners course!

You're now building production-grade AI applications! 🚀

**What's next?**
- Build your own AI project
- Share your work with the community
- Explore advanced LangChain.js patterns
