import fs from 'fs';
import pdf from 'pdf-parse';

export const extractTextFromPdf = async (filePath: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
};

export const safeUnlink = (filePath?: string) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
