import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { MulterFile } from '../types/multer';

// Create documents uploads directory if it doesn't exist
const documentsDir = path.join(__dirname, '../../uploads/documents');
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (_req: Request, _file: MulterFile, cb: (error: Error | null, destination: string) => void) => {
    cb(null, documentsDir);
  },
  filename: (_req: Request, file: MulterFile, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter callback type
type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

// File filter for PDFs only
const fileFilter = (_req: Request, file: MulterFile, cb: FileFilterCallback) => {
  const isPDF = file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf';

  if (isPDF) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

export const uploadPDF = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for PDFs
  },
  fileFilter,
});
