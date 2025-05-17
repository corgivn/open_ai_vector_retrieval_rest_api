// src/client-example.js
const axios = require('axios');

async function callVectorRetrievalAPI(query) {
    try {
        const response = await axios.post('http://localhost:3000/api/retrieve', {
            query
        });

        console.log('\n--- API Response ---');
        console.log('Query:', response.data.query);
        console.log('\nGenerated Answer:');
        console.log('-----------------');
        console.log(response.data.answer);

        return response.data;
    } catch (error) {
        console.error('Error calling the API:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Example usage
async function runExample() {
    const query = "Enter your query here"; // Replace with your query
    console.log(`Sending query to API: "${query}"`);

    try {
        await callVectorRetrievalAPI(query);
    } catch (error) {
        console.error('Error running example:', error);
    }
}

// If running this file directly
if (require.main === module) {
    runExample();
}

// Export for use in other files
module.exports = { callVectorRetrievalAPI };
