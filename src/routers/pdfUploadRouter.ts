// src/routers/pdfUploadRouter.ts
import { publicProcedure } from '../trpc';
import { z } from 'zod';
import { extractTextFromPdf, safeUnlink } from '../utils/pdfUtils';
import { GenerateContentRequest } from '../types/pdfUpload';

export const pdfUploadRouter = {
  analyze: publicProcedure
    .input(
      z.object({
        pdf1Path: z.string(),
        pdf2Path: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // 1) Extract text
      const text1 = await extractTextFromPdf(input.pdf1Path);
      const text2 = await extractTextFromPdf(input.pdf2Path);


      // 2) Build LLM payload
      const payload: GenerateContentRequest = {
        model: 'gemini-1.5-flash',
        prompt: `
Here’s the job description:
${text1}

Here’s the candidate CV:
${text2}

1) Summarize strengths/weaknesses.
2) Rate alignment to the job.`,
      };

      // 3) Dynamically import node-fetch so you don't `require()` an ESM-only package
      const { default: fetch } = await import('node-fetch');

      const resp = await fetch('https://intertest.woolf.engineering/invoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GEMINI_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await resp.json();

      // 4) Clean up temp files
      safeUnlink(input.pdf1Path);
      safeUnlink(input.pdf2Path);

      return json;
    }),
};
