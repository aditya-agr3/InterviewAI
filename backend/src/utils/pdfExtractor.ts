import fs from 'fs';
import path from 'path';

export interface PDFInfo {
  text: string;
  pageCount: number;
}

/**
 * Extract text from PDF file
 * pdf-parse v2.4.5 is an ES module that exports a PDFParse class
 */
export const extractTextFromPDF = async (filePath: string): Promise<PDFInfo> => {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error('PDF file not found');
    }

    // Read PDF file
    const dataBuffer = fs.readFileSync(filePath);
    
    // pdf-parse v2.4.5 is an ES module, use dynamic import
    const pdfParseModule = await import('pdf-parse');
    const PDFParse = pdfParseModule.PDFParse;
    
    // Create parser instance with buffer data
    const parser = new PDFParse({ data: dataBuffer });
    
    // Extract text
    const textResult = await parser.getText();
    const text = textResult.text || '';
    
    // Get page count from document info
    const info = await parser.getInfo({ parsePageInfo: true });
    const pageCount = info.total || 0;
    
    // Clean up parser
    await parser.destroy();
    
    return {
      text,
      pageCount,
    };
  } catch (error: any) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${error?.message || 'Unknown error'}`);
  }
};
