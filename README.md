# Woolf Backend

A Node.js/TypeScript backend for PDF analysis using tRPC, Express, and Gemini API.

## Features
- Upload and compare two PDFs (e.g., job description and CV)
- Extracts text from PDFs
- Sends content to Gemini API for structured analysis
- Returns strengths, weaknesses, and alignment score
- Clean, modular codebase using tRPC routers and Express

## Project Structure
```
src/
  config/           # Multer storage config
  expressRouters/   # Express routers (file upload, etc.)
  prompts/          # Prompt templates for Gemini
  routers/          # tRPC routers
  types/            # TypeScript types
  utils/            # Utility functions (PDF, Gemini API, etc.)
  index.ts          # Main server entrypoint
uploads/            # Uploaded PDF files (temporary)
```

## Getting Started

### Prerequisites
- Node.js (18+ recommended)
- Yarn or npm

### Install dependencies
```
yarn install
# or
npm install
```

### Environment Variables
Create a `.env` file in the root with:
```
GEMINI_TOKEN=your_gemini_api_token_here
```

### Development
```
yarn dev
# or
npm run dev
```

### Production
```
yarn build
node dist/index.js
```

## API Endpoints

### Upload PDFs
- `POST /upload` — Upload two PDFs as `pdf1` and `pdf2` (multipart/form-data)
- Returns: JSON analysis from Gemini

### tRPC Endpoint
- `POST /trpc` — tRPC endpoint for programmatic access

