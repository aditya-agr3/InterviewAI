import { Response } from 'express';
import fs from 'fs';
import { AuthRequest } from '../middlewares/auth';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { generateOutreachMessages } from '../services/geminiService';

const normalizeValue = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

export const generateOutreach = async (req: AuthRequest, res: Response): Promise<void> => {
  const resumePath = req.file?.path;

  try {
    const platform = normalizeValue(req.body.platform);
    const jobDescription = normalizeValue(req.body.jobDescription);
    const tone = normalizeValue(req.body.tone) || 'friendly';
    const relationship = normalizeValue(req.body.relationship) || 'cold outreach';
    const length = normalizeValue(req.body.length) || 'medium';
    const companyName = normalizeValue(req.body.companyName);
    const roleTitle = normalizeValue(req.body.roleTitle);
    const recruiterName = normalizeValue(req.body.recruiterName);
    const senderName = normalizeValue(req.body.senderName);

    if (!platform || !jobDescription) {
      res.status(400).json({ message: 'Platform and job description are required' });
      return;
    }

    if (!resumePath) {
      res.status(400).json({ message: 'Resume PDF is required' });
      return;
    }

    let resumeText = '';
    try {
      const pdfInfo = await extractTextFromPDF(resumePath);
      resumeText = pdfInfo.text || '';
    } catch (error: any) {
      console.error('Error extracting resume text:', error);
      res.status(500).json({ message: 'Failed to extract resume text' });
      return;
    }

    const messages = await generateOutreachMessages({
      platform,
      tone,
      relationship,
      length,
      jobDescription,
      resumeText,
      companyName,
      roleTitle,
      recruiterName,
      senderName,
    });

    res.json({ messages });
  } catch (error: any) {
    console.error('Error generating outreach:', error);
    res.status(500).json({ message: error.message || 'Failed to generate outreach messages' });
  } finally {
    if (resumePath && fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
    }
  }
};
