import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = './uploads';

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
