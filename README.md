# OpenAI Vector Retrieval

A JavaScript project that demonstrates how to use OpenAI's API for text generation and vector embeddings with a simple vector retrieval system.

## Features

- Connect to OpenAI API using API keys
- Generate text using OpenAI's GPT models
- Create vector embeddings from text
- Implement a basic vector retrieval system for semantic search
- Use OpenAI's Vector Stores API for advanced retrieval
- Implement RAG (Retrieval Augmented Generation) pattern
- Calculate cosine similarity between vectors
- **Interactive Chat Interface** - Real-time chat with OpenAI's AI models
- **Multiple Creativity Types** - Support for reproductive, combinational, and transformational creativity modes

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Usage

### Run the basic example

```
npm start
```

This will execute the main index.js file which demonstrates text generation and embedding creation.

### Run the vector retrieval demo

```
npm run demo
```

This will execute the demo.js file which shows how to find similar documents based on semantic meaning.

### Run the OpenAI Vector Stores demo

```
npm run vector-demo
```

This will execute the vector-demo.js file which demonstrates the RAG (Retrieval Augmented Generation) pattern using OpenAI's Vector Stores API.

### Run the REST API server

```
npm start
```

This will start a REST API server on port 3000 (default) that clients can call to use the vector retrieval functionality.

### Test the REST API client

```
npm run client
```

This runs a simple client example that calls the REST API.

### Access the web UI

Once the server is running, you can access the web UI at:

```
http://localhost:3000/
```

### Access the Chat Interface

For interactive AI chat functionality:

```
http://localhost:3000/chat.html
```

## Project Structure

- `src/index.js` - Main entry point with basic examples
- `src/openai-service.js` - Service for interacting with OpenAI API
- `src/vector-retrieval.js` - Implementation of vector similarity search and vector stores
- `src/demo.js` - Demonstration of basic vector retrieval functionality
- `src/vector-demo.js` - Demonstration of OpenAI Vector Store with RAG pattern
- `src/server.js` - REST API server for vector retrieval service and chat functionality
- `src/client-example.js` - Example client for the REST API
- `public/index.html` - Web UI for the vector retrieval service with creativity modes
- `public/chat.html` - Interactive chat interface with OpenAI

## How It Works

### Basic Vector Retrieval
1. Text is converted to numerical vectors (embeddings) using OpenAI's embedding models
2. These vectors represent the semantic meaning of the text in high-dimensional space
3. Similar texts will have similar vector representations
4. Cosine similarity is used to measure how similar two vectors are
5. This allows for semantic search - finding documents with similar meaning, not just keyword matches

### OpenAI Vector Stores with RAG Pattern
1. Create a vector store in OpenAI's platform
2. Upload and process knowledge files into the vector store
3. Query the vector store with natural language questions
4. Retrieve relevant text chunks based on semantic similarity
5. Feed these chunks along with the question to an LLM to generate a contextual answer

### REST API Integration
1. The REST API server exposes the vector retrieval functionality via HTTP endpoints
2. Client applications can send queries to the `/api/retrieve` endpoint
3. The server processes the query and returns the generated answer
4. The API supports both programmatic access and browser-based access via the web UI

## License

ISC
