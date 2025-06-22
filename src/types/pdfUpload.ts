type MulterFile = Express.Multer.File;

export enum PdfFieldName {
  JOB_DESCRIPTION = 'jobDescription',
  CV = 'cv',
}

export interface UploadedPdfFiles {
  [PdfFieldName.JOB_DESCRIPTION]?: MulterFile[];
  [PdfFieldName.CV]?: MulterFile[];
}

// Mirror GenerateContentRequest from @google-cloud/vertexai
export interface GenerateContentRequest {
  /** Specifies which model to use for generation */
  model: string;

  /** An array of text segments to feed into the LLM */
  contents: {
    type: 'text';
    text: string;
  }[];

  /** Optional system instructions to guide the model */
  systemInstruction?: string;

  /** Sampling temperature: higher values produce more random outputs */
  temperature?: number;

  /** Maximum number of tokens to generate */
  maxOutputTokens?: number;

  /** Nucleus sampling probability */
  topP?: number;

  /** Top-K sampling cutoff */
  topK?: number;

  // …add any other fields you need from the VertexAI type
}

/**
 * Sample payload matching GenerateContentRequest:
 *
 * ```json
 * {
 *   "model": "gemini-1.5-flash",
 *   "contents": [
 *     { "type": "text", "text": "Here’s the job description:\n${text1}" },
 *     { "type": "text", "text": "Here’s the candidate CV:\n${text2}" }
 *   ],
 *   "systemInstruction": "1) Summarize strengths and weaknesses.\n2) Rate alignment to the job.",
 *   "temperature": 0.7,
 *   "maxOutputTokens": 512,
 *   "topP": 0.9,
 *   "topK": 40
 * }
 * ```
 */

