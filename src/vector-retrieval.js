// src/vector-retrieval.js

const {
  createEmbedding,
  createVectorStore,
  uploadFileToVectorStore,
  searchVectorStore,
  generateAnswerFromContent
} = require('./openai-service');
const fs = require('fs');

/**
 * Calculate the cosine similarity between two vectors
 * @param {Array<number>} vecA - First vector
 * @param {Array<number>} vecB - Second vector
 * @returns {number} - Cosine similarity (between -1 and 1)
 */
function cosineSimilarity(vecA, vecB) {
  // Calculate dot product
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);

  // Calculate magnitudes
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  // Calculate cosine similarity
  return dotProduct / (magA * magB);
}

/**
 * Find the most similar document to a query using the original method
 * @param {string} query - The query text
 * @param {Array<{text: string, embedding?: Array<number>}>} documents - The documents to search
 * @returns {Promise<Array<{text: string, similarity: number}>>} - Ranked documents by similarity
 */
async function findSimilarDocuments(query, documents) {
  // Create embedding for the query
  const queryEmbedding = await createEmbedding(query);

  // Create embeddings for documents if they don't have them already
  const documentsWithEmbeddings = await Promise.all(
    documents.map(async (doc) => {
      if (!doc.embedding) {
        doc.embedding = await createEmbedding(doc.text);
      }
      return doc;
    })
  );

  // Calculate similarity between the query and each document
  const documentsWithSimilarity = documentsWithEmbeddings.map(doc => ({
    text: doc.text,
    similarity: cosineSimilarity(queryEmbedding, doc.embedding)
  }));

  // Sort by similarity (highest first)
  return documentsWithSimilarity.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Set up a vector store for retrieval
 * @param {string} name - Name for the vector store
 * @returns {Promise<string>} - ID of the created vector store
 */
async function setupVectorStore(name) {
  const vectorStore = await createVectorStore(name);
  console.log(`✅ Created vector store: ${vectorStore.id}`);
  return vectorStore.id;
}

/**
 * Add documents to vector store from file
 * @param {string} vectorStoreId - ID of the vector store
 * @param {string} filePath - Path to the file containing documents
 * @returns {Promise<void>}
 */
async function addDocumentsToStore(vectorStoreId, filePath) {
  // Ensure the file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  await uploadFileToVectorStore(vectorStoreId, filePath);
  console.log(`✅ Uploaded file to vector store: ${filePath}`);
}

/**
 * Retrieve relevant information based on a query
 * @param {string} vectorStoreId - ID of the vector store
 * @param {string} query - User's query
 * @returns {Promise<{chunks: string, results: Array<Object>}>} - Retrieved content
 */
async function retrieveInformation(vectorStoreId, query) {
  const results = await searchVectorStore(vectorStoreId, query);
  console.log(`🔍 Found ${results.length} related documents for query: "${query}"`);
  const chunks = results.map(r => {
    return r.content.map(c => c.text).join("\n");
  }).join("\n");
  console.log(`🔍 Retrieved related chunks for query: "${query}"`);
  return { chunks, results };
}

/**
 * Answer a question using RAG (Retrieval Augmented Generation)
 * @param {string} vectorStoreId - ID of the vector store
 * @param {string} query - User's query
 * @param {string} model - Model to use (default: gpt-4o-mini)
 * @returns {Promise<string>} - Generated answer
 */
async function answerWithRAG(vectorStoreId, query, model = "gpt-4o-mini") {
  // Retrieve relevant information
  const { chunks } = await retrieveInformation(vectorStoreId, query);

  // Generate answer using the retrieved content
  const answer = await generateAnswerFromContent(chunks, query, model);
  return answer;
}

/**
 * Complete vector retrieval flow
 * @param {string} filePath - Path to the knowledge base file
 * @param {string} query - User's query
 * @param {string} storeName - Name for the vector store (optional)
 * @returns {Promise<{answer: string, chunks: string}>} - Answer and retrieved chunks
 */
async function vectorRetrievalFlow(filePath, query, storeName = "Knowledge Base") {
  try {
    // 1. Create vector store (Using a fixed vectorStoreId for demo purposes)
    // In production, you might want to create a new one or load one from a database
    const vectorStoreId = 'vs_681f613ce9d08191883d50b01899e3dd';

    // 2. Upload and process file (commented out for demo purposes)
    // To use this in production, uncomment the following line:
    // await addDocumentsToStore(vectorStoreId, filePath);

    // 3. Retrieve relevant information based on the query
    const { chunks } = await retrieveInformation(vectorStoreId, query);

    // 4. Generate answer using LLM based on retrieved chunks
    const answer = await generateAnswerFromContent(chunks, query);

    // Return both the generated answer and the retrieved chunks
    return { answer, chunks };
  } catch (error) {
    console.error("❌ Error in vector retrieval flow:", error);
    throw error;
  }
}

module.exports = {
  cosineSimilarity,
  findSimilarDocuments,
  setupVectorStore,
  addDocumentsToStore,
  retrieveInformation,
  answerWithRAG,
  vectorRetrievalFlow,
};
