import { publicProcedure } from '../trpc';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { extractTextFromPdf } from '../utils/pdfUtils';
import fetch from 'node-fetch';
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
      const raw1 = readFileSync(input.pdf1Path);
      const raw2 = readFileSync(input.pdf2Path);
      const text1 = await extractTextFromPdf(raw1);
      const text2 = await extractTextFromPdf(raw2);

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
        // add other fields (temperature, maxOutputTokens…) if you like
      };

      // 3) Call Gemini endpoint
      const resp = await fetch('https://intertest.woolf.engineering/invoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GEMINI_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await resp.json();
      return json;
    }),
};
