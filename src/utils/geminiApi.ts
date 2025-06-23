import axios from 'axios';
import { pdfAnalysisPrompt } from '../prompts/pdfAnalysisPrompt';
import { safeUnlink, extractTextFromPdf } from './pdfUtils';

export async function analyzePdfsWithGemini(pdf1Path: string, pdf2Path: string): Promise<{
  strengths: string[];
  weaknesses: string[];
  alignment: { score: number; reason: string };
}> {
  // 1️⃣ Extract text
  const text1 = await extractTextFromPdf(pdf1Path);
  const text2 = await extractTextFromPdf(pdf2Path);

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
    systemInstruction: pdfAnalysisPrompt,
  };

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
  safeUnlink(pdf1Path);
  safeUnlink(pdf2Path);

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
}
