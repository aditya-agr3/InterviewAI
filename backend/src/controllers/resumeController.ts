import { Response } from 'express';
import Resume, { IResume } from '../models/Resume';
import { AuthRequest } from '../middlewares/auth';
import path from 'path';
import fs from 'fs';

// Get all resumes for a user
export const getResumes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resumes = await Resume.find({ userId: req.userId })
      .select('-personalInfo -experience -education -skills')
      .sort({ updatedAt: -1 });

    res.json({ resumes });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Failed to fetch resumes' });
  }
};

// Get a single resume
export const getResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.userId,
    });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    res.json({ resume });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Failed to fetch resume' });
  }
};

// Create a new resume
export const createResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resumeData = req.body;

    const resume = new Resume({
      userId: req.userId,
      ...resumeData,
    });

    await resume.save();

    res.status(201).json({
      message: 'Resume created successfully',
      resume,
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ message: 'Failed to create resume' });
  }
};

// Update a resume
export const updateResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;
    const updateData = req.body;

    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId: req.userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    res.json({
      message: 'Resume updated successfully',
      resume,
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: 'Failed to update resume' });
  }
};

// Delete a resume
export const deleteResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.userId,
    });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    // Delete profile image if exists
    if (resume.personalInfo.profileImage) {
      const imagePath = path.join(__dirname, '../../uploads', path.basename(resume.personalInfo.profileImage));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Resume.findByIdAndDelete(resumeId);

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Failed to delete resume' });
  }
};

// Upload profile image
export const uploadProfileImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;

    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.userId,
    });

    if (!resume) {
      // Delete uploaded file if resume not found
      const filePath = path.join(__dirname, '../../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    // Delete old image if exists
    if (resume.personalInfo.profileImage) {
      const oldImagePath = path.join(__dirname, '../../uploads', path.basename(resume.personalInfo.profileImage));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update resume with new image path
    const imageUrl = `/uploads/${req.file.filename}`;
    resume.personalInfo.profileImage = imageUrl;
    await resume.save();

    res.json({
      message: 'Image uploaded successfully',
      imageUrl,
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};
