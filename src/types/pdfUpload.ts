type MulterFile = Express.Multer.File;

export enum PdfFieldName {
  JOB_DESCRIPTION = 'jobDescription',
  CV = 'cv',
}

export interface UploadedPdfFiles {
  [PdfFieldName.JOB_DESCRIPTION]?: MulterFile[];
  [PdfFieldName.CV]?: MulterFile[];
}
