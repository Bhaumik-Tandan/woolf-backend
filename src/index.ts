import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import { createContext } from './trpc';
import pdfUploadRouter from './expressRouters/pdfUpload';

const app = express();

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.use('/upload', pdfUploadRouter);

app.listen(3000, () => {
  console.log('🚀 Server listening on http://localhost:3000');
});
