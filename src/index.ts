import express from 'express';
import multer from 'multer';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import { createContext } from './trpc';
import { storage } from './config/multerStorage';

const upload = multer({ storage });
const app = express();
const port = process.env.PORT ? +process.env.PORT : 3000;

// tRPC JSON-RPC endpoint (optional additional RPCs)
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Upload endpoint – accepts pdf1 & pdf2
app.post(
  '/upload',
  upload.fields([
    { name: 'pdf1', maxCount: 1 },
    { name: 'pdf2', maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const files = req.files as Record<'pdf1' | 'pdf2', Express.Multer.File[]>;
      const pdf1Path = files.pdf1[0].path;
      const pdf2Path = files.pdf2[0].path;

      // call tRPC procedure
      const caller = appRouter.createCaller(await createContext({ req, res }));
      const analysis = await caller.analyze({ pdf1Path, pdf2Path });

      res.json(analysis);
    } catch (err) {
      next(err);
    }
  }
);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
