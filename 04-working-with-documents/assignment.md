# Chapter 4 Assignment: Working with Documents

## Overview

Practice loading, splitting, and managing documents from various sources with proper metadata handling.

## Prerequisites

- Completed [Chapter 4](./README.md)
- Run all code examples
- Understand chunking strategies

---

## Challenge 1: Multi-Format Document Loader 📚

**Goal**: Create a system that loads and processes multiple document types.

**Tasks**:
1. Create `multi-loader.ts`
2. Create sample files:
   - A text file with an article
   - A JSON file with structured data
   - A CSV file with records
3. Load all files and display:
   - File type
   - Content preview
   - Character/record count
   - Metadata

**Success Criteria**:
- Loads at least 3 different file types
- Displays clear information about each
- Handles errors gracefully

---

## Challenge 2: Optimal Chunking Experiment 📏

**Goal**: Find the optimal chunk size for different use cases.

**Tasks**:
1. Create `chunk-optimizer.ts`
2. Test the same long document with different configurations:
   - Small chunks (200 chars, 20 overlap)
   - Medium chunks (500 chars, 50 overlap)
   - Large chunks (1000 chars, 100 overlap)
3. For each configuration, display:
   - Number of chunks created
   - Average chunk size
   - First and last chunk
4. Add your analysis of which works best for:
   - Precise question answering
   - Understanding broad topics
   - Cost optimization

**Success Criteria**:
- Tests at least 3 chunk sizes
- Clear comparison output
- Thoughtful analysis of trade-offs

---

## Challenge 3: Document Organization System 🗂️

**Goal**: Build a system that organizes documents with metadata.

**Tasks**:
1. Create `doc-organizer.ts`
2. Create 10+ documents with varied metadata:
   - Different categories
   - Different dates
   - Different authors
   - Custom tags
3. Implement functions to:
   - List all documents
   - Filter by category
   - Filter by date range
   - Search by tags
   - Sort by any metadata field
4. Create a simple CLI interface

**Success Criteria**:
- At least 10 documents with rich metadata
- All filter functions work correctly
- Clean, formatted output
- Easy to add new documents

---

## Challenge 4: Web Content Processor 🌐

**Goal**: Scrape, process, and store content from web pages.

**Tasks**:
1. Create `web-processor.ts`
2. Use CheerioWebBaseLoader to scrape 3-5 web pages
3. For each page:
   - Extract title and main content
   - Remove HTML tags
   - Split into appropriate chunks
   - Add metadata (URL, scrape date, word count)
4. Save processed documents to JSON file
5. Create a search function over the processed content

**Success Criteria**:
- Successfully scrapes multiple pages
- Clean text extraction
- Proper chunking
- Searchable output

---

## Bonus Challenge: Smart Document Chunker 🧠

**Goal**: Build an intelligent chunker that adapts to document structure.

**Tasks**:
1. Create `smart-chunker.ts`
2. Implement logic that:
   - Detects document structure (headers, sections, paragraphs)
   - Chunks based on structure, not just character count
   - Keeps related content together
   - Adds section information to metadata
3. Test with structured documents (markdown, articles with headers)
4. Compare with standard character-based chunking

**Success Criteria**:
- Respects document structure
- Related content stays together
- Metadata includes structural information
- Demonstrably better than naive chunking

---

## Submission Checklist

- [ ] Challenge 1: Multi-format loader works
- [ ] Challenge 2: Chunk optimization analysis complete
- [ ] Challenge 3: Document organization system functional
- [ ] Challenge 4: Web processor scrapes and processes pages
- [ ] Bonus: Smart chunker implemented (optional)

---

## Solutions

Solutions available in [`solution/`](./solution/) folder. Try on your own first!

---

## Next Steps

Ready for [Chapter 5: Embeddings & Semantic Search](../05-embeddings-semantic-search/README.md)!
