export const pdfAnalysisPrompt = `
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
`.trim();
