import express from 'express';
import multer from 'multer';
import { storage } from '../config/multerStorage';
import { appRouter } from '../routers';
import { createContext, type Context } from '../trpc';

const router = express.Router();
const upload = multer({ storage });

router.post(
  '/',
  upload.fields([
    { name: 'pdf1', maxCount: 1 },
    { name: 'pdf2', maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
        
      if (
        !req.files ||
        !('pdf1' in req.files) ||
        !('pdf2' in req.files) ||
        !req.files['pdf1'][0] ||
        !req.files['pdf2'][0]
      ) {
        return res.status(400).json({ error: 'Both pdf1 and pdf2 are required.' });
      }
      const files = req.files as Record<'pdf1' | 'pdf2', Express.Multer.File[]>;
      const pdf1Path = files.pdf1[0].path;
      const pdf2Path = files.pdf2[0].path;

      const caller = appRouter.createCaller({} as Context);
      const analysis = await caller.analyze({ pdf1Path, pdf2Path });
      res.json(analysis);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
