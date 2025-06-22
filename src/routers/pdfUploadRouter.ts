import { publicProcedure } from '../trpc';
import { z } from 'zod';
import { extractTextFromPdf, safeUnlink } from '../utils/pdfUtils';
import { GenerateContentRequest } from '../types/pdfUpload';
import axios from 'axios';

export const pdfUploadRouter = {
  analyze: publicProcedure
    .input(
      z.object({
        pdf1Path: z.string(),
        pdf2Path: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // 1) Extract text from both PDFs
      const text1 = await extractTextFromPdf(input.pdf1Path);
      const text2 = await extractTextFromPdf(input.pdf2Path);

      // 2) Build LLM payload according to new interface
      const payload: GenerateContentRequest = {
        model: 'gemini-1.5-flash',
        contents: [
          { type: 'text', text: `Job Description:\n${text1}` },
          { type: 'text', text: `Candidate CV:\n${text2}` },
        ],
        systemInstruction: 
          '1) Summarize strengths and weaknesses.\n2) Rate alignment to the job.',
      };

      console.log('Payload to Gemini:', JSON.stringify(payload, null, 2),process.env.GEMINI_TOKEN);

      // 3) Call Gemini endpoint via axios
      const response = await axios.post(
        'https://intertest.woolf.engineering/invoke',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.GEMINI_TOKEN}`,
          },
        }
      );
  

      // 4) Clean up temporary files
      safeUnlink(input.pdf1Path);
      safeUnlink(input.pdf2Path);

      // 5) Return parsed JSON
      return response.data;
    }),
};
