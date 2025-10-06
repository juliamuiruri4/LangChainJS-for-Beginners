# Chapter 4: Working with Documents

## ⏱️ Lesson Overview

- **Estimated Time**: 75 minutes
- **Prerequisites**: Completed [Chapter 3](../03-prompt-templates/README.md)
- **Difficulty**: Beginner

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Load documents from various sources (text, PDF, web)
- Split long documents into manageable chunks
- Understand chunking strategies and their trade-offs
- Work with document metadata
- Prepare documents for RAG systems

---

## 📖 The Library Organizer Analogy

**Imagine you're organizing a massive library.**

When someone asks about "photosynthesis," you can't:
- ❌ Hand them the entire encyclopedia
- ❌ Give them a random page
- ❌ Show them just one word

Instead, you need to:
- ✅ Find the right section (loading)
- ✅ Break it into chapters (chunking)
- ✅ Label each piece (metadata)
- ✅ Make it searchable (preparation for vectors)

**Document processing is exactly like this!**

LLMs have context limits—they can only process so much text at once. Document loaders and splitters help you:
- Load information from various sources
- Break it into digestible pieces
- Preserve important context
- Make it ready for AI to use

---

## 📄 Loading Documents

### Why Document Loaders?

LLMs need text input, but your data comes in many formats:
- Text files (.txt, .md)
- PDFs
- Websites
- JSON/CSV files
- And many more...

**Document loaders handle the complexity of reading different formats.**

### Example 1: Loading Text Files

**Code**: [`code/01-load-text.ts`](./code/01-load-text.ts)

First, create a sample text file:

```typescript
import { TextLoader } from "langchain/document_loaders/fs/text";
import { writeFileSync } from "fs";

// Create sample data
const sampleText = `
LangChain.js is a framework for building applications with large language models.

It provides tools for:
- Working with different AI providers
- Managing prompts and templates
- Processing and storing documents
- Building RAG systems
- Creating AI agents

The framework is designed to be modular and composable, allowing developers
to build complex AI applications by combining simple, reusable components.
`.trim();

writeFileSync("./data/sample.txt", sampleText);

// Load the document
const loader = new TextLoader("./data/sample.txt");
const docs = await loader.load();

console.log("Loaded documents:", docs.length);
console.log("Content:", docs[0].pageContent);
console.log("Metadata:", docs[0].metadata);
```

**Key Points**:
- `TextLoader` reads text files
- Returns array of `Document` objects
- Each document has `pageContent` and `metadata`

---

## ✂️ Splitting Documents

### Why Split Documents?

- **LLM context limits**: Models can only process ~4,000-128,000 tokens
- **Relevance**: Smaller chunks = more precise retrieval
- **Cost**: Smaller inputs = lower API costs

### Chunk Size Trade-offs

| Small Chunks (200-500 chars) | Large Chunks (1000-2000 chars) |
|------------------------------|--------------------------------|
| ✅ More precise | ✅ More context |
| ✅ Better for specific questions | ✅ Better for complex topics |
| ❌ May lose context | ❌ Less precise matching |
| ❌ More chunks to process | ❌ Fewer chunks |

### Example 2: Text Splitting

**Code**: [`code/02-splitting.ts`](./code/02-splitting.ts)

```typescript
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const text = `
[Long article about AI and machine learning...]
`;

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,      // Target size in characters
  chunkOverlap: 50,    // Overlap between chunks
});

const docs = await splitter.createDocuments([text]);

console.log(`Split into ${docs.length} chunks`);

docs.forEach((doc, i) => {
  console.log(`\nChunk ${i + 1}:`);
  console.log(doc.pageContent);
  console.log(`Length: ${doc.pageContent.length} characters`);
});
```

**Splitter Types**:

1. **RecursiveCharacterTextSplitter** (recommended)
   - Splits on paragraphs, then sentences, then words
   - Preserves structure better

2. **CharacterTextSplitter**
   - Simple splitting by character count
   - Less context-aware

3. **TokenTextSplitter**
   - Splits by token count (more precise for LLM limits)

---

## 🔄 Chunk Overlap

**Why overlap chunks?**

