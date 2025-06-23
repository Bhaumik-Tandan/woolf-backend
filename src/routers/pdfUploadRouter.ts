import { publicProcedure } from '../trpc';
import { z } from 'zod';
import { extractTextFromPdf, safeUnlink } from '../utils/pdfUtils';
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
      // 1️⃣ Extract text
      const text1 = await extractTextFromPdf(input.pdf1Path);
      const text2 = await extractTextFromPdf(input.pdf2Path);

      // 2️⃣ Build payload
      const payload = {
        contents: [
          {
            role: 'user' as const,
            parts: [{ text: `Job Description:\n\n${text1}` }],
          },
          {
            role: 'user' as const,
            parts: [{ text: `Candidate CV:\n\n${text2}` }],
          },
        ],
        systemInstruction: `
Respond with **valid JSON only**, no commentary, no code fences.
Use exactly this schema:
{
  "strengths": [ string, … ],
  "weaknesses": [ string, … ],
  "alignment": {
    "score": number,    // 0–10
    "reason": string    // one-sentence justification
  }
}
`.trim(),
      };

      console.log('Payload to Gemini:', JSON.stringify(payload, null, 2));

      // 3️⃣ Send to Gemini
      const response = await axios.post(
        'https://intertest.woolf.engineering/invoke',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.GEMINI_TOKEN!,
          },
        }
      );

      // 4️⃣ Clean up temp files
      safeUnlink(input.pdf1Path);
      safeUnlink(input.pdf2Path);

      // 5️⃣ Pull out the model’s text
      let raw =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      //  ➡️ Strip markdown fences if present
      raw = raw.trim();
      if (raw.startsWith('```')) {
        // remove leading ```[lang]? and trailing ```
        raw = raw.replace(/^```[\w]*\r?\n/, '').replace(/\r?\n```$/, '');
      }

      // 6️⃣ Parse JSON
      let result;
      try {
        result = JSON.parse(raw);
      } catch (err: any) {
        throw new Error(
          `Failed to parse JSON from Gemini: ${err.message}\n\nCleaned body:\n${raw}`
        );
      }

      // 7️⃣ Return the structured data
      return result as {
        strengths: string[];
        weaknesses: string[];
        alignment: { score: number; reason: string };
      };
    }),
};
