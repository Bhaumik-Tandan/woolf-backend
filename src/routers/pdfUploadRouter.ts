import { publicProcedure } from '../trpc';
import { z } from 'zod';
import { analyzePdfsWithGemini } from '../utils/geminiApi';

export const pdfUploadRouter = {
  analyze: publicProcedure
    .input(
      z.object({
        pdf1Path: z.string(),
        pdf2Path: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return analyzePdfsWithGemini(input.pdf1Path, input.pdf2Path);
    }),
};
