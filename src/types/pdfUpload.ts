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
  model: string;
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
  // …add any other fields you need from the VertexAI type
}
