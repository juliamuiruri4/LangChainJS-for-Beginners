# Testing Guide

This guide explains how to run and validate all code examples in the course.

## Build Check (Fast)

Check that all TypeScript files compile without errors:

```bash
npm run build
```

**⏱️ Expected Runtime**: 10-30 seconds
- Type-checks 44+ TypeScript files
- No API calls - pure compilation check
- Catches syntax errors, type errors, and import issues
- Great for quick validation before committing

## Runtime Validation (Comprehensive)

Execute all code examples with actual API calls:

```bash
npm test
```

**⏱️ Expected Runtime**: 20-40 minutes for full validation
- 42+ code examples across 10 chapters
- Many examples make multiple API calls
- Sequential execution to avoid rate limiting
- Some examples have 60-second timeouts

## Testing Individual Examples

To test a specific example:

```bash
# Run any example directly
npx tsx 01-introduction/code/01-hello-world.ts

# Or use npm start
npm start 02-chat-models/code/01-multi-turn.ts
```

## What Gets Tested

The validation script tests:
- ✅ All `.ts` files in `code/` directories
- ✅ All `.ts` files in `solution/` directories
- ⏭️ **Skips** interactive files (require user input):
  - `03-human-in-loop.ts`
  - `chatbot.ts`
  - `qa-program.ts`

## Validation Details

### Timeouts
- **Standard examples**: 30-second timeout
- **Slow examples**: 60-second timeout (examples with multiple API calls)

### Slow Files
These files make multiple API calls and use longer timeouts:
- `03-model-comparison.ts` - Compares 2 models
- `model-performance.ts` - Performance benchmarking
- `personality-test.ts` - Multiple personality tests
- `03-parameters.ts` - Tests 9 different parameter combinations
- `temperature-lab.ts` - Temperature comparison experiments
- `streaming-chat.ts` - Streaming examples
- `04-error-handling.ts` - Error scenarios
- `robust-chat.ts` - Retry logic testing
- `01-multi-turn.ts` - Multi-turn conversations
- `02-streaming.ts` - Streaming demonstrations
- `03-summary-memory.ts` - Memory with summarization

### Interactive Files
These files are **skipped** during automated testing:
- `03-human-in-loop.ts` - Requires approval prompts
- `chatbot.ts` - Interactive chat loop
- `qa-program.ts` - Q&A with readline

## Prerequisites

### Environment Variables

You **must** have these environment variables set in your `.env` file:

```bash
AI_API_KEY=your_api_key
AI_ENDPOINT=your_endpoint_url
AI_MODEL=gpt-4o-mini
```

**For GitHub Models** (free):
```bash
AI_API_KEY=ghp_your_github_token
AI_ENDPOINT=https://models.inference.ai.azure.com
AI_MODEL=gpt-4o-mini
```

Get GitHub token at: https://github.com/settings/tokens

See [Course Setup](./00-course-setup/README.md) for other providers.

### Dependencies

Install all dependencies first:

```bash
npm install
```

## CI/CD Integration

The validation runs automatically via GitHub Actions on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual trigger via workflow dispatch

See `.github/workflows/validate-examples.yml` for details.

## Troubleshooting

### "Command timed out"
- **Cause**: Example taking longer than timeout allows
- **Solution**: Add the file to `SLOW_FILES` array in `validate-examples.ts`

### "Missing AI_API_KEY" or "Missing AI_ENDPOINT"
- **Cause**: Environment variables not set
- **Solution**: Add `AI_API_KEY`, `AI_ENDPOINT`, and `AI_MODEL` to your `.env` file

### "Rate limit exceeded"
- **Cause**: Too many API calls in short time
- **Solution**: Wait a few minutes and try again

### "Module not found"
- **Cause**: Dependencies not installed
- **Solution**: Run `npm install`

## Adding New Examples

When adding new code examples:

1. **Standard example** (single API call, completes quickly):
   - No changes needed - automatically detected and tested

2. **Slow example** (multiple API calls, takes >30 seconds):
   - Add filename to `SLOW_FILES` array in `validate-examples.ts`

3. **Interactive example** (requires user input):
   - Add filename to `INTERACTIVE_FILES` array in `validate-examples.ts`

Example:

```typescript
// In validate-examples.ts

const INTERACTIVE_FILES = [
  "03-human-in-loop.ts",
  "chatbot.ts",
  "qa-program.ts",
  "your-new-interactive-file.ts", // Add here
];

const SLOW_FILES = [
  "03-model-comparison.ts",
  "model-performance.ts",
  "your-new-slow-file.ts", // Add here
];
```

## Best Practices

### ✅ DO:
- Test examples locally before committing
- Use appropriate timeouts for your examples
- Include error handling in examples
- Set `AI_API_KEY` in `.env` (never commit it!)
- Add comments explaining what the example does

### ❌ DON'T:
- Commit interactive examples without marking them
- Use hardcoded API keys (always use `process.env.AI_API_KEY`)
- Hardcode endpoints (always use `process.env.AI_ENDPOINT`)
- Create infinite loops
- Assume files exist without checking
- Skip local testing before pushing

## Manual Validation

If you want to manually test specific chapters:

```bash
# Test all Chapter 1 examples
npx tsx 01-introduction/code/01-hello-world.ts
npx tsx 01-introduction/code/02-message-types.ts
npx tsx 01-introduction/code/03-model-comparison.ts

# Test all Chapter 2 examples
npx tsx 02-chat-models/code/01-multi-turn.ts
npx tsx 02-chat-models/code/02-streaming.ts
# ... and so on
```

## Validation Report

When validation completes, you'll see:

```
📊 Test Results:

   Total:    42
   Passed:   40 ✅
   Failed:   2 ❌
   Skipped:  3 ⏭️
   Success:  95.2%
```

Failed examples will show detailed error messages to help debug issues.

## Performance Tips

To speed up validation during development:

1. **Test specific files** instead of running full validation
2. **Comment out slow examples** temporarily in `validate-examples.ts`
3. **Use GitHub Actions** for full validation (runs in cloud)
4. **Test locally** only on files you're actively working on

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/langchainjs-for-beginners/issues)
- **Community**: [Discord](https://aka.ms/foundry/discord)
- **Forum**: [GitHub Forum](https://aka.ms/foundry/forum)
