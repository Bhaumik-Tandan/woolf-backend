import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import { createContext, type Context } from './trpc';
import { storage } from './config/multerStorage';

const app = express();
const upload = multer({ storage });

// mount tRPC for any other RPCs
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.post(
  '/upload',
  upload.fields([
    { name: 'pdf1', maxCount: 1 },
    { name: 'pdf2', maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Record<'pdf1' | 'pdf2', Express.Multer.File[]>;
      const pdf1Path = files.pdf1[0].path;
      const pdf2Path = files.pdf2[0].path;

      // Instead of createContext, give createCaller the minimal Context:
      const caller = appRouter.createCaller({} as Context);

      const analysis = await caller.analyze({ pdf1Path, pdf2Path });
      res.json(analysis);
    } catch (err) {
      next(err);
    }
  },
);

app.listen(3000, () => {
  console.log('🚀 Server listening on http://localhost:3000');
});
