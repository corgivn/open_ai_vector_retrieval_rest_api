// src/vector-demo.js

const { vectorRetrievalFlow, vectorRetrievalCombinationalFlow, vectorRetrievalTransformationalFlow } = require('./vector-retrieval');

/**
 * Process a vector retrieval query
 * @param {string} query - The user's query
 * @param {string} filePath - Path to the file containing documents (optional)
 * @returns {Promise<{answer: string, chunks: string}>} - Answer and retrieved chunks
 */
async function processVectorQuery(query, filePath = "/Users/roger/Documents/my_projects/open_ai_vector_retrieval_rest_api/test_data.json") {
  console.log(`Processing query: "${query}"\n`);

  try {
    const { answer, chunks } = await vectorRetrievalFlow(filePath, query, "Programming FAQ");
    return { answer, chunks };
  } catch (error) {
    console.error('Error processing vector query:', error);
    throw error;
  }
}

async function processVectorCombinationalQuery(query, filePath = "/Users/roger/Documents/my_projects/open_ai_vector_retrieval_rest_api/test_data.json") {
  console.log(`Processing query: "${query}"\n`);

  try {
    const { answer, chunks } = await vectorRetrievalCombinationalFlow(filePath, query, "Programming FAQ");
    return { answer, chunks };
  } catch (error) {
    console.error('Error processing vector query:', error);
    throw error;
  }
}

async function processVectorTransformationalQuery(query, filePath = "/Users/roger/Documents/my_projects/open_ai_vector_retrieval_rest_api/test_data.json") {
  console.log(`Processing query: "${query}"\n`);

  try {
    const { answer, chunks } = await vectorRetrievalTransformationalFlow(filePath, query, "Programming FAQ");
    return { answer, chunks };
  } catch (error) {
    console.error('Error processing vector query:', error);
    throw error;
  }
}

/**
 * Run the vector demo as a standalone script
 */
async function runVectorDemo() {
  console.log('OpenAI Vector Store Retrieval Demo');
  console.log('----------------------------------\n');

  const FILE_PATH = "/Users/roger/Documents/my_projects/open_ai_vector_retrieval_rest_api/test_data.json";
  const userQuery = "Do you know what is Tri tuệ nhân tạo?"; // Example query

  console.log(`Query: "${userQuery}"\n`);
  console.log('Setting up vector store, uploading file, and retrieving information...\n');

  try {
    const { answer, chunks } = await processVectorQuery(userQuery, FILE_PATH);

    console.log('Retrieved Chunks:');
    console.log('-----------------');
    //console.log(chunks);

    console.log('\nGenerated Answer:');
    console.log('-----------------');
    console.log(answer);
  } catch (error) {
    console.error('Error in vector demo:', error);
  }
}

// If running this file directly, run the demo
if (require.main === module) {
  runVectorDemo();
}

// Export the processVectorQuery function for use in other files
module.exports = { processVectorQuery, processVectorCombinationalQuery, processVectorTransformationalQuery };