Without overlap:
```
Chunk 1: "...the mitochondria is the"
Chunk 2: "powerhouse of the cell..."
```
❌ Context is lost!

With overlap:
```
Chunk 1: "...the mitochondria is the powerhouse"
Chunk 2: "mitochondria is the powerhouse of the cell..."
```
✅ Context preserved!

### Example 3: Comparing Overlap

**Code**: [`code/03-overlap.ts`](./code/03-overlap.ts)

```typescript
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const text = "Your sample text here...";

// No overlap
const noOverlap = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 0,
});

// With overlap
const withOverlap = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
});

const chunks1 = await noOverlap.createDocuments([text]);
const chunks2 = await withOverlap.createDocuments([text]);

console.log("Without overlap:");
chunks1.forEach((doc, i) => console.log(`${i}: ${doc.pageContent}`));

console.log("\nWith overlap:");
chunks2.forEach((doc, i) => console.log(`${i}: ${doc.pageContent}`));
```

**Recommended overlap**: 10-20% of chunk size

---

## 🏷️ Document Metadata

Metadata helps you:
- Track document source
- Filter by category, date, author
- Understand context

### Example 4: Working with Metadata

**Code**: [`code/04-metadata.ts`](./code/04-metadata.ts)

```typescript
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Create documents with metadata
const docs = [
  new Document({
    pageContent: "LangChain.js is a framework for building AI apps...",
    metadata: {
      source: "langchain-guide.md",
      category: "tutorial",
      date: "2024-01-15",
      author: "Tech Team",
    },
  }),
  new Document({
    pageContent: "RAG systems combine retrieval with generation...",
    metadata: {
      source: "rag-explained.md",
      category: "advanced",
      date: "2024-02-20",
    },
  }),
];

// Metadata is preserved when splitting
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 20,
});

const splitDocs = await splitter.splitDocuments(docs);

splitDocs.forEach((doc, i) => {
  console.log(`\nChunk ${i + 1}:`);
  console.log("Content:", doc.pageContent.substring(0, 50) + "...");
  console.log("Metadata:", doc.metadata);
});
```

---

## 🌐 Loading from Web Pages

### Example 5: Web Scraping

**Code**: [`code/05-web-loader.ts`](./code/05-web-loader.ts)

```typescript
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

const loader = new CheerioWebBaseLoader(
  "https://js.langchain.com/docs/introduction/"
);

const docs = await loader.load();

console.log("Loaded web page!");
console.log("Title:", docs[0].metadata.title);
console.log("Content length:", docs[0].pageContent.length);
console.log("First 200 characters:", docs[0].pageContent.substring(0, 200));
```

**Use cases**:
- Documentation sites
- Blog articles
- Knowledge bases
- News articles

---

## 🎓 Key Takeaways

- ✅ **Document loaders** handle different file formats
- ✅ **Text splitters** break documents into manageable chunks
- ✅ **Chunk size matters**: Balance context vs. precision
- ✅ **Overlap preserves context** between chunks
- ✅ **Metadata** tracks source and enables filtering
- ✅ **RecursiveCharacterTextSplitter** is usually the best choice

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Multi-Format Loader** - Load and process different file types
2. **Optimal Chunking** - Experiment with chunk sizes
3. **Metadata Manager** - Build a document organization system
4. **Web Content Processor** - Scrape and process web pages

---

## 📚 Additional Resources

- [Document Loaders Documentation](https://js.langchain.com/docs/modules/data_connection/document_loaders/)
- [Text Splitters Guide](https://js.langchain.com/docs/modules/data_connection/document_transformers/)
- [Working with Metadata](https://js.langchain.com/docs/modules/data_connection/document_loaders/how_to/file_directory)

---

## 🗺️ Navigation

- **Previous**: [03-prompt-templates](../03-prompt-templates/README.md)
- **Next**: [05-embeddings-semantic-search](../05-embeddings-semantic-search/README.md)
- **Home**: [Course Home](../README.md)

---

💬 **Questions or stuck?** Join our [Discord community](https://aka.ms/foundry/discord) or open a [GitHub Discussion](https://github.com/microsoft/langchainjs-for-beginners/discussions)!
