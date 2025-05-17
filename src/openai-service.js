// src/openai-service.js

const { OpenAI, toFile } = require('openai');
const fs = require('fs');
require('dotenv').config();

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Create an embedding vector from the given text
 * @param {string} text - Text to embed
 * @returns {Promise<Array<number>>} - The embedding vector
 */
async function createEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002", // This is a commonly used embedding model
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw error;
  }
}

/**
 * Generate text using OpenAI's completion models
 * @param {string} prompt - The prompt to complete
 * @returns {Promise<string>} - The generated text
 */
async function generateText(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}

/**
 * Creates a new vector store
 * @param {string} name - Name for the vector store
 * @returns {Promise<Object>} - Vector store object
 */
async function createVectorStore(name) {
  try {
    const vectorStore = await openai.vectorStores.create({
      name,
    });
    return vectorStore;
  } catch (error) {
    console.error('Error creating vector store:', error);
    throw error;
  }
}

/**
 * Uploads a file to a vector store
 * @param {string} vectorStoreId - ID of the vector store
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} - Upload result
 */
async function uploadFileToVectorStore(vectorStoreId, filePath) {
  try {
    const file = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: "user_data",
    });
    // await openai.vectorStores.files.uploadAndPoll({
    //   vectorStoreId: vectorStoreId,
    //   file: toFile(fs.createReadStream(filePath)),
    // });
    const myVectorStoreFile = await openai.vectorStores.files.create(
      vectorStoreId,
      {
        file_id: file.id
      }
    );
  } catch (error) {
    console.error('Error uploading file to vector store:', error);
    throw error;
  }
}

/**
 * Search for relevant content in a vector store
 * @param {string} vectorStoreId - ID of the vector store
 * @param {string} query - Query text
 * @returns {Promise<Array<Object>>} - Search results
 */
async function searchVectorStore(vectorStoreId, query) {
  try {
    const searchResults = await openai.vectorStores.search(
      vectorStoreId,
      { query: query },
    )
    return searchResults.body.data;
  } catch (error) {
    console.error('Error searching vector store:', error);
    throw error;
  }
}

/**
 * Generate answer using LLM based on retrieved content
 * @param {string} retrievedContent - Content retrieved from vector store
 * @param {string} userQuery - Original user query
 * @param {string} model - Model to use (default: gpt-4o-mini)
 * @returns {Promise<string>} - Generated answer
 */
async function generateAnswerFromContent(retrievedContent, userQuery, model = "gpt-4o-mini") {
  try {
    const chatResponse = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "Answer the user's question based on the following content. If the anwser dont exisit or related the question then reply you dont have info about that" },
        { role: "user", content: `Content:\n${retrievedContent}\n\nQuestion: ${userQuery}` },
      ],
    });

    return chatResponse.choices[0].message.content;
  } catch (error) {
    console.error('Error generating answer:', error);
    throw error;
  }
}

/**
 * Generate answer using LLM based on retrieved content
 * @param {string} retrievedContent - Content retrieved from vector store
 * @param {string} userQuery - Original user query
 * @param {string} model - Model to use (default: gpt-4o-mini)
 * @returns {Promise<string>} - Generated answer
 */
async function generateAnswerCombinationalFromContent(retrievedContent, userQuery, model = "gpt-4o-mini") {
  try {
    const chatResponse = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a technically-grounded creative assistant. Your task is to generate answers that are factually accurate and based only on the provided content. However, express the answer in a fresh, imaginative, and engaging way — using metaphors, rephrasings, or vivid comparisons if appropriate. Do not invent information. Do not include anything that cannot be traced back to the source content. Always prioritize factual correctness while making the answer clear and interesting." },
        { role: "user", content: `Content:\n${retrievedContent}\n\nQuestion: ${userQuery}` },
      ],
    });

    return chatResponse.choices[0].message.content;
  } catch (error) {
    console.error('Error generating answer:', error);
    throw error;
  }
}

/**
 * Generate answer using LLM based on retrieved content
 * @param {string} retrievedContent - Content retrieved from vector store
 * @param {string} userQuery - Original user query
 * @param {string} model - Model to use (default: gpt-4o-mini)
 * @returns {Promise<string>} - Generated answer
 */
async function generateAnswerTransformationalFromContent(retrievedContent, userQuery, model = "gpt-4o-mini") {
  try {
    const chatResponse = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "If the function is under development or not available, respond only with: 'This function is under development.' Do not include any explanation, code, or formatting.",
        },
        {
          role: "user",
          content: `Content:\n${retrievedContent}\n\nQuestion: ${userQuery}`,
        },
      ],
    });

    return chatResponse.choices[0].message.content;
  } catch (error) {
    console.error('Error generating answer:', error);
    throw error;
  }
}

module.exports = {
  createEmbedding,
  generateText,
  createVectorStore,
  uploadFileToVectorStore,
  searchVectorStore,
  generateAnswerFromContent,
  generateAnswerCombinationalFromContent,
  generateAnswerTransformationalFromContent,
};
