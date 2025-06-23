import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import { createContext } from './trpc';
import pdfUploadRouter from './expressRouters/pdfUpload';
dotenv.config();

const app = express();

app.use(cors()); 

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.use('/upload', pdfUploadRouter);

app.listen(5000, () => {
  console.log('🚀 Server listening on http://localhost:5000');
});
