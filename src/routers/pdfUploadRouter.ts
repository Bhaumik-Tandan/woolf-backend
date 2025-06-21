\import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pdf from 'pdf-parse';

const pdfUploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = './uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).fields([
  { name: 'jobDescription', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]);

// Helper function to extract text from PDF
const extractTextFromPdf = async (filePath: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
};

pdfUploadRouter.post('/upload-pdfs', (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'An unknown error occurred during upload.' });
    }

    if (!req.files || Object.keys(req.files).length < 2) {
      return res.status(400).json({ error: 'Please upload both a job description and a CV.' });
    }

    const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
    const jobDescriptionFile = uploadedFiles['jobDescription'] ? uploadedFiles['jobDescription'][0] : null;
    const cvFile = uploadedFiles['cv'] ? uploadedFiles['cv'][0] : null;

    if (!jobDescriptionFile || !cvFile || jobDescriptionFile.mimetype !== 'application/pdf' || cvFile.mimetype !== 'application/pdf') {
        jobDescriptionFile && fs.unlinkSync(jobDescriptionFile.path);
        cvFile && fs.unlinkSync(cvFile.path);
        return res.status(400).json({ error: 'Both uploaded files must be PDFs.' });
    }

    try {
      const jobDescriptionText = await extractTextFromPdf(jobDescriptionFile.path);
      const cvText = await extractTextFromPdf(cvFile.path);

      // Clean up uploaded files after processing
      fs.unlinkSync(jobDescriptionFile.path);
      fs.unlinkSync(cvFile.path);

      // Now, pass the extracted text to the AI analysis tRPC procedure
      // This is conceptual, as direct tRPC calls from Express are not typical.
      // Instead, we'll expose a tRPC procedure that the frontend calls *after* getting text.
      // For now, we'll just return the texts.
      res.status(200).json({
        message: 'PDFs processed successfully, ready for AI analysis.',
        jobDescriptionText: jobDescriptionText,
        cvText: cvText
      });

    } catch (pdfError) {
      console.error('Error processing PDFs:', pdfError);
      // Ensure files are deleted even if PDF parsing fails
      jobDescriptionFile && fs.unlinkSync(jobDescriptionFile.path);
      cvFile && fs.unlinkSync(cvFile.path);
      return res.status(500).json({ error: 'Failed to process PDF files.' });
    }
  });
});

export default pdfUploadRouter;