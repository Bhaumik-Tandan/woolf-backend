import { diskStorage } from 'multer';
import path from 'path';

// store under /uploads with original filename + timestamp
export const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    const ts = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${ts}${ext}`);
  },
});
