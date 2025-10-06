# GitHub Actions Workflows

This directory contains CI/CD workflows for the LangChain.js for Beginners course.

## Workflows

### `validate-examples.yml`

Automatically validates all code examples in the course on every push and pull request.

**What it does:**
- Runs all TypeScript code examples across all chapters
- Verifies they execute without errors
- Tests on multiple Node.js versions (18, 20, 22)
- Skips interactive examples that require user input

**When it runs:**
- On push to `main` or `develop` branches
- On pull requests to `main` or `develop`
- Manually via workflow dispatch

**Requirements:**
- Uses `AI_API_KEY`, `AI_ENDPOINT`, and `AI_MODEL` secrets
- Falls back to `GITHUB_TOKEN` and default GitHub Models endpoint if not configured
- By default, uses GitHub Models (free) - automatically available in GitHub Actions

## Running Locally

To validate all examples on your local machine:

```bash
# Install dependencies first
npm install

# Run validation
npm test
# or
npm run validate
```

**Note:** You need `AI_API_KEY`, `AI_ENDPOINT`, and `AI_MODEL` environment variables set. See [Chapter 0: Course Setup](../../00-course-setup/README.md) for details.

## GitHub Actions Secrets Setup (Optional)

By default, GitHub Actions will use:
- `GITHUB_TOKEN` (built-in) → Falls back for `AI_API_KEY`
- `https://models.inference.ai.azure.com` → Default for `AI_ENDPOINT`
- `gpt-4o-mini` → Default for `AI_MODEL`

**To use a different provider in CI/CD**, add these secrets to your repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add repository secrets:
   - `AI_API_KEY`: Your API key (GitHub token, Azure key, or OpenAI key)
   - `AI_ENDPOINT`: Your endpoint URL (optional if using defaults)
   - `AI_MODEL`: Your model name (optional if using defaults)

## Validation Details

The validation script:
- ✅ Finds all `.ts` files in `code/` and `solution/` directories
- ✅ Executes each file with a 30-second timeout (60s for slow examples)
- ✅ Skips interactive files that require user input
- ✅ Reports success/failure rates
- ✅ Exits with error code if any examples fail

### Skipped Files

These files require user interaction and are skipped during automated testing:
- `03-human-in-loop.ts` - Requires approval prompts
- `chatbot.ts` - Interactive chat loop

### Test Results

After running, you'll see:
- Total examples tested
- Passed/failed counts
- Success rate percentage
- Detailed error messages for failures

## Adding New Examples

When adding new code examples:

1. **Standard examples** - Will be automatically detected and tested
2. **Interactive examples** - Add filename to `INTERACTIVE_FILES` array in `validate-examples.ts`
3. **Slow examples** - Add filename to `SLOW_FILES` array for 60s timeout

## Troubleshooting

**Tests failing locally:**
- Ensure `GITHUB_TOKEN` is set in your `.env` file
- Run `npm install` to get latest dependencies
- Check that you're using Node.js 18 or higher

**Tests failing in CI:**
- Check that `GITHUB_TOKEN` secret is available
- Review GitHub Actions logs for specific errors
- Verify package versions are compatible

## Best Practices

✅ **DO:**
- Test examples locally before committing
- Add timeouts for long-running examples
- Include error handling in examples
- Document any special requirements

❌ **DON'T:**
- Commit examples that require user input without marking them as interactive
- Use hardcoded API keys (always use environment variables)
- Create examples with infinite loops
- Assume specific file paths exist
