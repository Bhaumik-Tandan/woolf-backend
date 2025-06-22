import { router } from '../trpc';
import { pdfUploadRouter } from './pdfUploadRouter';

export const appRouter = router({
  analyze: pdfUploadRouter.analyze,
});

// for client inference
export type AppRouter = typeof appRouter;
